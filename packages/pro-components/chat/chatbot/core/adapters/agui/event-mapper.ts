/* eslint-disable class-methods-use-this */
import type { AIMessageContent, SSEChunkData, ToolCall } from '../../type';
import { stateManager } from '../../../components/state/StateManager';
import { EventType } from './events';

/**
 * AGUIEventMapper
 * 将AG-UI协议事件（SSEChunkData）转换为AIContentChunkUpdate
 * 支持多轮对话、增量文本、工具调用、思考、状态快照、消息快照等基础事件
 * 同时提供状态变更和步骤生命周期事件的分发机制
 */
export class AGUIEventMapper {
  private toolCallMap: Record<string, ToolCall> = {};

  private toolCallEnded: Set<string> = new Set(); // 记录已经TOOL_CALL_END的工具调用

  /**
   * 合并字符串内容，处理JSON和普通字符串
   */
  private mergeStringContent(existing: string | undefined, delta: string): string {
    if (!existing) return delta;

    // 尝试解析为JSON，如果是有效的JSON则合并
    try {
      const existingObj = JSON.parse(existing);
      const deltaObj = JSON.parse(delta);

      // 如果是对象，进行深度合并
      if (typeof existingObj === 'object' && typeof deltaObj === 'object') {
        return JSON.stringify({ ...existingObj, ...deltaObj });
      }

      // 如果是数组，进行数组合并
      if (Array.isArray(existingObj) && Array.isArray(deltaObj)) {
        return JSON.stringify([...existingObj, ...deltaObj]);
      }

      // 其他情况，直接替换
      return delta;
    } catch (error) {
      // 不是有效的JSON，按普通字符串处理
      return existing + delta;
    }
  }

  /**
   * 主入口：将SSE事件转换为AIContentChunkUpdate
   *
   * @param chunk SSE数据块，其中data字段可能是字符串（需要解析）或已解析的对象
   */
  mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
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
      case EventType.THINKING_TEXT_MESSAGE_START:
        return {
          type: 'thinking',
          data: { title: event.title || '思考中...' },
          status: 'streaming',
          strategy: 'append',
          ext: {
            collapsed: false,
          },
        };
      case EventType.THINKING_TEXT_MESSAGE_CONTENT:
        return {
          type: 'thinking',
          data: { text: event.delta },
          status: 'streaming',
          strategy: 'merge',
          ext: {
            collapsed: false,
          },
        };
      case EventType.THINKING_TEXT_MESSAGE_END:
        return {
          type: 'thinking',
          data: { title: event.title || '思考结束' },
          status: 'complete',
          strategy: 'merge',
          ext: {
            collapsed: true,
          },
        };

      case EventType.TOOL_CALL_START:
        // 初始化工具调用
        this.toolCallMap[event.toolCallId] = {
          eventType: 'TOOL_CALL_START',
          toolCallId: event.toolCallId,
          toolCallName: event.toolCallName,
          parentMessageId: event.parentMessageId || '',
        };
        // 返回工具调用内容块
        return {
          type: 'toolcall',
          data: this.toolCallMap[event.toolCallId],
          status: 'pending',
          strategy: 'append',
        };

      case EventType.TOOL_CALL_ARGS:
        // 更新工具调用的参数
        if (this.toolCallMap[event.toolCallId]) {
          const currentArgs = this.toolCallMap[event.toolCallId].args || '';
          const newArgs = this.mergeStringContent(currentArgs, event.delta || '');

          // 更新内部ToolCall对象
          this.toolCallMap[event.toolCallId] = {
            ...this.toolCallMap[event.toolCallId],
            eventType: 'TOOL_CALL_ARGS',
            args: newArgs,
          };

          return {
            type: 'toolcall',
            data: this.toolCallMap[event.toolCallId],
            status: 'streaming',
            strategy: 'merge',
          };
        }
        return null;

      case EventType.TOOL_CALL_CHUNK:
        // 更新工具调用的chunk
        if (this.toolCallMap[event.toolCallId]) {
          const currentChunk = this.toolCallMap[event.toolCallId].chunk || '';
          const newChunk = this.mergeStringContent(currentChunk, event.delta || '');

          // 更新内部ToolCall对象
          this.toolCallMap[event.toolCallId] = {
            ...this.toolCallMap[event.toolCallId],
            eventType: 'TOOL_CALL_CHUNK',
            chunk: newChunk,
          };

          return {
            type: 'toolcall',
            data: this.toolCallMap[event.toolCallId],
            status: 'streaming',
            strategy: 'merge',
          };
        }
        return null;

      case EventType.TOOL_CALL_RESULT:
        // 更新工具调用的结果
        if (this.toolCallMap[event.toolCallId]) {
          const currentResult = this.toolCallMap[event.toolCallId].result || '';
          const newResult = this.mergeStringContent(currentResult, event.content || '');

          // 更新内部ToolCall对象
          this.toolCallMap[event.toolCallId] = {
            ...this.toolCallMap[event.toolCallId],
            eventType: 'TOOL_CALL_RESULT',
            result: newResult,
          };

          return {
            type: 'toolcall',
            data: this.toolCallMap[event.toolCallId],
            status: 'complete',
            strategy: 'merge',
          };
        }
        return null;

      case EventType.TOOL_CALL_END:
        // 标记工具调用结束
        this.toolCallEnded.add(event.toolCallId);
        return null;

      case EventType.STATE_SNAPSHOT:
      case EventType.STATE_DELTA:
        // 将状态事件推送到状态管理器，使用广播机制
        stateManager.handleStateEvent(event);
        return null; // 让业务层通过useStateSubscription订阅状态变化

      case EventType.MESSAGES_SNAPSHOT:
        return this.handleMessagesSnapshot(event.messages);
      case EventType.CUSTOM:
        return this.handleCustomEvent(event);
      case EventType.RUN_ERROR:
        return [
          {
            type: 'text',
            data: event.message || event.error || '系统未知错误',
            status: 'error',
          },
        ];
      default:
        return null;
    }
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

  private handleMessagesSnapshot(messages: any[]): AIMessageContent[] {
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

  private handleCustomEvent(event: any): AIMessageContent {
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

  reset() {
    this.toolCallMap = {};
    this.toolCallEnded.clear();
  }
}

export default AGUIEventMapper;
