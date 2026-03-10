/**
 * OpenClaw 事件映射器
 *
 * 将 OpenClaw 事件（chat、agent 等）转换为 ChatEngine 统一的 AIMessageContent 格式
 *
 * 支持的 stream 类型：
 * - assistant：文本流（标准文本对话）
 * - tool：工具调用流（start → args → result → end 四阶段）
 * - activity：Activity 组件流（snapshot / delta 增量合并）
 */
import type { AIMessageContent, TextContent, ToolCall } from '../../type';
import type { OpenClawEventFrame, ChatEventPayload, AgentEventPayload } from './types';
import { OpenClawEventType, ChatEventState, AgentStreamType, AgentDataType } from './types/events';

// 从共享层引入通用工具函数
import {
  createToolCallContent,
  createActivityContent,
  mergeStringContent,
  updateToolCall,
  handleSuggestionToolCall,
} from '../shared';
import { activityManager } from '../shared/activity-manager';

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
   */
  private mapChatEvent(payload: ChatEventPayload): EventMapResult {
    const { state, message, runId, errorMessage } = payload;

    this.currentRunId = runId || this.currentRunId;

    switch (state) {
      case ChatEventState.DELTA:
        return this.handleChatDelta(message);

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
   * 处理 chat delta（增量更新）
   *
   * chat 事件的 message.content 包含全量文本快照。
   * 需要计算与上次的增量，只返回新增部分，
   * 因为 ChatEngine 的 text handler 会拼接内容。
   */
  private handleChatDelta(message?: ChatEventPayload['message']): EventMapResult {
    if (!message?.content) {
      return { content: null, isFinal: false, hasError: false };
    }

    // 从 content 数组中提取文本（全量快照）
    const text = this.extractTextFromContent(message.content);
    if (text === null) {
      return { content: null, isFinal: false, hasError: false };
    }

    // 计算增量
    const prevBuffer = this.textBuffer;
    this.textBuffer = text;
    const delta = text.startsWith(prevBuffer) ? text.slice(prevBuffer.length) : text;

    if (!delta) {
      return { content: null, isFinal: false, hasError: false };
    }

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

    // 根据 stream 类型分发
    switch (stream) {
      case AgentStreamType.TOOL:
        return this.handleToolStream(data);

      case AgentStreamType.ACTIVITY:
        return this.handleActivityStream(data);

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

      case AgentDataType.TOOL_CALL:
        return this.handleToolCall(data);

      case AgentDataType.TOOL_RESULT:
        return this.handleToolResult(data);

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
   * OpenClaw tool stream data 约定：
   * {
   *   toolCallId: string,       // 工具调用 ID
   *   toolCallName: string,     // 工具名称
   *   state: 'start' | 'args' | 'result' | 'end',
   *   delta?: string,           // args 增量
   *   content?: string,         // result 内容
   *   args?: string,            // 全量 args（snapshot 模式）
   *   result?: string,          // 全量 result（snapshot 模式）
   *   parentMessageId?: string, // 父消息 ID
   * }
   */
  private handleToolStream(data: AgentEventPayload['data']): EventMapResult {
    if (!data?.toolCallId) {
      return { content: null, isFinal: false, hasError: false };
    }

    const { toolCallId, toolCallName, state } = data;

    switch (state) {
      case 'start':
        return this.handleToolCallStart(toolCallId as string, toolCallName as string, data);
      case 'args':
        return this.handleToolCallArgs(toolCallId as string, data);
      case 'result':
        return this.handleToolCallResult(toolCallId as string, data);
      case 'end':
        return this.handleToolCallEnd(toolCallId as string);
      default:
        // 兜底：如果没有 state，尝试从 data 推断
        return this.handleToolCallGeneric(data);
    }
  }

  /**
   * 处理工具调用开始
   */
  private handleToolCallStart(toolCallId: string, toolCallName: string, data: AgentEventPayload['data']): EventMapResult {
    this.toolCallMap[toolCallId] = {
      eventType: 'TOOL_CALL_START',
      toolCallId,
      toolCallName: toolCallName || 'unknown',
      parentMessageId: (data?.parentMessageId as string) || '',
      args: (data?.args as string) || (data?.delta as string) || '',
    };

    return {
      content: createToolCallContent(this.toolCallMap[toolCallId], 'pending', 'append'),
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
  }

  /**
   * 处理工具调用参数增量
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
   * 处理工具调用结果
   */
  private handleToolCallResult(toolCallId: string, data: AgentEventPayload['data']): EventMapResult {
    if (!this.toolCallMap[toolCallId]) {
      return { content: null, isFinal: false, hasError: false };
    }

    const currentResult = this.toolCallMap[toolCallId].result || '';
    const newResult = mergeStringContent(
      currentResult,
      (data?.content as string) || (data?.result as string) || '',
    );

    this.toolCallMap[toolCallId] = updateToolCall(this.toolCallMap[toolCallId], {
      eventType: 'TOOL_CALL_RESULT',
      result: newResult,
    });

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
   * 处理工具调用结束
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
   * 兜底处理工具调用数据（无 state 字段时）
   */
  private handleToolCallGeneric(data: AgentEventPayload['data']): EventMapResult {
    if (!data?.toolCallId) {
      return { content: null, isFinal: false, hasError: false };
    }

    const toolCallId = data.toolCallId as string;
    const toolCallName = data.toolCallName as string;

    // 如果还没有这个 toolCall 的记录，当作 start 处理
    if (!this.toolCallMap[toolCallId]) {
      return this.handleToolCallStart(toolCallId, toolCallName, data);
    }

    // 如果有 delta/args，当作 args 更新
    if (data.delta || data.args) {
      return this.handleToolCallArgs(toolCallId, data);
    }

    // 如果有 content/result，当作 result 更新
    if (data.content || data.result) {
      return this.handleToolCallResult(toolCallId, data);
    }

    return { content: null, isFinal: false, hasError: false };
  }

  // ==================== 旧版 Tool 处理（兼容 assistant stream 中的 type 字段） ====================

  /**
   * 处理旧版工具调用（通过 type 字段而非 stream=tool）
   */
  private handleToolCall(data?: AgentEventPayload['data']): EventMapResult {
    if (!data?.toolCallId) {
      return { content: null, isFinal: false, hasError: false };
    }
    return this.handleToolCallStart(
      data.toolCallId as string,
      (data.toolCallName as string) || 'unknown',
      data,
    );
  }

  /**
   * 处理旧版工具结果（通过 type 字段而非 stream=tool）
   */
  private handleToolResult(data?: AgentEventPayload['data']): EventMapResult {
    if (!data?.toolCallId) {
      return { content: null, isFinal: false, hasError: false };
    }
    return this.handleToolCallResult(data.toolCallId as string, data);
  }

  // ==================== Activity Stream ====================

  /**
   * 处理 activity stream
   *
   * 直接复用 activityManager 的 snapshot/delta 处理逻辑。
   *
   * OpenClaw activity stream data 约定：
   * {
   *   activityType: string,                  // Activity 组件类型
   *   state: 'snapshot' | 'delta',           // 全量 or 增量
   *   content?: Record<string, any>,         // snapshot 全量数据
   *   patch?: any[],                         // delta JSON Patch 数组
   *   messageId?: string,                    // 关联消息 ID
   * }
   */
  private handleActivityStream(data: AgentEventPayload['data']): EventMapResult {
    if (!data?.activityType) {
      return { content: null, isFinal: false, hasError: false };
    }

    const activityType = data.activityType as string;
    const state = data.state as string;

    // 将 OpenClaw 的 state 映射为 AG-UI 兼容的事件 type
    const eventType = state === 'snapshot' ? 'ACTIVITY_SNAPSHOT' : 'ACTIVITY_DELTA';

    // 委托给 activityManager 处理（复用 AG-UI 的 snapshot/delta 合并逻辑）
    const activityData = activityManager.handleActivityEvent({
      type: eventType,
      activityType,
      content: data.content as Record<string, any>,
      patch: data.patch as any[],
      messageId: data.messageId as string,
    });

    if (!activityData) {
      return { content: null, isFinal: false, hasError: false };
    }

    // 判断是否需要 append（新建内容块）
    const isSnapshot = state === 'snapshot';
    // 首次 delta 时 activityManager 内部已经处理了初始化
    const existingActivity = activityManager.getActivity(activityType);
    const isFirstEvent = isSnapshot || (!existingActivity && state === 'delta');

    return {
      content: createActivityContent(
        activityType,
        activityData.content,
        'streaming',
        isFirstEvent ? 'append' : 'merge',
        activityData.deltaInfo,
      ),
      isFinal: false,
      hasError: false,
      runId: this.currentRunId || undefined,
    };
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
   * 从 content 数组中提取文本
   */
  private extractTextFromContent(content: Array<{ type: string; text?: string }>): string | null {
    if (!Array.isArray(content)) {
      return null;
    }

    return content
      .filter((c) => c?.type === 'text' && c?.text)
      .map((c) => c.text!)
      .join('');
  }

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
    activityManager.clear();
  }
}
