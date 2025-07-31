import type { ChatMessagesData, AIMessageContent } from '../type';

// 历史消息数据结构（后端返回的格式）
// 根据AG-UI协议，明确区分三种消息类型

// 用户消息
export interface UserHistoryMessage {
  id: string;
  role: 'user';
  content: string;
  timestamp: number;
}

// 助手消息 - 可能包含工具调用请求
export interface AssistantHistoryMessage {
  id: string;
  role: 'assistant';
  content?: string;
  reasoning?: string;
  toolCalls?: Array<{
    id: string; // 工具调用ID，与ToolMessage中的toolCallId对应
    type: 'function';
    function: {
      name: string; // 工具名称，如 'get_weather_forecast'
      arguments: string; // 工具参数，JSON字符串
    };
  }>;
  timestamp: number;
}

// 工具调用结果消息
export interface ToolHistoryMessage {
  id: string;
  role: 'tool';
  content: string; // 工具调用结果，JSON字符串
  toolCallId: string; // 对应AssistantMessage中toolCalls的id
  timestamp: number;
}

// 联合类型
export type HistoryMessage = UserHistoryMessage | AssistantHistoryMessage | ToolHistoryMessage;

/**
 * 历史消息转换器
 * 将后端扁平的历史消息转换为前端聊天组件可用的消息格式
 *
 * 转换策略：
 * 1. 以用户消息为边界进行分组
 * 2. 每个用户消息对应一个AI消息，包含该用户输入后的所有AI回复和工具调用结果
 * 3. 按照后端数据的原始顺序构建content数组
 * 4. 避免重复处理同一个工具调用
 */
export class HistoryMessageConverter {
  /**
   * 转换历史消息为ChatMessagesData格式
   *
   * @param historyMessages 后端返回的历史消息数组
   * @returns 转换后的ChatMessagesData数组
   */
  static convert(historyMessages: HistoryMessage[]): ChatMessagesData[] {
    const convertedMessages: ChatMessagesData[] = [];
    const toolCallMap = new Map<string, any>(); // 存储工具调用结果

    // 第一遍：收集所有工具调用结果
    historyMessages.forEach((msg) => {
      if (msg.role === 'tool') {
        const toolMessage = msg as ToolHistoryMessage;
        toolCallMap.set(toolMessage.toolCallId, {
          toolCallId: toolMessage.toolCallId,
          result: toolMessage.content,
        });
      }
    });

    // 第二遍：按用户消息分组处理
    let currentUserMessage: UserHistoryMessage | null = null;
    let currentGroupMessages: HistoryMessage[] = []; // 存储当前组的所有消息

    const flushCurrentGroup = () => {
      if (currentUserMessage) {
        // 添加用户消息
        convertedMessages.push({
          id: currentUserMessage.id,
          role: 'user',
          content: [
            {
              type: 'text',
              data: currentUserMessage.content,
            },
          ],
          datetime: new Date(currentUserMessage.timestamp).toISOString(),
        });

        // 按照原始顺序构建AI消息的content数组
        if (currentGroupMessages.length > 0) {
          const allContent: AIMessageContent[] = [];
          const processedToolCallIds = new Set<string>(); // 跟踪已处理的工具调用ID

          // 按照原始顺序处理当前组的所有消息
          currentGroupMessages.forEach((msg) => {
            if (msg.role === 'assistant') {
              const assistantMsg = msg as AssistantHistoryMessage;

              // 添加文本内容
              if (assistantMsg.content) {
                allContent.push({
                  type: 'markdown',
                  data: assistantMsg.content,
                });
              }

              // 添加思考内容
              if (assistantMsg.reasoning) {
                allContent.push({
                  type: 'thinking',
                  data: JSON.parse(assistantMsg.reasoning),
                });
              }

              // 添加工具调用内容
              if (assistantMsg.toolCalls && assistantMsg.toolCalls.length > 0) {
                assistantMsg.toolCalls.forEach((toolCall) => {
                  const toolCallContent = {
                    type: 'toolcall' as const,
                    data: {
                      toolCallId: toolCall.id,
                      toolCallName: toolCall.function.name,
                      args: toolCall.function.arguments,
                      result: toolCallMap.get(toolCall.id)?.result || '',
                    },
                  };
                  allContent.push(toolCallContent as unknown as AIMessageContent);
                  processedToolCallIds.add(toolCall.id); // 标记为已处理
                });
              }
            } else if (msg.role === 'tool') {
              const toolMsg = msg as ToolHistoryMessage;

              // 只有当这个工具调用没有被助手消息处理过时，才添加独立的工具调用结果
              if (!processedToolCallIds.has(toolMsg.toolCallId)) {
                const toolCallContent = {
                  type: 'toolcall' as const,
                  data: {
                    toolCallId: toolMsg.toolCallId,
                    toolCallName: toolMsg.toolCallId, // 使用toolCallId作为名称（如果没有toolCallName字段）
                    args: '',
                    result: toolMsg.content,
                  },
                };
                allContent.push(toolCallContent as unknown as AIMessageContent);
              }
            }
          });

          // 创建合并后的AI消息
          if (allContent.length > 0) {
            const firstMessageInGroup = currentGroupMessages[0];
            convertedMessages.push({
              id: firstMessageInGroup.id,
              role: 'assistant',
              content: allContent,
              datetime: new Date(firstMessageInGroup.timestamp).toISOString(),
              status: 'complete',
            });
          }
        }
      }

      // 重置当前组
      currentUserMessage = null;
      currentGroupMessages = [];
    };

    // 按顺序处理消息
    historyMessages.forEach((msg) => {
      if (msg.role === 'user') {
        // 遇到新的用户消息，先处理之前的组
        flushCurrentGroup();

        // 开始新的组
        currentUserMessage = msg as UserHistoryMessage;
      } else if (msg.role === 'assistant' || msg.role === 'tool') {
        // 收集助手消息和工具调用结果到当前组
        currentGroupMessages.push(msg);
      }
    });

    // 处理最后一组
    flushCurrentGroup();

    return convertedMessages;
  }

  /**
   * 验证历史消息格式
   *
   * @param historyMessages 历史消息数组
   * @returns 验证结果
   */
  static validate(historyMessages: HistoryMessage[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    historyMessages.forEach((msg, index) => {
      if (!msg.id) {
        errors.push(`消息 ${index} 缺少 id 字段`);
      }
      if (!msg.role) {
        errors.push(`消息 ${index} 缺少 role 字段`);
      }
      if (!msg.timestamp) {
        errors.push(`消息 ${index} 缺少 timestamp 字段`);
      }

      if (msg.role === 'user') {
        const userMsg = msg as UserHistoryMessage;
        if (!userMsg.content) {
          errors.push(`用户消息 ${index} 缺少 content 字段`);
        }
      } else if (msg.role === 'assistant') {
        const assistantMsg = msg as AssistantHistoryMessage;
        if (assistantMsg.toolCalls) {
          assistantMsg.toolCalls.forEach((toolCall, toolIndex) => {
            if (!toolCall.id) {
              errors.push(`助手消息 ${index} 的工具调用 ${toolIndex} 缺少 id 字段`);
            }
            if (!toolCall.function?.name) {
              errors.push(`助手消息 ${index} 的工具调用 ${toolIndex} 缺少 function.name 字段`);
            }
          });
        }
      } else if (msg.role === 'tool') {
        const toolMsg = msg as ToolHistoryMessage;
        if (!toolMsg.toolCallId) {
          errors.push(`工具消息 ${index} 缺少 toolCallId 字段`);
        }
        if (!toolMsg.content) {
          errors.push(`工具消息 ${index} 缺少 content 字段`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
