/* eslint-disable class-methods-use-this */
import type { AIMessageContent, ChatMessagesData, ChatRequestParams, SSEChunkData, ToolCall, UserMessageContent } from '../../type';
import { AGUIEventMapper } from './event-mapper';
import type { BaseEvent, RunErrorEvent, RunFinishedEvent, RunStartedEvent } from './types/events';
import { AGUIEventType } from './types/events';
import type { AGUIHistoryMessage, AGUIUserHistoryMessage } from './types';
import { buildToolCallMap, processMessageGroup } from './utils';

// 重新导出类型，以便其他文件可以使用
export type {
  AGUIHistoryMessage,
  AGUIUserHistoryMessage,
  AGUIAssistantHistoryMessage,
  AGUIToolHistoryMessage,
  AGUIActivityMessage,
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
   * ## 设计说明
   *
   * ### AG-UI 协议中的消息角色
   * - `user`: 用户消息
   * - `assistant`: AI 回复，可包含 content、reasoningContent、toolCalls
   * - `tool`: 工具调用结果，通过 toolCallId 关联到 assistant 的 toolCalls
   * - `activity`: 独立的活动/事件消息，表示代理运行过程中的中间状态
   *
   * ### Activity 消息的处理策略
   * Activity 在 AG-UI 中是独立的 role，不是 assistant 的附属。
   * 但在 UI 展示层，我们选择将其合并到 AI 响应中，原因：
   * 1. 保持对话气泡的整洁性（一问一答模式）
   * 2. Activity 通常是 AI 处理过程的可视化，属于同一个响应周期
   * 3. 通过 activityType 区分不同类型的 Activity 渲染
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
    if (!historyMessages || historyMessages.length === 0) {
      return [];
    }
    const convertedMessages: ChatMessagesData[] = [];
    const toolCallMap = buildToolCallMap(historyMessages);

    // 按用户消息分组处理
    let currentUserMessage: AGUIUserHistoryMessage | null = null;
    let currentGroupMessages: AGUIHistoryMessage[] = []; // 存储当前组的所有消息

    /**
     * 处理消息组，构建AI消息的content数组
     * 复用 utils.ts 中的 processMessageGroup 公共函数
     */
    const processGroup = (messages: AGUIHistoryMessage[]): AIMessageContent[] => {
      return processMessageGroup(messages, toolCallMap) as AIMessageContent[];
    };

    /**
     * 创建AI消息
     */
    const createAIMessage = (messages: AGUIHistoryMessage[]): void => {
      if (messages.length > 0) {
        const allContent = processGroup(messages);
        if (allContent.length > 0) {
          const firstMessageInGroup = messages[0];
          convertedMessages.push({
            id: firstMessageInGroup.id,
            role: 'assistant',
            content: allContent,
            status: 'complete',
            datetime: new Date(messages.at(-1)?.timestamp || Date.now()).toISOString(),
          });
        }
      }
    };

    /**
     * 处理用户消息的 content 字段
     * 兼容两种格式：
     * 1. 标准 AG-UI 格式：content 是字符串
     * 2. 已转换格式：content 已经是数组 [{ type, data }]
     */
    const processUserContent = (content: any): UserMessageContent[] => {
      // 如果 content 已经是数组格式，直接返回
      if (Array.isArray(content)) {
        return content as UserMessageContent[];
      }
      // 如果是字符串，包装为标准格式
      return [
        {
          type: 'text',
          data: content,
        },
      ];
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
          content: processUserContent(currentUserMessage.content),
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
      } else if (msg.role === 'assistant' || msg.role === 'tool' || msg.role === 'activity') {
        // 收集助手消息、工具调用结果和活动消息到当前组
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
   * @returns 是否处理了生命周期事件（仅RUN_STARTED和RUN_FINISHED返回true，RUN_ERROR需要继续处理生成消息内容）
   */
  private handleAGUISpecificEvents(event: BaseEvent, callbacks: AGUIAdapterCallbacks): boolean {
    switch (event.type) {
      case AGUIEventType.RUN_STARTED:
        callbacks.onRunStart?.(event as RunStartedEvent);
        return true;
      case AGUIEventType.RUN_FINISHED:
        callbacks.onRunComplete?.(false, {} as ChatRequestParams, event as RunFinishedEvent);
        return true;
      case AGUIEventType.RUN_ERROR:
        // RUN_ERROR 需要触发回调，但不能返回 true
        // 因为还需要通过 event-mapper 生成错误消息内容用于 UI 展示
        callbacks.onRunError?.(event as RunErrorEvent);
        return false; // 继续处理，让 event-mapper 生成错误消息
      default:
        return false; // 不是生命周期事件
    }
  }
}

/**
 * 状态订阅机制导出
 */
export * from './StateManager';
export * from './ActivityManager';
export * from './types';
