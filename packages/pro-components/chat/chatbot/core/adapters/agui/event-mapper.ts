/* eslint-disable class-methods-use-this */
import type { AIMessageContent, SSEChunkData, ToolCall } from '../../type';
import { stateManager } from './state-manager';
import { EventType, isTextMessageEvent, isThinkingEvent, isToolCallEvent, isStateEvent } from './events';
import {
  handleCustomEvent,
  handleMessagesSnapshot,
  mergeStringContent,
  parseSSEData,
  createMarkdownContent,
  createReasoningContent,
  createThinkingContent,
  createToolCallContent,
  createTextContent,
  updateToolCall,
  handleSuggestionToolCall,
  updateReasoningData,
  addToReasoningData,
} from './utils';

/**
 * AGUIEventMapper
 * 将AG-UI协议事件（SSEChunkData）转换为AIContentChunkUpdate
 * 支持多轮对话、增量文本、工具调用、思考、状态快照、消息快照等基础事件
 * 同时提供状态变更和步骤生命周期事件的分发机制
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
  }

  /**
   * 处理文本消息事件
   */
  private handleTextMessageEvent(event: any): AIMessageContent | null {
    switch (event.type) {
      case EventType.TEXT_MESSAGE_START:
        return createMarkdownContent('', 'streaming', 'append');
      case EventType.TEXT_MESSAGE_CHUNK:
      case EventType.TEXT_MESSAGE_CONTENT:
      case EventType.TEXT_MESSAGE_END:
        return createMarkdownContent(
          event.delta || '',
          event.type === EventType.TEXT_MESSAGE_END ? 'complete' : 'streaming',
          'merge',
        );
      default:
        return null;
    }
  }

  /**
   * 处理思考事件
   */
  private handleThinkingEvent(event: any): AIMessageContent | null {
    switch (event.type) {
      case EventType.THINKING_START:
        return this.handleThinkingStart();
      case EventType.THINKING_TEXT_MESSAGE_START:
        return this.handleThinkingTextStart(event);
      case EventType.THINKING_TEXT_MESSAGE_CONTENT:
        return this.handleThinkingTextContent(event);
      case EventType.THINKING_TEXT_MESSAGE_END:
        return this.handleThinkingTextEnd(event);
      case EventType.THINKING_END:
        return this.handleThinkingEnd();
      default:
        return null;
    }
  }

  /**
   * 处理工具调用事件
   */
  private handleToolCallEvent(event: any): AIMessageContent | null {
    switch (event.type) {
      case EventType.TOOL_CALL_START:
        return this.handleToolCallStart(event);
      case EventType.TOOL_CALL_ARGS:
        return this.handleToolCallArgs(event);
      case EventType.TOOL_CALL_CHUNK:
        return this.handleToolCallChunk(event);
      case EventType.TOOL_CALL_RESULT:
        return this.handleToolCallResult(event);
      case EventType.TOOL_CALL_END:
        return this.handleToolCallEnd(event);
      default:
        return null;
    }
  }

  /**
   * 处理状态事件
   */
  private handleStateEvent(event: any): null {
    stateManager.handleStateEvent(event);
    return null; // 让业务层通过useStateSubscription订阅状态变化
  }

  /**
   * 处理其他事件
   */
  private handleOtherEvent(event: any): AIMessageContent | AIMessageContent[] | null {
    switch (event.type) {
      case EventType.MESSAGES_SNAPSHOT:
        return handleMessagesSnapshot(event.messages);
      case EventType.CUSTOM:
        return handleCustomEvent(event);
      case EventType.RUN_ERROR:
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
    // 初始化工具调用
    this.toolCallMap[event.toolCallId] = {
      eventType: 'TOOL_CALL_START',
      toolCallId: event.toolCallId,
      toolCallName: event.toolCallName,
      parentMessageId: event.parentMessageId || '',
    };

    const toolCallContent = createToolCallContent(this.toolCallMap[event.toolCallId], 'pending');

    if (this.reasoningContext.active) {
      // Reasoning 模式：添加 toolcall 到 reasoning.data
      const { data, index } = addToReasoningData(this.reasoningContext.currentData, toolCallContent);
      this.reasoningContext.currentData = data;
      this.reasoningContext.currentDataIndex = index;

      return createReasoningContent(data, 'streaming', 'merge', false);
    }
    // 独立模式：返回独立的工具调用内容块
    return { ...toolCallContent, strategy: 'append' };
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
   * 处理工具调用块事件
   */
  private handleToolCallChunk(event: any): AIMessageContent | null {
    if (!this.toolCallMap[event.toolCallId]) return null;

    const currentChunk = this.toolCallMap[event.toolCallId].chunk || '';
    const newChunk = mergeStringContent(currentChunk, event.delta || '');

    // 更新内部ToolCall对象
    this.toolCallMap[event.toolCallId] = updateToolCall(this.toolCallMap[event.toolCallId], {
      eventType: 'TOOL_CALL_CHUNK',
      chunk: newChunk,
    });

    return this.updateToolCallInContext(event.toolCallId, 'streaming');
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
      eventType: EventType.TOOL_CALL_RESULT,
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
  private handleToolCallEnd(event: any): null {
    // 标记工具调用结束
    this.toolCallEnded.add(event.toolCallId);
    return null;
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
        if (currentContent.type === 'toolcall') {
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
