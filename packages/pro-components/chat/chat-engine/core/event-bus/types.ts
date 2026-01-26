/**
 * ChatEngine 事件总线类型定义
 */
import type { AIMessageContent, ChatMessagesData, ChatRequestParams, ChatStatus, ToolCall } from '../type';

/**
 * 事件类型枚举
 */
export enum ChatEngineEventType {
  // 生命周期事件
  ENGINE_INIT = 'engine:init',
  ENGINE_DESTROY = 'engine:destroy',

  // 消息事件
  MESSAGE_CREATE = 'message:create',
  MESSAGE_UPDATE = 'message:update',
  MESSAGE_DELETE = 'message:delete',
  MESSAGE_CLEAR = 'message:clear',
  MESSAGE_STATUS_CHANGE = 'message:status',
  MESSAGE_CONTENT_APPEND = 'message:content:append',

  // 请求事件
  REQUEST_START = 'request:start',
  REQUEST_STREAM = 'request:stream',
  REQUEST_COMPLETE = 'request:complete',
  REQUEST_ERROR = 'request:error',
  REQUEST_ABORT = 'request:abort',

  // AG-UI 协议事件
  AGUI_RUN_START = 'agui:run:start',
  AGUI_RUN_COMPLETE = 'agui:run:complete',
  AGUI_RUN_ERROR = 'agui:run:error',
  AGUI_STATE_UPDATE = 'agui:state:update',
  AGUI_TOOLCALL = 'agui:toolcall',
  AGUI_ACTIVITY = 'agui:activity',

  // 自定义事件
  CUSTOM = 'custom',
}

/**
 * 事件载荷类型映射
 */
export interface ChatEngineEventPayloadMap {
  // 生命周期事件
  [ChatEngineEventType.ENGINE_INIT]: {
    timestamp: number;
  };
  [ChatEngineEventType.ENGINE_DESTROY]: {
    timestamp: number;
  };

  // 消息事件
  [ChatEngineEventType.MESSAGE_CREATE]: {
    message: ChatMessagesData;
    messages: ChatMessagesData[];
  };
  [ChatEngineEventType.MESSAGE_UPDATE]: {
    messageId: string;
    content: AIMessageContent | AIMessageContent[];
    message: ChatMessagesData;
  };
  [ChatEngineEventType.MESSAGE_DELETE]: {
    messageId: string;
    messages: ChatMessagesData[];
  };
  [ChatEngineEventType.MESSAGE_CLEAR]: {
    timestamp: number;
  };
  [ChatEngineEventType.MESSAGE_STATUS_CHANGE]: {
    messageId: string;
    status: ChatStatus;
    previousStatus?: ChatStatus;
  };
  [ChatEngineEventType.MESSAGE_CONTENT_APPEND]: {
    messageId: string;
    content: AIMessageContent;
    contentIndex: number;
  };

  // 请求事件
  [ChatEngineEventType.REQUEST_START]: {
    params: ChatRequestParams;
    messageId?: string;
  };
  [ChatEngineEventType.REQUEST_STREAM]: {
    messageId: string;
    chunk: unknown;
    content?: AIMessageContent | AIMessageContent[] | null;
  };
  [ChatEngineEventType.REQUEST_COMPLETE]: {
    messageId: string;
    params: ChatRequestParams;
    message: ChatMessagesData;
  };
  [ChatEngineEventType.REQUEST_ERROR]: {
    messageId: string;
    error: Error | unknown;
    params?: ChatRequestParams;
  };
  [ChatEngineEventType.REQUEST_ABORT]: {
    messageId: string;
    params: ChatRequestParams;
  };

  // AG-UI 协议事件
  [ChatEngineEventType.AGUI_RUN_START]: {
    runId: string;
    threadId?: string;
    timestamp: number;
  };
  [ChatEngineEventType.AGUI_RUN_COMPLETE]: {
    runId: string;
    threadId?: string;
    timestamp: number;
  };
  [ChatEngineEventType.AGUI_RUN_ERROR]: {
    error: Error | unknown;
    runId?: string;
  };
  [ChatEngineEventType.AGUI_STATE_UPDATE]: {
    stateKey: string;
    state: unknown;
    previousState?: unknown;
  };
  [ChatEngineEventType.AGUI_TOOLCALL]: {
    toolCall: ToolCall;
    eventType: string;
  };
  [ChatEngineEventType.AGUI_ACTIVITY]: {
    activityType: string;
    messageId?: string;
    content: unknown;
  };

  // 自定义事件
  [ChatEngineEventType.CUSTOM]: {
    eventName: string;
    data: unknown;
  };
}

/**
 * 事件回调函数类型
 */
export type EventCallback<T = unknown> = (payload: T) => void;

/**
 * 取消订阅函数类型
 */
export type UnsubscribeFn = () => void;

/**
 * 事件过滤器类型
 */
export type EventFilter<T = unknown> = (payload: T) => boolean;

/**
 * 事件总线配置
 */
export interface ChatEventBusOptions {
  /**
   * 是否启用调试模式
   * @default false
   */
  debug?: boolean;
  /**
   * 最大监听器数量（每个事件）
   * @default 100
   */
  maxListeners?: number;
  /**
   * 事件历史记录长度（用于调试）
   * @default 0
   */
  historySize?: number;
}

/**
 * 事件历史记录
 */
export interface EventHistoryItem {
  event: ChatEngineEventType | string;
  payload: unknown;
  timestamp: number;
}

/**
 * 事件总线接口
 */
export interface IChatEventBus {
  /**
   * 订阅事件
   * @param event 事件类型
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  on<E extends ChatEngineEventType>(event: E, callback: EventCallback<ChatEngineEventPayloadMap[E]>): UnsubscribeFn;

  /**
   * 一次性订阅
   * @param event 事件类型
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  once<E extends ChatEngineEventType>(event: E, callback: EventCallback<ChatEngineEventPayloadMap[E]>): UnsubscribeFn;

  /**
   * 取消订阅
   * @param event 事件类型
   * @param callback 可选的回调函数，不传则取消该事件所有订阅
   */
  off<E extends ChatEngineEventType>(event: E, callback?: EventCallback<ChatEngineEventPayloadMap[E]>): void;

  /**
   * 发布事件
   * @param event 事件类型
   * @param payload 事件载荷
   */
  emit<E extends ChatEngineEventType>(event: E, payload: ChatEngineEventPayloadMap[E]): void;

  /**
   * 等待事件（Promise 方式）
   * @param event 事件类型
   * @param timeout 超时时间（毫秒）
   * @returns Promise
   */
  waitFor<E extends ChatEngineEventType>(event: E, timeout?: number): Promise<ChatEngineEventPayloadMap[E]>;

  /**
   * 带过滤条件的等待
   * @param event 事件类型
   * @param filter 过滤函数
   * @param timeout 超时时间
   */
  waitForMatch<E extends ChatEngineEventType>(
    event: E,
    filter: EventFilter<ChatEngineEventPayloadMap[E]>,
    timeout?: number,
  ): Promise<ChatEngineEventPayloadMap[E]>;

  /**
   * 订阅自定义事件
   * @param eventName 自定义事件名
   * @param callback 回调函数
   */
  onCustom<T = unknown>(eventName: string, callback: EventCallback<T>): UnsubscribeFn;

  /**
   * 发布自定义事件
   * @param eventName 自定义事件名
   * @param data 数据
   */
  emitCustom<T = unknown>(eventName: string, data: T): void;

  /**
   * 获取事件历史记录
   */
  getHistory(): EventHistoryItem[];

  /**
   * 清理所有订阅
   */
  clear(): void;

  /**
   * 销毁事件总线
   */
  destroy(): void;
}
