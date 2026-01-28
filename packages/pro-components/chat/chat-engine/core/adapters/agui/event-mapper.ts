/* eslint-disable class-methods-use-this */
import type { AIMessageContent, SSEChunkData, ToolCall } from '../../type';
import {
  AGUIEventType,
  isActivityEvent,
  isStateEvent,
  isTextMessageEvent,
  isThinkingEvent,
  isToolCallEvent,
} from './types/events';
import { stateManager } from './StateManager';
import { activityManager } from './ActivityManager';
import {
  addToReasoningData,
  createActivityContent,
  createMarkdownContent,
  createReasoningContent,
  createTextContent,
  createThinkingContent,
  createToolCallContent,
  handleCustomEvent,
  handleMessagesSnapshot,
  handleSuggestionToolCall,
  mergeStringContent,
  parseSSEData,
  updateReasoningData,
  updateToolCall,
} from './utils';

/**
 * AGUIEventMapper
 * 将AG-UI协议事件（SSEChunkData）转换为AIContentChunkUpdate
 * 支持多轮对话、增量文本、工具调用、思考、状态快照、消息快照等基础事件
 * 同时提供状态变更和步骤生命周期事件的分发机制
 * 
 * 支持简化模式：
 * - TEXT_MESSAGE_CHUNK：自动补全 Start → Content → End 生命周期
 * - TOOL_CALL_CHUNK：自动补全 Start → Args → End 生命周期
 */
export class AGUIEventMapper {
  private toolCallMap: Record<string, ToolCall> = {};

  private toolCallEnded: Set<string> = new Set(); // 记录已经TOOL_CALL_END的工具调用

  // Reasoning 上下文状态管理
  private reasoningContext: {
    active: boolean;
    currentData: AIMessageContent[];
    currentDataIndex: number;
  } = {
    active: false,
    currentData: [],
    currentDataIndex: 0,
  };

  /**
   * 暴露 activityManager，供 AGUIAdapter 访问
   */
  public get activityManager() {
    return activityManager;
  }

  // 简化模式状态跟踪
  private currentTextMessageId: string | null = null; // 当前正在处理的文本消息 ID

  private currentTextMessageRole: 'assistant' | 'system' | null = null; // 当前正在处理的文本消息角色

  private toolCallChunkStarted: Set<string> = new Set(); // 已自动触发 TOOL_CALL_START 的 toolCallId

  /**
   * 主入口：将SSE事件转换为AIContentChunkUpdate
   *
   * @param chunk SSE数据块，其中data字段可能是字符串（需要解析）或已解析的对象
   */
  mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
    // 处理data字段，可能是字符串或已解析的对象
    const event = parseSSEData(chunk.data);
    
    if (!event?.type) return null;

    // 根据事件类型分发到不同的处理函数
    if (isTextMessageEvent(event.type)) {
      return this.handleTextMessageEvent(event);
    }

    if (isThinkingEvent(event.type)) {
      return this.handleThinkingEvent(event);
    }

    if (isToolCallEvent(event.type)) {
      return this.handleToolCallEvent(event);
    }

    if (isActivityEvent(event.type)) {
      return this.handleActivityEvent(event);
    }

    if (isStateEvent(event.type)) {
      return this.handleStateEvent(event);
    }

    // 处理其他事件类型
    return this.handleOtherEvent(event);
  }

  /**
   * 获取当前所有工具调用
   */
  getToolCalls(): ToolCall[] {
    return Object.values(this.toolCallMap);
  }

  /**
   * 清除指定工具调用
   */
  clearToolCall(toolCallId: string): void {
    delete this.toolCallMap[toolCallId];
    this.toolCallEnded.delete(toolCallId);
    this.toolCallChunkStarted.delete(toolCallId);
  }

  /**
   * 获取指定工具调用
   */
  getToolCall(toolCallId: string): ToolCall | undefined {
    return this.toolCallMap[toolCallId];
  }

  /**
   * 检查工具调用是否已结束
   */
  isToolCallEnded(toolCallId: string): boolean {
    return this.toolCallEnded.has(toolCallId);
  }

  reset() {
    this.toolCallMap = {};
    this.toolCallEnded.clear();
    this.resetReasoningContext();
    // 重置简化模式状态
    this.currentTextMessageId = null;
    this.currentTextMessageRole = null;
    this.toolCallChunkStarted.clear();
    // 清理 activityManager 状态
    activityManager.clear();
  }

  /**
   * 处理文本消息事件
   * 
   * 支持两种模式：
   * 1. 标准模式：TEXT_MESSAGE_START → TEXT_MESSAGE_CONTENT → TEXT_MESSAGE_END
   * 2. 简化模式：仅发送 TEXT_MESSAGE_CHUNK，自动补全生命周期
   */
  private handleTextMessageEvent(event: any): AIMessageContent | null {
    switch (event.type) {
      case AGUIEventType.TEXT_MESSAGE_START:
        this.currentTextMessageId = event.messageId || null; // 标记当前消息 ID
        return createMarkdownContent('', 'streaming', 'append');

      case AGUIEventType.TEXT_MESSAGE_CHUNK:
        return this.handleTextMessageChunk(event);

      case AGUIEventType.TEXT_MESSAGE_CONTENT:
        return createMarkdownContent(event.delta || '', 'streaming', 'merge');

      case AGUIEventType.TEXT_MESSAGE_END:
        this.currentTextMessageId = null; // 重置状态
        return createMarkdownContent(event.delta || '', 'complete', 'merge');

      default:
        return null;
    }
  }

  /**
   * 处理简化模式的 TEXT_MESSAGE_CHUNK 事件
   * 自动补全 Start → Content → End 生命周期
   * 
   * 关键：通过 messageId 区分不同的文本块，
   * 当 messageId 变化时创建新的内容块
   */
  private handleTextMessageChunk(event: any): AIMessageContent | null {
    const messageId = event.messageId || 'default';
    const role = event?.role || 'assistant';
    
    // 如果是新的 messageId，需要创建新的内容块
    if (this.currentTextMessageId !== messageId) {
      this.currentTextMessageId = messageId;
      this.currentTextMessageRole = role;
      // 创建新内容块，使用 append 策略，通过 ext.role 传递角色信息
      return createMarkdownContent(event.delta || '', 'streaming', 'append', role);
    }

    // 同一个 messageId，使用 merge 策略追加内容
    return createMarkdownContent(event.delta || '', 'streaming', 'merge', this.currentTextMessageRole || role);
  }

  /**
   * 处理思考事件
   */
  private handleThinkingEvent(event: any): AIMessageContent | null {
    switch (event.type) {
      case AGUIEventType.THINKING_START:
        return this.handleThinkingStart();
      case AGUIEventType.THINKING_TEXT_MESSAGE_START:
        return this.handleThinkingTextStart(event);
      case AGUIEventType.THINKING_TEXT_MESSAGE_CONTENT:
        return this.handleThinkingTextContent(event);
      case AGUIEventType.THINKING_TEXT_MESSAGE_END:
        return this.handleThinkingTextEnd(event);
      case AGUIEventType.THINKING_END:
        return this.handleThinkingEnd();
      default:
        return null;
    }
  }

  /**
   * 处理工具调用事件
   * 
   * 支持两种模式：
   * 1. 标准模式：TOOL_CALL_START → TOOL_CALL_ARGS → TOOL_CALL_END
   * 2. 简化模式：仅发送 TOOL_CALL_CHUNK，自动补全生命周期
   */
  private handleToolCallEvent(event: any): AIMessageContent | null {
    switch (event.type) {
      case AGUIEventType.TOOL_CALL_START:
        return this.handleToolCallStart(event);
      case AGUIEventType.TOOL_CALL_ARGS:
        return this.handleToolCallArgs(event);
      case AGUIEventType.TOOL_CALL_CHUNK:
        return this.handleToolCallChunk(event);
      case AGUIEventType.TOOL_CALL_RESULT:
        return this.handleToolCallResult(event);
      case AGUIEventType.TOOL_CALL_END:
        return this.handleToolCallEnd(event);
      default:
        return null;
    }
  }

  /**
   * 处理活动事件
   * 委托给 activityManager 进行状态管理和订阅通知
   * 
   * 支持两种模式：
   * 1. 标准模式：先收到 ACTIVITY_SNAPSHOT，后续 ACTIVITY_DELTA 基于 snapshot 增量更新
   * 2. 纯增量模式：没有 ACTIVITY_SNAPSHOT，直接收到 ACTIVITY_DELTA，自动初始化空内容
   * 
   * 注意：不同 activityType 的活动是独立管理的，互不影响
   */
  private handleActivityEvent(event: any): AIMessageContent | null {
    const activityType = event.activityType || 'unknown';
    // 委托给 activityManager 处理
    const activityData = activityManager.handleActivityEvent(event);
    if (!activityData) {
      return null;
    }

    // 根据事件类型决定 strategy
    const isSnapshot = event.type === AGUIEventType.ACTIVITY_SNAPSHOT;
    const isFirstDelta = event.type === AGUIEventType.ACTIVITY_DELTA && !activityManager.getActivity(activityType);

    return createActivityContent(
      activityType,
      activityData.content,
      'streaming',
      // SNAPSHOT 或首次 DELTA 使用 append 创建新内容块，后续使用 merge
      isSnapshot || isFirstDelta ? 'append' : 'merge',
      activityData.deltaInfo,
    );
  }

  /**
   * 处理状态事件
   */
  private handleStateEvent(event: any): null {
    stateManager.handleStateEvent(event);
    return null;
  }

  /**
   * 处理其他事件
   */
  private handleOtherEvent(event: any): AIMessageContent | AIMessageContent[] | null {
    switch (event.type) {
      case AGUIEventType.MESSAGES_SNAPSHOT:
        return handleMessagesSnapshot(event.messages);
      case AGUIEventType.CUSTOM:
        return handleCustomEvent(event);
      case AGUIEventType.RUN_ERROR:
        return [createTextContent(event.message || event.error || '系统未知错误', 'error')];
      default:
        return null;
    }
  }

  /**
   * 处理思考开始事件
   */
  private handleThinkingStart(): AIMessageContent {
    // 激活 reasoning 上下文
    this.reasoningContext.active = true;
    this.reasoningContext.currentData = [];
    this.reasoningContext.currentDataIndex = 0;

    return createReasoningContent([], 'streaming', 'append', false);
  }

  /**
   * 处理思考文本开始事件
   */
  private handleThinkingTextStart(event: any): AIMessageContent | null {
    if (this.reasoningContext.active) {
      // Reasoning 模式：添加新的 text 内容到 reasoning.data
      const newTextContent = createTextContent('', 'streaming');
      const { data, index } = addToReasoningData(this.reasoningContext.currentData, newTextContent);
      this.reasoningContext.currentData = data;
      this.reasoningContext.currentDataIndex = index;

      return createReasoningContent(data, 'streaming', 'merge', false);
    }
    // 独立模式：创建独立的 thinking 内容
    return createThinkingContent({ title: event.title || '思考中...' }, 'streaming', 'append', false);
  }

  /**
   * 处理思考文本内容事件
   */
  private handleThinkingTextContent(event: any): AIMessageContent | null {
    if (this.reasoningContext.active) {
      // Reasoning 模式：更新最后一个 text 内容
      const currentIndex = this.reasoningContext.currentDataIndex;
      if (currentIndex >= 0 && this.reasoningContext.currentData[currentIndex]) {
        const currentContent = this.reasoningContext.currentData[currentIndex];
        if (currentContent.type === 'text') {
          const currentText = currentContent.data || '';
          const newText = mergeStringContent(currentText, event.delta || '');
          const updatedContent = { ...currentContent, data: newText, status: 'streaming' };

          this.reasoningContext.currentData = updateReasoningData(
            this.reasoningContext.currentData,
            currentIndex,
            updatedContent,
          );

          return createReasoningContent(this.reasoningContext.currentData, 'streaming', 'merge', false);
        }
      }
      return null;
    }
    // 独立模式：更新独立的 thinking 内容
    return createThinkingContent({ text: event.delta }, 'streaming', 'merge', false);
  }

  /**
   * 处理思考文本结束事件
   */
  private handleThinkingTextEnd(event: any): AIMessageContent | null {
    if (this.reasoningContext.active) {
      // Reasoning 模式：标记最后一个 text 内容为完成
      const currentIndex = this.reasoningContext.currentDataIndex;
      if (currentIndex >= 0 && this.reasoningContext.currentData[currentIndex]) {
        const currentContent = this.reasoningContext.currentData[currentIndex];
        if (currentContent.type === 'text') {
          const updatedContent = { ...currentContent, status: 'complete' };
          this.reasoningContext.currentData = updateReasoningData(
            this.reasoningContext.currentData,
            currentIndex,
            updatedContent,
          );

          return createReasoningContent(this.reasoningContext.currentData, 'streaming', 'merge', false);
        }
      }
      return null;
    }
    // 独立模式：完成独立的 thinking 内容
    return createThinkingContent({ title: event.title || '思考结束' }, 'complete', 'merge', true);
  }

  /**
   * 处理思考结束事件
   */
  private handleThinkingEnd(): AIMessageContent | null {
    if (this.reasoningContext.active) {
      // 完成 reasoning 并重置上下文
      const finalData = [...this.reasoningContext.currentData];
      this.resetReasoningContext();

      return createReasoningContent(finalData, 'complete', 'merge', true);
    }
    return null;
  }

  /**
   * 处理工具调用开始事件
   */
  private handleToolCallStart(event: any): AIMessageContent | null {
    // 标记已显式开始（防止后续 chunk 重复触发 start）
    this.toolCallChunkStarted.add(event.toolCallId);
    
    // 初始化工具调用
    this.toolCallMap[event.toolCallId] = {
      eventType: 'TOOL_CALL_START',
      toolCallId: event.toolCallId,
      toolCallName: event.toolCallName,
      parentMessageId: event.parentMessageId || '',
    };

    // 每个toocallstart都会开始一个新的内容块，使用append（添加新的工具调用，使用不同的渲染组件）
    const toolCallContent = createToolCallContent(this.toolCallMap[event.toolCallId], 'pending', 'append');

    if (this.reasoningContext.active) {
      // Reasoning 模式：添加 toolcall 到 reasoning.data
      const { data, index } = addToReasoningData(this.reasoningContext.currentData, toolCallContent);
      this.reasoningContext.currentData = data;
      this.reasoningContext.currentDataIndex = index;

      return createReasoningContent(data, 'streaming', 'merge', false);
    }
    // 独立模式：返回独立的工具调用内容块
    // 通过 type (toolcall-${toolCallName}) + strategy 来控制是否合并
    return toolCallContent;
  }

  /**
   * 处理工具调用参数事件
   */
  private handleToolCallArgs(event: any): AIMessageContent | null {
    if (!this.toolCallMap[event.toolCallId]) return null;

    const currentArgs = this.toolCallMap[event.toolCallId].args || '';
    const newArgs = mergeStringContent(currentArgs, event.delta || '');

    // 更新内部ToolCall对象
    this.toolCallMap[event.toolCallId] = updateToolCall(this.toolCallMap[event.toolCallId], {
      eventType: 'TOOL_CALL_ARGS',
      args: newArgs,
    });

    return this.updateToolCallInContext(event.toolCallId, 'streaming');
  }

  /**
   * 处理简化模式的 TOOL_CALL_CHUNK 事件
   * 自动补全 Start → Args → End 生命周期
   * 
   * TOOL_CALL_CHUNK 事件结构：
   * - toolCallId: 工具调用ID（可选，首次时自动生成）
   * - toolCallName: 工具名称（首次必需）
   * - delta: 参数增量内容
   * - parentMessageId: 父消息ID（可选）
   */
  private handleToolCallChunk(event: any): AIMessageContent | null {
    // 生成或使用 toolCallId
    const toolCallId = event.toolCallId || `auto_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    // 检查是否是该 toolCallId 的第一个 chunk
    const isFirstChunk = !this.toolCallChunkStarted.has(toolCallId) && !this.toolCallMap[toolCallId];
    
    if (isFirstChunk) {
      // 自动触发 TOOL_CALL_START 逻辑
      this.toolCallChunkStarted.add(toolCallId);
      
      // 重置当前文本消息 ID，确保后续文本消息创建新内容块
      this.currentTextMessageId = null;
      
      // 初始化工具调用
      this.toolCallMap[toolCallId] = {
        eventType: 'TOOL_CALL_START',
        toolCallId,
        toolCallName: event.toolCallName || 'unknown',
        parentMessageId: event.parentMessageId || '',
        args: event.delta || '', // 第一个 chunk 的 delta 作为初始 args
      };

      // 创建新的工具调用内容块
      const toolCallContent = createToolCallContent(this.toolCallMap[toolCallId], 'streaming', 'append');

      if (this.reasoningContext.active) {
        // Reasoning 模式：添加 toolcall 到 reasoning.data
        const { data, index } = addToReasoningData(this.reasoningContext.currentData, toolCallContent);
        this.reasoningContext.currentData = data;
        this.reasoningContext.currentDataIndex = index;

        return createReasoningContent(data, 'streaming', 'merge', false);
      }
      
      return toolCallContent;
    }

    // 后续 chunk：更新 args
    if (!this.toolCallMap[toolCallId]) return null;

    const currentArgs = this.toolCallMap[toolCallId].args || '';
    const newArgs = mergeStringContent(currentArgs, event.delta || '');

    // 更新内部ToolCall对象
    this.toolCallMap[toolCallId] = updateToolCall(this.toolCallMap[toolCallId], {
      eventType: 'TOOL_CALL_CHUNK',
      args: newArgs,
    });

    return this.updateToolCallInContext(toolCallId, 'streaming');
  }

  /**
   * 处理工具调用结果事件
   */
  private handleToolCallResult(event: any): AIMessageContent | null {
    if (!this.toolCallMap[event.toolCallId]) return null;

    const currentResult = this.toolCallMap[event.toolCallId].result || '';
    const newResult = mergeStringContent(currentResult, event.content || '');

    // 更新内部ToolCall对象
    this.toolCallMap[event.toolCallId] = updateToolCall(this.toolCallMap[event.toolCallId], {
      eventType: AGUIEventType.TOOL_CALL_RESULT,
      result: newResult,
    });

    // 处理 suggestion 特殊情况
    const suggestionContent = handleSuggestionToolCall(this.toolCallMap[event.toolCallId]);
    if (suggestionContent) {
      if (this.reasoningContext.active) {
        // Reasoning 模式：替换最后一个 toolcall 为 suggestion
        const currentIndex = this.reasoningContext.currentDataIndex;
        if (currentIndex >= 0 && this.reasoningContext.currentData[currentIndex]) {
          this.reasoningContext.currentData = updateReasoningData(
            this.reasoningContext.currentData,
            currentIndex,
            suggestionContent,
          );

          return createReasoningContent(this.reasoningContext.currentData, 'streaming', 'merge', false);
        }
      } else {
        // 独立模式：返回 suggestion
        return suggestionContent;
      }
    }

    return this.updateToolCallInContext(event.toolCallId, 'complete');
  }

  /**
   * 处理工具调用结束事件
   */
  private handleToolCallEnd(event: any) {
    // 标记工具调用结束
    this.toolCallEnded.add(event.toolCallId);
    
    // 更新 toolCallMap 中的 eventType
    if (this.toolCallMap[event.toolCallId]) {
      this.toolCallMap[event.toolCallId] = {
        ...this.toolCallMap[event.toolCallId],
        eventType: AGUIEventType.TOOL_CALL_END,
      };
    }
    
    return this.updateToolCallInContext(event.toolCallId, 'complete');
  }

  /**
   * 在上下文中更新工具调用
   */
  private updateToolCallInContext(toolCallId: string, status: 'streaming' | 'complete'): AIMessageContent | null {
    if (this.reasoningContext.active) {
      // Reasoning 模式：更新 reasoning.data 中的 toolcall
      const currentIndex = this.reasoningContext.currentDataIndex;
      if (currentIndex >= 0 && this.reasoningContext.currentData[currentIndex]) {
        const currentContent = this.reasoningContext.currentData[currentIndex];
        const currentType = currentContent.type;

        // 检查 type 是否匹配（toolcall-${toolCallName}）
        if (currentType.startsWith('toolcall')) {
          const updatedContent = {
            ...currentContent,
            data: this.toolCallMap[toolCallId],
            status,
          };

          this.reasoningContext.currentData = updateReasoningData(
            this.reasoningContext.currentData,
            currentIndex,
            updatedContent,
          );

          return createReasoningContent(this.reasoningContext.currentData, 'streaming', 'merge', false);
        }
      }
      return null;
    }
    // 独立模式：返回独立的 toolcall 更新
    // 通过相同的 type (toolcall-${toolCallName}) 来实现 merge
    return createToolCallContent(this.toolCallMap[toolCallId], status, 'merge');
  }

  /**
   * 重置 reasoning 上下文
   */
  private resetReasoningContext(): void {
    this.reasoningContext = {
      active: false,
      currentData: [],
      currentDataIndex: 0,
    };
  }
}

export default AGUIEventMapper;
