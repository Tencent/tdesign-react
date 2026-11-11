/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatEngineEventType } from '@tdesign/web-components-chat/chat-engine';

import type {
  ChatEngine,
  ChatJSONObject,
  ChatJSONValue,
  ChatRequestParams,
  Interrupt,
} from '@tdesign/web-components-chat/chat-engine';

/** 单个中断的本地响应状态 */
export type InterruptResponseStatus = 'pending' | 'resolved' | 'cancelled';

export interface UseInterruptReturn {
  /** 当前所有开放中断 */
  interrupts: Interrupt[];
  /** 是否存在待处理中断 */
  hasPending: boolean;
  /** 每个中断的本地响应状态（interruptId -> 状态），用于多中断逐个响应的进度展示 */
  responses: Record<string, InterruptResponseStatus>;
  /** 是否所有开放中断都已收到响应（resolved / cancelled），可安全恢复 */
  isFullyResolved: boolean;
  /** 恢复请求是否进行中，用于禁用交互、避免重复提交 */
  resuming: boolean;
  /** 记录单个中断的响应；拒绝通过 payload 表达，如 `{ approved: false }` */
  resolve: (interruptId: string, payload?: ChatJSONValue, metadata?: ChatJSONObject) => void;
  /** 放弃单个中断，不携带 payload */
  cancel: (interruptId: string, metadata?: ChatJSONObject) => void;
  /**
   * 发起恢复轮：仅在全部中断已响应时执行，否则返回 false 不发起。
   * resume 数组由适配器构建，threadId/runId 自动透传。
   */
  resume: (params?: ChatRequestParams) => Promise<string | false>;
  /** 对全部开放中断使用同一 payload 响应后恢复（适用于单个确认框场景） */
  resolveAll: (payload?: ChatJSONValue, metadata?: ChatJSONObject) => Promise<string | false>;
  /** 放弃全部开放中断后恢复 */
  cancelAll: (metadata?: ChatJSONObject) => Promise<string | false>;
  /** 清空开放中断记录 */
  clear: () => void;
}

export interface UseInterruptOptions {
  /** 响应 / 恢复过程中抛出 AGUIError 时的回调（如中断过期、未知 id） */
  onError?: (error: unknown) => void;
}

/**
 * AG-UI 中断（Interrupt / Human-in-the-Loop）Hook
 *
 * 监听 `AGUI_RUN_INTERRUPT` 事件维护开放中断列表，记录恢复所需的 threadId / runId，
 * 跟踪每个中断的响应状态，并提供响应（resolve / cancel）与恢复（resume）方法。
 * 支持一轮多个中断：逐个响应后，在全部响应（isFullyResolved）时统一恢复。
 *
 * @example 单个确认框
 * const { hasPending, resolveAll, cancelAll } = useInterrupt(chatEngine);
 * hasPending && <Button onClick={() => resolveAll({ approved: true })}>确认</Button>;
 *
 * @example 一轮多个中断
 * const { interrupts, responses, isFullyResolved, resolve, resume } = useInterrupt(chatEngine);
 * interrupts.map((it) => <Form key={it.id} done={responses[it.id] !== 'pending'}
 *   onSubmit={(v) => resolve(it.id, v)} />);
 * isFullyResolved && <Button onClick={() => resume()}>提交全部</Button>;
 *
 * @param chatEngine useChat 返回的 ChatEngine 实例
 * @param options    错误回调等可选配置
 */
export function useInterrupt(chatEngine: ChatEngine, options: UseInterruptOptions = {}): UseInterruptReturn {
  const { onError } = options;
  const [interrupts, setInterrupts] = useState<Interrupt[]>([]);
  const [responses, setResponses] = useState<Record<string, InterruptResponseStatus>>({});
  const [resuming, setResuming] = useState(false);
  // 恢复需复用同一 threadId，一并记录 runId
  const contextRef = useRef<{ threadId?: string; runId?: string }>({});
  // 以 ref 持有最新 onError，避免其变更导致回调重建
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const handleError = useCallback((error: unknown) => {
    if (onErrorRef.current) onErrorRef.current(error);
    else console.error('[useInterrupt]', error);
  }, []);

  // 收到新一轮中断：重置响应状态
  useEffect(() => {
    if (!chatEngine?.eventBus) return undefined;
    const off = chatEngine.eventBus.on(ChatEngineEventType.AGUI_RUN_INTERRUPT, (payload) => {
      contextRef.current = {
        threadId: payload.threadId,
        runId: payload.runId,
      };
      setInterrupts(payload.interrupts);
      setResponses(
        payload.interrupts.reduce<Record<string, InterruptResponseStatus>>((acc, it) => {
          acc[it.id] = 'pending';
          return acc;
        }, {}),
      );
    });
    return off;
  }, [chatEngine]);

  const resolve = useCallback(
    (interruptId: string, payload?: ChatJSONValue, metadata?: ChatJSONObject) => {
      try {
        chatEngine.agui?.resolveInterrupt(interruptId, payload, metadata);
        setResponses((prev) => ({ ...prev, [interruptId]: 'resolved' }));
      } catch (error) {
        handleError(error);
      }
    },
    [chatEngine],
  );

  const cancel = useCallback(
    (interruptId: string, metadata?: ChatJSONObject) => {
      try {
        chatEngine.agui?.cancelInterrupt(interruptId, metadata);
        setResponses((prev) => ({ ...prev, [interruptId]: 'cancelled' }));
      } catch (error) {
        handleError(error);
      }
    },
    [chatEngine],
  );

  // 全部开放中断都已响应才允许恢复
  const allResponded =
    interrupts.length > 0 && interrupts.every((it) => responses[it.id] && responses[it.id] !== 'pending');

  // 统一的恢复流程：可选 prepare 先批量写入响应，再发起恢复并清理本地状态
  const runResume = useCallback(
    async (prepare: (() => void) | undefined, params: ChatRequestParams): Promise<string | false> => {
      if (resuming) return false;
      setResuming(true);
      try {
        prepare?.();
        const messageId = await chatEngine.resumeInterrupt({
          ...contextRef.current,
          ...params,
        });
        setInterrupts([]);
        setResponses({});
        return messageId;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setResuming(false);
      }
    },
    [chatEngine, resuming],
  );

  const resume = useCallback(
    (params: ChatRequestParams = {}) => (allResponded ? runResume(undefined, params) : Promise.resolve<false>(false)),
    [runResume, allResponded],
  );

  const resolveAll = useCallback(
    (payload?: ChatJSONValue, metadata?: ChatJSONObject) =>
      runResume(() => interrupts.forEach((it) => chatEngine.agui?.resolveInterrupt(it.id, payload, metadata)), {}),
    [runResume, interrupts, chatEngine],
  );

  const cancelAll = useCallback(
    (metadata?: ChatJSONObject) =>
      runResume(() => interrupts.forEach((it) => chatEngine.agui?.cancelInterrupt(it.id, metadata)), {}),
    [runResume, interrupts, chatEngine],
  );

  const clear = useCallback(() => {
    chatEngine.agui?.clearInterrupts();
    contextRef.current = {};
    setInterrupts([]);
    setResponses({});
  }, [chatEngine]);

  return {
    interrupts,
    hasPending: interrupts.length > 0,
    responses,
    isFullyResolved: allResponded,
    resuming,
    resolve,
    cancel,
    resume,
    resolveAll,
    cancelAll,
    clear,
  };
}
