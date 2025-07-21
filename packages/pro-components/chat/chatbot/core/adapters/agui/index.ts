/* eslint-disable max-classes-per-file */
import type { AIMessageContent, SSEChunkData } from '../../type';

// export class AGUIEventMapper {
//   private currentMessageId: string | null = null;

//   private currentContent: AIMessageContent[] = [];

//   mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
//     const event = chunk.data;
//     if (!event?.type) return null;

//     switch (event.type) {
//       case EventType.TEXT_MESSAGE_START:
//         this.currentMessageId = event.messageId;
//         this.currentContent = [
//           {
//             type: 'text',
//             data: '',
//             status: 'streaming',
//           },
//         ];
//         return this.currentContent;

//       case EventType.TEXT_MESSAGE_CONTENT:
//         if (!this.currentMessageId) return null;

//         // 更新文本内容
//         const textContent = this.currentContent.find((c) => c.type === 'text');
//         if (textContent && textContent.type === 'text') {
//           textContent.data += event.delta;
//         }
//         return [...this.currentContent];

//       case EventType.TEXT_MESSAGE_END:
//         if (!this.currentMessageId) return null;

//         // 标记文本完成
//         const textContent = this.currentContent.find((c) => c.type === 'text');
//         if (textContent && textContent.type === 'text') {
//           textContent.status = 'complete';
//         }
//         return [...this.currentContent];

//       case EventType.TOOL_CALL_START:
//         this.currentContent.push({
//           type: 'tool_call',
//           data: {
//             name: event.toolCallName,
//             arguments: '',
//           },
//           status: 'pending',
//         });
//         return [...this.currentContent];

//       case EventType.TOOL_CALL_ARGS:
//         const toolCall = this.currentContent.find((c) => c.type === 'tool_call' && c.data?.name === event.toolCallName);
//         if (toolCall && toolCall.type === 'tool_call') {
//           toolCall.data.arguments += event.delta;
//         }
//         return [...this.currentContent];

//       case EventType.TOOL_CALL_RESULT:
//         this.currentContent.push({
//           type: 'text',
//           data: event.content,
//           status: 'complete',
//         });
//         return [...this.currentContent];

//       case EventType.THINKING_START:
//         this.currentContent.push({
//           type: 'thinking',
//           data: { title: '思考中...' },
//           status: 'streaming',
//         });
//         return [...this.currentContent];

//       case EventType.STATE_SNAPSHOT:
//         // 处理状态快照（需要特殊处理）
//         return this.handleStateSnapshot(event.snapshot);

//       default:
//         return null;
//     }
//   }

//   private handleStateSnapshot(snapshot: any): AIMessageContent[] {
//     // 将快照转换为消息内容
//     return snapshot.messages.flatMap((msg: any) => {
//       if (msg.role === 'assistant') {
//         return msg.content.map((content: any) => ({
//           type: content.type,
//           data: content.data,
//           status: 'complete',
//         }));
//       }
//       return [];
//     });
//   }

//   reset() {
//     this.currentMessageId = null;
//     this.currentContent = [];
//   }
// }

export class AGUIEventMapper {
  /**
   * 将AG-UI事件转换为AIMessageContent
   */
  mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
    const event = chunk.data;
    if (!event?.type) return null;

    switch (event.type) {
      case 'TEXT_MESSAGE_START':
      case 'TEXT_MESSAGE_CHUNK':
      case 'TEXT_MESSAGE_END':
        return {
          type: 'markdown',
          status: event.type === 'TEXT_MESSAGE_END' ? 'complete' : 'streaming',
          data: event.data.content || event.data.text || '',
        };

      case 'TOOL_CALL_START':
      case 'TOOL_CALL_CHUNK':
      case 'TOOL_CALL_END':
        return {
          type: 'search',
          data: {
            title: event.data.toolName || 'Tool Call',
            references: [],
          },
        };

      case 'RUN_ERROR':
        return {
          type: 'text',
          data: event.data.error || event.data.message || 'Unknown error',
        };

      case 'CUSTOM':
        // 处理自定义事件，尝试解析为通用格式
        if (event.data.type === 'thinking') {
          return {
            type: 'thinking',
            data: {
              text: event.data.content || event.data.text || '',
              title: event.data.title,
            },
          };
        }

        if (event.data.type === 'search') {
          return {
            type: 'search',
            data: {
              title: 'Search',
              references: [],
            },
          };
        }

        return {
          type: 'text',
          data: event.data.content || event.data.text || JSON.stringify(event.data),
        };

      default:
        // 忽略生命周期事件（RUN_STARTED, RUN_FINISHED等）
        return null;
    }
  }

  // private handleThinkingStart(event: any): ThinkingContent {
  //   return {
  //     type: 'thinking',
  //     data: {
  //       title: event.title || '思考中...',
  //     },
  //     status: 'streaming',
  //   };
  // }

  // private handleThinkingEnd(event: any): ThinkingContent {
  //   return {
  //     type: 'thinking',
  //     status: 'complete',
  //   };
  // }

  // private handleRunStarted(event: any) {}

  // private handleRunFinished(event: any) {}

  // private handleRunError(event: any): ThinkingContent {
  //   return {
  //     type: 'thinking',
  //     data: {
  //       title: '处理出错',
  //       text: event.message || '未知错误',
  //     },
  //     status: 'error',
  //   };
  // }

  // private handleStateSnapshot(event: any): SearchContent | null {
  //   if (!event.snapshot?.references) return null;

  //   return {
  //     type: 'search',
  //     data: {
  //       title: '相关参考资料',
  //       references: event.snapshot.references.map((ref: any) => ({
  //         title: ref.title,
  //         url: ref.url,
  //         content: ref.content,
  //       })),
  //     },
  //     status: 'complete',
  //   };
  // }
}
