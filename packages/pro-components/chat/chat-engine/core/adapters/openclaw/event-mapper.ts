/**
 * OpenClaw 事件映射器
 *
 * 将 OpenClaw 事件（chat、agent 等）转换为 ChatEngine 统一的 AIMessageContent 格式
 *
 * 支持的 stream 类型：
 * - assistant：文本流（标准文本对话）
 * - tool：工具调用流（start → args → result → end 四阶段）
 */
import type { AIMessageContent, TextContent, ToolCall } from '../../type';
import type { OpenClawEventFrame, ChatEventPayload, AgentEventPayload } from './types';
import { OpenClawEventType, ChatEventState, AgentStreamType, AgentDataType } from './types/events';

import {
  createToolCallContent,
  mergeStringContent,
  updateToolCall,
  handleSuggestionToolCall,
} from '../shared';

/**
 * 事件映射结果
 */
export interface EventMapResult {
  /** 映射后的内容 */
  content: AIMessageContent | AIMessageContent[] | null;
  /** 是否是最终消息 */
  isFinal: boolean;
  /** 是否有错误 */
  hasError: boolean;
  /** 错误消息 */
  errorMessage?: string;
  /** 原始运行 ID */
  runId?: string;
}

/**
 * OpenClaw 事件映射器
 */
export class OpenClawEventMapper {
  /** 当前流式文本缓冲 */
  private textBuffer = '';

  /** 当前运行 ID */
  private currentRunId: string | null = null;

  /** 工具调用状态映射（toolCallId → ToolCall） */
  private toolCallMap: Record<string, ToolCall> = {};

  /** 已结束的工具调用 ID 集合 */
  private toolCallEnded: Set<string> = new Set();

  /**
   * 映射 OpenClaw 事件帧到 AIMessageContent
   */
  mapEvent(frame: OpenClawEventFrame): EventMapResult {
    const { event, payload } = frame;

    switch (event) {
      case OpenClawEventType.CHAT:
        return this.mapChatEvent(payload as ChatEventPayload);

      case OpenClawEventType.AGENT:
        return this.mapAgentEvent(payload as AgentEventPayload);

      case OpenClawEventType.CONNECT_CHALLENGE:
        // 握手事件，不产生消息内容
        return { content: null, isFinal: false, hasError: false };

      default:
        // 未知事件，尝试作为通用消息处理
        return this.mapGenericEvent(event, payload);
    }
  }

  // ==================== Chat 事件处理 ====================

  /**
   * 映射 chat 事件
   *
   * 职责划分：
   * - chat 事件只负责会话生命周期管理（final / error / aborted）
   * - chat delta 的文本内容不处理（文本统一从 agent 事件获取）
   *
   * 原因：
   * OpenClaw Gateway 对同一段文本同时推送 agent（stream: "assistant"，增量式）
   * 和 chat（state: "delta"，全量快照式）两种事件。
   * agent 事件面向需要细粒度控制的客户端（前端 UI），
   * chat delta 面向只关心最终消息的客户端（如 WhatsApp/Telegram 适配器）。
   * 如果两者都处理，会导致文本重复。
   */
  private mapChatEvent(payload: ChatEventPayload): EventMapResult {
    const { state, message, runId, errorMessage } = payload;

    this.currentRunId = runId || this.currentRunId;

    switch (state) {
      case ChatEventState.DELTA:
        // chat delta 的文本不处理，文本统一从 agent 事件获取，避免重复
        return { content: null, isFinal: false, hasError: false };

      case ChatEventState.FINAL:
        return this.handleChatFinal(message);

      case ChatEventState.ERROR:
        return {
          content: this.createErrorContent(errorMessage || 'Chat error'),
          isFinal: true,
          hasError: true,
          errorMessage,
          runId: this.currentRunId || undefined,
        };

      case ChatEventState.ABORTED:
        return {
          content: null,
          isFinal: true,
          hasError: false,
          runId: this.currentRunId || undefined,
        };

      default:
        return { content: null, isFinal: false, hasError: false };
    }
  }

  /**
   * 处理 chat final（最终消息）
   *
   * 在实际 OpenClaw 流程中，chat final 在 agent 流式结束后发送。
   * 此时所有文本已通过 agent 事件累积完毕，
   * 所以 final 只需标记完成状态，不应再输出全量内容。
   */
  private handleChatFinal(_message?: ChatEventPayload['message']): EventMapResult {
    // 重置缓冲区
    this.textBuffer = '';

    const textContent: TextContent = {
      type: 'text',
      data: '',
      status: 'complete',
    };

    return {
      content: textContent,
      isFinal: true,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  // ==================== Agent 事件处理（核心分发） ====================

  /**
   * 映射 agent 事件
   *
   * 根据 stream 字段分发到不同的处理器：
   * - assistant / 缺省：文本流
   * - tool：工具调用流
   * - activity：Activity 组件流
   */
  private mapAgentEvent(payload: AgentEventPayload): EventMapResult {
    const { stream, data, runId } = payload;

    this.currentRunId = runId || this.currentRunId;

    console.log(`[OpenClaw EventMapper] agent stream="${stream}", data=`, JSON.stringify(data).slice(0, 300));

    // 根据 stream 类型分发
    switch (stream) {
      case AgentStreamType.TOOL:
        return this.handleToolStream(data);


      case AgentStreamType.LIFECYCLE:
        // lifecycle/system 流是 agent 生命周期事件，不包含文本内容，跳过
        console.log(`[OpenClaw EventMapper] Skipping ${stream} stream event`);
        return { content: null, isFinal: false, hasError: false };

      case AgentStreamType.ASSISTANT:
      case undefined:
      default:
        // assistant 或未指定 stream 类型，走文本流处理
        return this.handleAssistantStream(payload);
    }
  }

  // ==================== Assistant Stream（文本流） ====================

  /**
   * 处理 assistant stream（文本流）
   *
   * 实际 OpenClaw agent 事件格式：
   * {
   *   "type": "event",
   *   "event": "agent",
   *   "payload": {
   *     "runId": "xxx",
   *     "stream": "assistant",
   *     "data": { "text": "全量快照", "delta": "增量" },
   *     "sessionKey": "agent:main:main",
   *     "seq": 12,
   *     "ts": 1772612049089
   *   }
   * }
   */
  private handleAssistantStream(payload: AgentEventPayload): EventMapResult {
    const { type, data } = payload;

    // 优先判断：如果 data 同时包含 text 和 delta，这是实际 OpenClaw 的标准 agent 流式格式
    if (data && typeof data.text === 'string' && typeof data.delta === 'string') {
      return this.handleAgentTextSnapshot(data);
    }

    // 根据显式的 type 字段处理（兼容可能的扩展格式）
    const eventType = type || data?.type;

    switch (eventType) {
      case AgentDataType.TEXT_SNAPSHOT:
      case 'snapshot':
        return this.handleAgentTextSnapshot(data);

      case AgentDataType.TEXT_DELTA:
      case 'delta':
        return this.handleAgentTextDelta(data);

      case AgentDataType.DONE:
      case 'done':
      case 'complete':
      case 'final':
        return this.handleAgentComplete();

      case AgentDataType.ERROR:
      case 'error':
        return {
          content: this.createErrorContent(data?.text || 'Agent error'),
          isFinal: true,
          hasError: true,
          errorMessage: data?.text,
          runId: this.currentRunId || undefined,
        };

      default:
        // 尝试从 data 中提取文本（兜底处理）
        return this.handleAgentGenericData(data);
    }
  }

  /**
   * 处理 agent 文本快照
   *
   * 实际 OpenClaw agent 事件中，data.text 是全量快照，data.delta 是本次增量。
   * ChatEngine 的 text 合并策略是 existing + incoming（拼接），
   * 所以这里必须返回 delta（增量）而非全量快照，否则会导致内容重复。
   * textBuffer 保存全量快照，用于 final 阶段和状态恢复。
   */
  private handleAgentTextSnapshot(data?: AgentEventPayload['data']): EventMapResult {
    const text = data?.text || '';
    const delta = data?.delta;

    if (!text && !delta) {
      return { content: null, isFinal: false, hasError: false };
    }

    // 保存全量快照到 buffer
    this.textBuffer = text;

    // 优先使用 delta（增量），因为 ChatEngine 的 text handler 会拼接内容
    // 如果没有 delta（首条消息），则使用全量 text
    const contentData = (typeof delta === 'string') ? delta : text;

    if (!contentData) {
      return { content: null, isFinal: false, hasError: false };
    }

    const textContent: TextContent = {
      type: 'text',
      data: contentData,
      status: 'streaming',
    };

    return {
      content: textContent,
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 处理 agent 文本增量
   */
  private handleAgentTextDelta(data?: AgentEventPayload['data']): EventMapResult {
    const delta = data?.delta || data?.text || '';
    if (!delta) {
      return { content: null, isFinal: false, hasError: false };
    }

    this.textBuffer += delta;

    const textContent: TextContent = {
      type: 'text',
      data: delta,
      status: 'streaming',
    };

    return {
      content: textContent,
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 处理 agent 完成
   *
   * 完成时不再输出内容（之前的 delta 已经都输出了），
   * 只返回一个空 data + complete 状态来标记结束。
   */
  private handleAgentComplete(): EventMapResult {
    const textContent: TextContent = {
      type: 'text',
      data: '',
      status: 'complete',
    };

    this.textBuffer = '';

    return {
      content: textContent,
      isFinal: true,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 处理通用 agent 数据
   *
   * 兜底处理逻辑：优先使用 delta 增量，避免全量快照被 ChatEngine 拼接导致重复
   */
  private handleAgentGenericData(data?: AgentEventPayload['data']): EventMapResult {
    const text = data?.text;
    const delta = data?.delta;

    // 优先使用 delta 增量
    if (typeof delta === 'string' && delta) {
      this.textBuffer += delta;
      return {
        content: {
          type: 'text',
          data: delta,
          status: 'streaming',
        } as TextContent,
        isFinal: false,
        hasError: false,
        runId: this.currentRunId || undefined,
      };
    }

    // 如果只有 text（全量快照），计算增量后返回
    if (typeof text === 'string' && text) {
      const prevBuffer = this.textBuffer;
      this.textBuffer = text;
      // 如果 text 以之前的 buffer 开头，只返回新增部分
      const contentData = text.startsWith(prevBuffer) ? text.slice(prevBuffer.length) : text;
      if (!contentData) {
        return { content: null, isFinal: false, hasError: false };
      }
      return {
        content: {
          type: 'text',
          data: contentData,
          status: 'streaming',
        } as TextContent,
        isFinal: false,
        hasError: false,
        runId: this.currentRunId || undefined,
      };
    }

    return { content: null, isFinal: false, hasError: false };
  }

  // ==================== Tool Stream（工具调用流） ====================

  /**
   * 处理 tool stream
   *
   * OpenClaw 实际返回的 tool stream data 结构（经过对真实 Gateway 数据抓取确认）：
   *
   * phase: 'start' (开始，包含完整 args):
   * {
   *   phase: 'start',
   *   name: 'read',                    // 工具名称（字段名是 name，不是 toolCallName）
   *   toolCallId: 'read:0',            // 工具调用 ID
   *   args: { file_path: '...' },      // 完整参数对象（非 JSON 字符串，start 阶段就包含全部 args）
   * }
   *
   * phase: 'result' (结果):
   * {
   *   phase: 'result',
   *   name: 'read',
   *   toolCallId: 'read:0',
   *   meta: 'from ~/.openclaw/workspace/memory/2026-03-11.md',  // 结果元信息
   *   isError: true,                   // 是否出错
   * }
   *
   * 注意：
   * 1. 只有 start 和 result 两个 phase（没有 args 和 end 阶段）
   * 2. 字段名是 name 不是 toolCallName
   * 3. args 在 start 阶段就是完整对象，不需要增量拼接
   * 4. result 的具体内容通过 toolResult 角色的消息传递（在 chat final 中），
   *    tool stream 的 result phase 只包含 meta 和 isError
   */
  private handleToolStream(data: AgentEventPayload['data']): EventMapResult {
    if (!data?.toolCallId) {
      return { content: null, isFinal: false, hasError: false };
    }

    // OpenClaw 使用 phase 字段（不是 state），工具名使用 name 字段（不是 toolCallName）
    const phase = (data.phase || data.state) as string;
    const toolCallId = data.toolCallId as string;
    const toolCallName = (data.name || data.toolCallName || 'unknown') as string;

    switch (phase) {
      case 'start':
        return this.handleToolCallStart(toolCallId, toolCallName, data);
      case 'result':
        return this.handleToolCallResult(toolCallId, data);
      case 'args':
        // 兼容 Mock Server 或其他 Gateway 实现可能使用的 args 增量阶段
        return this.handleToolCallArgs(toolCallId, data);
      case 'end':
        // 兼容可能的 end 阶段
        return this.handleToolCallEnd(toolCallId);
      default:
        // 兜底：如果没有 phase/state，尝试从 data 推断
        return this.handleToolCallGeneric(data);
    }
  }

  /**
   * 处理工具调用开始（phase: 'start'）
   *
   * OpenClaw 实际行为：start 阶段就包含完整的 args 对象（不是 JSON 字符串）
   * 因此直接序列化 args 并创建 toolcall 内容
   */
  private handleToolCallStart(toolCallId: string, toolCallName: string, data: AgentEventPayload['data']): EventMapResult {
    // OpenClaw 的 args 在 start 阶段是完整对象，需要序列化为 JSON 字符串
    const rawArgs = data?.args;
    let argsStr = '';
    if (rawArgs !== undefined && rawArgs !== null) {
      argsStr = typeof rawArgs === 'string' ? rawArgs : JSON.stringify(rawArgs);
    }

    this.toolCallMap[toolCallId] = {
      eventType: 'TOOL_CALL_START',
      toolCallId,
      toolCallName: toolCallName || 'unknown',
      parentMessageId: (data?.parentMessageId as string) || '',
      args: argsStr,
    };

    // OpenClaw 的 start 阶段已包含完整 args，状态可以直接标记为 executing（streaming）
    return {
      content: createToolCallContent(this.toolCallMap[toolCallId], 'streaming', 'append'),
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 处理工具调用参数增量（兼容 args 增量阶段）
   */
  private handleToolCallArgs(toolCallId: string, data: AgentEventPayload['data']): EventMapResult {
    if (!this.toolCallMap[toolCallId]) {
      return { content: null, isFinal: false, hasError: false };
    }

    const currentArgs = this.toolCallMap[toolCallId].args || '';
    const newArgs = mergeStringContent(currentArgs, (data?.delta as string) || '');

    this.toolCallMap[toolCallId] = updateToolCall(this.toolCallMap[toolCallId], {
      eventType: 'TOOL_CALL_ARGS',
      args: newArgs,
    });

    return {
      content: createToolCallContent(this.toolCallMap[toolCallId], 'streaming', 'merge'),
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 处理工具调用结果（phase: 'result'）
   *
   * OpenClaw 实际行为：
   * - result phase 的 data 包含 meta（描述性信息）和 isError（是否出错）
   * - 工具调用的具体结果文本通过 chat final 中的 toolResult 角色消息传递
   * - 因此此处不一定有 content/result 文本，但应标记 toolcall 为 complete
   */
  private handleToolCallResult(toolCallId: string, data: AgentEventPayload['data']): EventMapResult {
    if (!this.toolCallMap[toolCallId]) {
      // 如果之前没有 start 事件，先创建 toolcall 记录
      const toolCallName = (data?.name || data?.toolCallName || 'unknown') as string;
      this.toolCallMap[toolCallId] = {
        eventType: 'TOOL_CALL_START',
        toolCallId,
        toolCallName,
        parentMessageId: '',
        args: '',
      };
    }

    // 从 data 中提取结果信息
    const resultContent = (data?.content as string) || (data?.result as string) || '';
    const meta = (data?.meta as string) || '';
    const isError = data?.isError as boolean;

    // 构建 result 文本：优先使用 content/result，其次使用 meta 描述
    const resultStr = resultContent || meta || '';

    this.toolCallMap[toolCallId] = updateToolCall(this.toolCallMap[toolCallId], {
      eventType: 'TOOL_CALL_RESULT',
      result: resultStr,
      ...(isError !== undefined ? { ext: { isError } } : {}),
    });

    this.toolCallEnded.add(toolCallId);

    // 复用 suggestion 特殊处理
    const suggestionContent = handleSuggestionToolCall(this.toolCallMap[toolCallId]);
    if (suggestionContent) {
      return {
        content: suggestionContent,
        isFinal: false,
        hasError: false,
        runId: this.currentRunId || undefined,
      };
    }

    return {
      content: createToolCallContent(this.toolCallMap[toolCallId], 'complete', 'merge'),
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 处理工具调用结束（兼容 end 阶段）
   */
  private handleToolCallEnd(toolCallId: string): EventMapResult {
    this.toolCallEnded.add(toolCallId);

    if (this.toolCallMap[toolCallId]) {
      this.toolCallMap[toolCallId] = {
        ...this.toolCallMap[toolCallId],
        eventType: 'TOOL_CALL_END',
      };
    }

    return {
      content: this.toolCallMap[toolCallId]
        ? createToolCallContent(this.toolCallMap[toolCallId], 'complete', 'merge')
        : null,
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 兜底处理工具调用数据（无 phase/state 字段时）
   */
  private handleToolCallGeneric(data: AgentEventPayload['data']): EventMapResult {
    if (!data?.toolCallId) {
      return { content: null, isFinal: false, hasError: false };
    }

    const toolCallId = data.toolCallId as string;
    const toolCallName = (data.name || data.toolCallName || 'unknown') as string;

    // 如果还没有这个 toolCall 的记录，当作 start 处理
    if (!this.toolCallMap[toolCallId]) {
      return this.handleToolCallStart(toolCallId, toolCallName, data);
    }

    // 如果有 delta/args，当作 args 更新
    if (data.delta || data.args) {
      return this.handleToolCallArgs(toolCallId, data);
    }

    // 如果有 content/result/meta/isError，当作 result 更新
    if (data.content || data.result || data.meta || data.isError !== undefined) {
      return this.handleToolCallResult(toolCallId, data);
    }

    return { content: null, isFinal: false, hasError: false };
  }

  // ==================== 通用事件处理 ====================

  /**
   * 映射通用事件
   */
  private mapGenericEvent(_event: string, payload: unknown): EventMapResult {
    // 尝试从 payload 中提取有用信息
    if (typeof payload === 'object' && payload !== null) {
      const p = payload as Record<string, unknown>;
      const text = p.text || p.content || p.message;
      if (typeof text === 'string') {
        return {
          content: {
            type: 'text',
            data: text,
            status: 'streaming',
          } as TextContent,
          isFinal: false,
          hasError: false,
        };
      }
    }

    return { content: null, isFinal: false, hasError: false };
  }

  // ==================== 工具方法 ====================

  /**
   * 创建错误内容
   */
  private createErrorContent(message: string): TextContent {
    return {
      type: 'text',
      data: `Error: ${message}`,
      status: 'error',
    };
  }

  /**
   * 获取当前文本缓冲
   */
  getTextBuffer(): string {
    return this.textBuffer;
  }

  /**
   * 获取当前运行 ID
   */
  getCurrentRunId(): string | null {
    return this.currentRunId;
  }

  /**
   * 获取指定工具调用
   */
  getToolCall(toolCallId: string): ToolCall | undefined {
    return this.toolCallMap[toolCallId];
  }

  /**
   * 获取所有工具调用
   */
  getToolCalls(): ToolCall[] {
    return Object.values(this.toolCallMap);
  }

  /**
   * 检查工具调用是否已结束
   */
  isToolCallEnded(toolCallId: string): boolean {
    return this.toolCallEnded.has(toolCallId);
  }

  /**
   * 重置映射器状态
   */
  reset(): void {
    this.textBuffer = '';
    this.currentRunId = null;
    this.toolCallMap = {};
    this.toolCallEnded.clear();
  }
}
