/* eslint-disable class-methods-use-this */
import type { AIMessageContent, SSEChunkData } from '../../type';
import { EventType } from './events';

/**
 * AGUIEventMapper
 * 将AG-UI协议事件（SSEChunkData）转换为AIMessageContent[]
 * 支持多轮对话、增量文本、工具调用、思考、状态快照、消息快照等基础事件
 */
export class AGUIEventMapper {
  private currentMessageId: string | null = null;

  private currentContent: AIMessageContent[] = [];

  private toolCallMap: Record<string, any> = {};

  /**
   * 主入口：将SSE事件转换为AIMessageContent[]
   */
  mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
    const event = chunk.data;
    if (!event?.type) return null;
    switch (event.type) {
      case 'TEXT_MESSAGE_START':
        return {
          type: 'markdown',
          status: 'streaming',
          data: '',
          strategy: 'append',
        };
      case 'TEXT_MESSAGE_CHUNK':
      case 'TEXT_MESSAGE_END':
        return {
          type: 'markdown',
          status: event.type === 'TEXT_MESSAGE_END' ? 'complete' : 'streaming',
          data: event.delta || '',
          strategy: 'merge',
        };
      case EventType.THINKING_START:
        return {
          type: 'thinking',
          data: { title: event.title || '思考中...' },
          status: 'streaming',
          strategy: 'append',
        };
      case EventType.THINKING_TEXT_MESSAGE_CONTENT:
        return { type: 'thinking', data: { text: event.delta }, status: 'streaming', strategy: 'merge' };
      case EventType.THINKING_END:
        console.log('=====think end', event);
        return { type: 'thinking', data: { title: event.title || '思考结束' }, status: 'complete' };

      case EventType.TOOL_CALL_START:
      case EventType.TOOL_CALL_ARGS:
        this.toolCallMap[event.toolCallId] = {
          name: event.toolCallName,
          arguments: event.type === 'TOOL_CALL_ARGS' ? event.delta : '',
        };
        if (event.toolCallName === 'search') {
          return {
            type: 'search',
            data: {
              title: '联网搜索中',
              references: [],
            },
            status: 'pending',
          };
        }
        return null;
      case EventType.TOOL_CALL_CHUNK:
      case EventType.TOOL_CALL_RESULT:
        console.log('====parsed', event);
        if (event.toolCallName === 'search') {
          let parsed = {
            title: '搜索中',
            references: [],
          };
          try {
            parsed = JSON.parse(event?.delta || event?.content);
          } catch {}
          return {
            type: 'search',
            data: parsed,
            status: event.type === 'TOOL_CALL_RESULT' ? 'complete' : 'streaming',
          };
        }
        return null;
      case EventType.STATE_SNAPSHOT:
        return this.handleStateSnapshot(event.snapshot);
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

  private handleStateSnapshot(snapshot: any): AIMessageContent[] {
    // 只取assistant消息
    if (!snapshot?.messages) return [];
    return snapshot.messages.flatMap((msg: any) => {
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
        data: event.value?.suggestions || [],
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
    this.currentMessageId = null;
    this.currentContent = [];
    this.toolCallMap = {};
  }
}

export default AGUIEventMapper;
