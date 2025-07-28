/* eslint-disable class-methods-use-this */
import type { AIContentChunkUpdate, SSEChunkData, ToolCall } from '../../type';
import { EventType } from './events';

/**
 * AGUIEventMapper
 * 将AG-UI协议事件（SSEChunkData）转换为AIContentChunkUpdate
 * 支持多轮对话、增量文本、工具调用、思考、状态快照、消息快照等基础事件
 */
export class AGUIEventMapper {
  private toolCallMap: Record<string, ToolCall> = {};
  private toolCallEnded: Set<string> = new Set(); // 记录已经TOOL_CALL_END的工具调用

  /**
   * 主入口：将SSE事件转换为AIContentChunkUpdate
   * 
   * @param chunk SSE数据块，其中data字段可能是字符串（需要解析）或已解析的对象
   */
  mapEvent(chunk: SSEChunkData): AIContentChunkUpdate | AIContentChunkUpdate[] | null {
    // 处理data字段，可能是字符串或已解析的对象
    let event: any;
    if (typeof chunk.data === 'string') {
      try {
        event = JSON.parse(chunk.data);
      } catch (error) {
        console.warn('Failed to parse event data:', error);
        return null;
      }
    } else {
      event = chunk.data;
    }

    if (!event?.type) return null;
    
    switch (event.type) {
      case EventType.TEXT_MESSAGE_START:
        return {
          type: 'markdown',
          status: 'streaming',
          data: '',
          strategy: 'append',
        };
      case EventType.TEXT_MESSAGE_CHUNK:
      case EventType.TEXT_MESSAGE_CONTENT:
      case EventType.TEXT_MESSAGE_END:
        return {
          type: 'markdown',
          status: event.type === EventType.TEXT_MESSAGE_END ? 'complete' : 'streaming',
          data: event.delta || '',
          strategy: 'merge',
        };
      // case EventType.THINKING_START:
      case EventType.THINKING_TEXT_MESSAGE_START:
        return {
          type: 'thinking',
          data: { title: event.title || '思考中...' },
          status: 'streaming',
          strategy: 'append',
        };
      case EventType.THINKING_TEXT_MESSAGE_CONTENT:
        return { type: 'thinking', data: { text: event.delta }, status: 'streaming', strategy: 'merge' };
      case EventType.THINKING_TEXT_MESSAGE_END:
        return { type: 'thinking', data: { title: event.title || '思考结束' }, status: 'complete' };

      case EventType.TOOL_CALL_START:
        // 初始化工具调用
        this.toolCallMap[event.toolCallId] = {
          id: event.toolCallId,
          type: 'function' as const,
          function: {
            name: event.toolCallName,
            arguments: '', // 初始化为空字符串，后续通过TOOL_CALL_ARGS累积
          },
        };
        // 返回工具调用内容块
        return {
          type: 'toolcall',
          data: [this.toolCallMap[event.toolCallId]],
          status: 'pending',
          strategy: 'append',
        };
      case EventType.TOOL_CALL_ARGS:
        // 更新工具调用的参数
        if (this.toolCallMap[event.toolCallId]) {
          // 累积JSON字符串片段
          const currentArgs = this.toolCallMap[event.toolCallId].function.arguments;
          const newArgs = currentArgs + (event.delta || '');
          
          // 创建新的ToolCall对象，避免修改只读属性
          this.toolCallMap[event.toolCallId] = {
            ...this.toolCallMap[event.toolCallId],
            function: {
              ...this.toolCallMap[event.toolCallId].function,
              arguments: newArgs,
            },
          };
          
          return {
            type: 'toolcall',
            data: [this.toolCallMap[event.toolCallId]],
            status: 'streaming',
            strategy: 'merge',
          };
        }
        return null;
      case EventType.TOOL_CALL_CHUNK:
      case EventType.TOOL_CALL_RESULT:
        return this.createToolCallResponse(event.toolCallId, 'complete');
      case EventType.TOOL_CALL_END:
        return this.createToolCallResponse(event.toolCallId, 'streaming');
      case EventType.STATE_SNAPSHOT:
        return this.handleMessagesSnapshot(event.snapshot?.messages || []);
      case EventType.MESSAGES_SNAPSHOT:
        return this.handleMessagesSnapshot(event.messages);
      case EventType.CUSTOM:
        return this.handleCustomEvent(event);
      case EventType.RUN_ERROR:
        return [
          {
            type: 'text',
            data: event.message || event.error || 'Unknown error',
            status: 'error',
          },
        ];
      default:
        return null;
    }
  }

  /**
   * 获取当前所有工具调用
   * 用于直接设置到消息的toolCalls字段
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

  private handleMessagesSnapshot(messages: any[]): AIContentChunkUpdate[] {
    // 只取assistant消息
    if (!messages) return [];
    return messages.flatMap((msg: any) => {
      if (msg.role === 'assistant' && Array.isArray(msg.content)) {
        return msg.content.map((content: any) => ({
          type: content.type || 'markdown',
          data: content.data,
          status: 'complete',
        }));
      }
      return [];
    });
  }

  private handleCustomEvent(event: any): AIContentChunkUpdate {
    if (event.name === 'suggestion') {
      return {
        type: 'suggestion',
        data: event.value || [],
        status: 'complete',
      };
    }
    // 兜底：以text类型输出
    return {
      type: 'text',
      data: event.value?.content || event.value?.text || JSON.stringify(event.value),
      status: 'complete',
    };
  }

  private createToolCallResponse(toolCallId: string, status: 'streaming' | 'complete'): AIContentChunkUpdate | null {
    if (this.toolCallMap[toolCallId]) {
      // 标记工具调用已结束
      this.toolCallEnded.add(toolCallId);
      return {
        type: 'toolcall',
        data: [this.toolCallMap[toolCallId]],
        status,
        strategy: 'merge',
      };
    }
    return null;
  }

  reset() {
    // this.currentMessageId = null;
    // this.currentContent = [];
    this.toolCallMap = {};
    this.toolCallEnded.clear();
  }
}

export default AGUIEventMapper;
