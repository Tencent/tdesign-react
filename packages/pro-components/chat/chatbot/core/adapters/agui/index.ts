/* eslint-disable class-methods-use-this */
import { AGUIEventMapper } from './event-mapper';
import type { SSEChunkData, AIMessageContent, ToolCall, ChatRequestParams, ChatMessagesData } from '../../type';
import { EventType } from './events';
import type { RunStartedEvent, RunFinishedEvent, RunErrorEvent, BaseEvent } from './events';
import type {
  AGUIHistoryMessage,
  AGUIUserHistoryMessage,
  AGUIAssistantHistoryMessage,
  AGUIToolHistoryMessage,
} from './types';

// 重新导出类型，以便其他文件可以使用
export type {
  AGUIHistoryMessage,
  AGUIUserHistoryMessage,
  AGUIAssistantHistoryMessage,
  AGUIToolHistoryMessage,
} from './types';

/**
 * AGUI协议适配器回调接口
 */
export interface AGUIAdapterCallbacks {
  onRunStart?: (event: RunStartedEvent) => void;
  onRunComplete?: (isAborted: boolean, params: ChatRequestParams, event?: RunFinishedEvent) => void;
  onRunError?: (error: RunErrorEvent) => void;
}

/**
 * AGUI协议适配器
 * 1. 处理AGUI协议特定的事件（RUN_STARTED, RUN_FINISHED, RUN_ERROR）
 * 2. 管理工具调用的生命周期
 * 3. 将AGUI事件映射为ChatEngine可理解的消息内容
 * 4. 转换AG-UI历史消息为ChatMessagesData格式
 */
export class AGUIAdapter {
  /**
   * 转换AG-UI历史消息为ChatMessagesData格式（静态方法）
   *
   * 转换策略：
   * 1. 以用户消息为边界进行分组
   * 2. 每个用户消息对应一个AI消息，包含该用户输入后的所有AI回复和工具调用结果
   * 3. 按照后端数据的原始顺序构建content数组
   * 4. 避免重复处理同一个工具调用
   * 5. 支持只有assistant消息的情况（如welcome消息）
   *
   * @param historyMessages AG-UI格式的历史消息数组
   * @returns 转换后的ChatMessagesData数组
   */
  static convertHistoryMessages(historyMessages: AGUIHistoryMessage[]): ChatMessagesData[] {
    const convertedMessages: ChatMessagesData[] = [];
    const toolCallMap = new Map<string, any>(); // 存储工具调用结果

    // 第一遍：收集所有工具调用结果
    historyMessages.forEach((msg) => {
      if (msg.role === 'tool') {
        const toolMessage = msg as AGUIToolHistoryMessage;
        toolCallMap.set(toolMessage.toolCallId, {
          toolCallId: toolMessage.toolCallId,
          result: toolMessage.content,
        });
      }
    });

    // 第二遍：按用户消息分组处理
    let currentUserMessage: AGUIUserHistoryMessage | null = null;
    let currentGroupMessages: AGUIHistoryMessage[] = []; // 存储当前组的所有消息

    /**
     * 处理消息组，构建AI消息的content数组
     */
    const processMessageGroup = (messages: AGUIHistoryMessage[]): AIMessageContent[] => {
      const allContent: AIMessageContent[] = [];

      messages
        .filter((msg) => msg.role === 'assistant')
        .forEach((msg) => {
          const assistantMsg = msg as AGUIAssistantHistoryMessage;
          // 添加文本内容
          if (assistantMsg.content) {
            allContent.push({
              type: 'markdown',
              data: assistantMsg.content,
            });
          }

          // 添加思考内容（如果有思考过程字段）
          if ((assistantMsg as any).reasoningContent) {
            const { reasoningContent } = assistantMsg as any;
            let reasoningData;

            if (typeof reasoningContent === 'string') {
              try {
                reasoningData = JSON.parse(reasoningContent);
              } catch {
                // 解析失败时，将字符串包装为对象
                reasoningData = { text: reasoningContent, title: '思考完成' };
              }
            } else {
              reasoningData = reasoningContent;
            }

            allContent.push({
              type: 'thinking',
              status: 'complete',
              data: reasoningData,
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
            });
          }
        });

      return allContent;
    };

    /**
     * 创建AI消息
     */
    const createAIMessage = (messages: AGUIHistoryMessage[]): void => {
      if (messages.length > 0) {
        const allContent = processMessageGroup(messages);
        if (allContent.length > 0) {
          const firstMessageInGroup = messages[0];
          convertedMessages.push({
            id: firstMessageInGroup.id,
            role: 'assistant',
            content: allContent,
            status: 'complete',
          });
        }
      }
    };

    /**
     * 处理当前消息组
     */
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
          datetime: new Date(currentUserMessage.timestamp || Date.now()).toISOString(),
        });
      }
      // 处理AI消息
      createAIMessage(currentGroupMessages);

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
        currentUserMessage = msg as AGUIUserHistoryMessage;
      } else if (msg.role === 'assistant' || msg.role === 'tool') {
        // 收集助手消息和工具调用结果到当前组
        currentGroupMessages.push(msg);
      }
    });

    // 处理最后一组
    flushCurrentGroup();

    return convertedMessages;
  }

  private aguiEventMapper: AGUIEventMapper;

  constructor() {
    this.aguiEventMapper = new AGUIEventMapper();
  }

  /**
   * 处理AGUI事件
   *
   * 处理流程：
   * 1. 解析SSE数据（AG-UI后端返回标准SSE格式，data字段是JSON字符串）
   * 2. 处理AGUI特定事件（生命周期事件）
   * 3. 使用事件映射器转换为消息内容
   * 4. 同步工具调用状态
   *
   * @param chunk SSE数据块
   * @param callbacks 回调函数
   * @returns 处理结果
   */
  handleAGUIEvent(chunk: SSEChunkData, callbacks: AGUIAdapterCallbacks): AIMessageContent | AIMessageContent[] | null {
    // AG-UI后端返回标准SSE格式，data字段是JSON字符串
    let event: BaseEvent;
    try {
      event = typeof chunk.data === 'string' ? JSON.parse(chunk.data) : chunk.data;
    } catch (error) {
      console.warn('Failed to parse AG-UI event data:', error);
      return null;
    }

    if (!event?.type) return null;

    // 处理AGUI特定事件（生命周期事件）
    const lifecycleHandled = this.handleAGUISpecificEvents(event, callbacks);

    // 如果是生命周期事件，不需要转换为消息内容
    if (lifecycleHandled) {
      return null;
    }

    // 使用事件映射器处理内容事件
    const result = this.aguiEventMapper.mapEvent(chunk);

    return result;
  }

  /**
   * 获取AGUI事件映射器
   */
  get toolcalls() {
    return this.aguiEventMapper.getToolCalls();
  }

  getToolcallByName(name: string): ToolCall | undefined {
    const result = this.aguiEventMapper.getToolCalls().find((call) => call.toolCallName === name);
    return result;
  }

  /**
   * 重置适配器状态
   */
  reset(): void {
    this.aguiEventMapper.reset();
  }

  /**
   * 处理AGUI特定事件
   *
   * 处理RUN_STARTED、RUN_FINISHED、RUN_ERROR等生命周期事件
   * 这些事件用于通知外部系统状态变化，并执行相应的回调
   *
   * @param event 解析后的事件对象
   * @param callbacks 回调函数
   * @returns 是否处理了生命周期事件
   */
  private handleAGUISpecificEvents(event: BaseEvent, callbacks: AGUIAdapterCallbacks): boolean {
    switch (event.type) {
      case EventType.RUN_STARTED:
        callbacks.onRunStart?.(event as RunStartedEvent);
        return true;
      case EventType.RUN_FINISHED:
        callbacks.onRunComplete?.(false, {} as ChatRequestParams, event as RunFinishedEvent);
        return true;
      case EventType.RUN_ERROR:
        callbacks.onRunError?.(event as RunErrorEvent);
        return true;
      default:
        return false; // 不是生命周期事件
    }
  }
}

/**
 * 状态订阅机制导出
 */
export * from './state-manager';
