/**
 * AG-UI 协议流式处理器
 *
 * SSE 数据 → AGUIEventMapper.mapEvent → 用户自定义 onMessage → processMessageResult
 * 同时负责发布 AG-UI 细粒度事件（AGUI_ACTIVITY / AGUI_TOOLCALL）
 */
import type { AGUIAdapter } from '../adapters/agui';
import type { AIMessageContent, SSEChunkData } from '../type';
import { ChatEngineEventType } from '../event-bus';
import { LLMService } from '../server';
import type { IStreamHandler, StreamContext } from './types';

export class AGUIStreamHandler implements IStreamHandler {
  private llmService: LLMService;
  private aguiAdapter: AGUIAdapter;

  constructor(llmService: LLMService, aguiAdapter: AGUIAdapter) {
    this.llmService = llmService;
    this.aguiAdapter = aguiAdapter;
  }

  async handleStream(params, context: StreamContext): Promise<void> {
    const { messageId, config } = context;

    await this.llmService.handleStreamRequest(params, {
      ...config,
      onMessage: (chunk: SSEChunkData) => {
        if (context.getStopReceive() || !messageId) return null;

        let result: AIMessageContent | AIMessageContent[] | null = null;

        // SSE 数据 → AGUIEventMapper.mapEvent → 用户自定义 onMessage(解析后数据 + 原始 chunk)
        // 首先使用 AGUI 适配器进行通用协议解析
        result = this.aguiAdapter.handleAGUIEvent(chunk, {
          onRunStart: (event) => {
            // 重置适配器状态，确保新一轮对话从干净状态开始
            this.aguiAdapter.reset();
            config.onStart?.(JSON.stringify(event));
            // 发布 AGUI 运行开始事件
            context.eventBus.emit(ChatEngineEventType.AGUI_RUN_START, {
              runId: event.runId || '',
              threadId: event.threadId,
              timestamp: Date.now(),
            });
          },
          onRunComplete: (isAborted, requestParams, event) => {
            context.handleComplete(messageId, isAborted, requestParams, event);
            // 发布 AGUI 运行完成事件
            if (!isAborted) {
              context.eventBus.emit(ChatEngineEventType.AGUI_RUN_COMPLETE, {
                runId: event?.runId || '',
                threadId: event?.threadId,
                timestamp: Date.now(),
              });
            }
          },
          onRunError: (error) => {
            context.handleError(messageId, error);
            // 发布 AGUI 运行错误事件
            context.eventBus.emit(ChatEngineEventType.AGUI_RUN_ERROR, {
              error,
            });
          },
        });

        // 然后调用用户自定义的 onMessage，传入解析后的结果和原始数据
        if (config.onMessage) {
          const userResult = config.onMessage(chunk, context.messageStore.getMessageByID(messageId), result);
          // 如果用户返回了自定义结果，使用用户的结果
          if (userResult) {
            result = userResult;
          }
        }

        // 发布流数据事件
        context.eventBus.emit(ChatEngineEventType.REQUEST_STREAM, {
          messageId,
          chunk,
          content: result,
        });

        // 处理消息结果
        context.processMessageResult(messageId, result);
        return result;
      },
      onError: (error) => {
        if (messageId) context.handleError(messageId, error);
      },
      onComplete: (isAborted) => {
        // AGUI 的完成事件由 AGUIAdapter 内部处理，这里只处理中断情况
        if (isAborted && messageId) {
          context.handleComplete(messageId, isAborted, params);
        }
      },
    });
  }

  /**
   * 发布 AG-UI 细粒度事件
   * 根据内容类型分发到对应的事件通道
   *
   * 从 ChatEngine.emitAGUIDetailEvents 移入此处，
   * 因为这完全是 AG-UI 协议的事件细节分发，不应在 ChatEngine 里。
   */
  emitDetailEvents(messageId: string, result: AIMessageContent | AIMessageContent[], eventBus: StreamContext['eventBus']) {
    const contents = Array.isArray(result) ? result : [result];
    for (const content of contents) {
      // Activity 事件
      if ((content as any).data?.activityType) {
        eventBus.emit(ChatEngineEventType.AGUI_ACTIVITY, {
          activityType: (content as any).data.activityType,
          messageId,
          content: (content as any)?.data?.content,
        });
      }

      // ToolCall 事件
      if ((content as any)?.data?.eventType?.startsWith('TOOL_CALL')) {
        eventBus.emit(ChatEngineEventType.AGUI_TOOLCALL, {
          toolCall: (content as any).data,
          eventType: (content as any).data.eventType,
        });
      }
    }
  }
}
