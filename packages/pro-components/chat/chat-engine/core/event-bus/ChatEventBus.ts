/**
 * ChatEngine 事件总线实现
 */
import type {
  ChatEngineEventPayloadMap,
  ChatEventBusOptions,
  EventCallback,
  EventFilter,
  EventHistoryItem,
  IChatEventBus,
  UnsubscribeFn,
} from './types';
import { ChatEngineEventType } from './types';

/**
 * ChatEventBus - 聊天引擎事件总线
 *
 * 提供统一的事件发布/订阅机制，支持：
 * - 类型安全的事件订阅和发布
 * - 一次性订阅 (once)
 * - Promise 方式等待事件 (waitFor)
 * - 带过滤条件的等待 (waitForMatch)
 * - 自定义事件支持
 * - 事件历史记录（调试用）
 */
export class ChatEventBus implements IChatEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  private onceListeners: Map<string, Set<EventCallback>> = new Map();

  private customListeners: Map<string, Set<EventCallback>> = new Map();

  private history: EventHistoryItem[] = [];

  private options: Required<ChatEventBusOptions>;

  private destroyed = false;

  constructor(options: ChatEventBusOptions = {}) {
    this.options = {
      debug: false,
      maxListeners: 100,
      historySize: 0,
      ...options,
    };
  }

  /**
   * 订阅事件
   */
  on<E extends ChatEngineEventType>(event: E, callback: EventCallback<ChatEngineEventPayloadMap[E]>): UnsubscribeFn {
    this.checkDestroyed();

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const listeners = this.listeners.get(event)!;

    // 检查监听器数量限制
    if (listeners.size >= this.options.maxListeners) {
      console.warn(
        `[ChatEventBus] Maximum listeners (${this.options.maxListeners}) exceeded for event: ${event}. ` +
          'Consider increasing maxListeners or removing unused listeners.',
      );
    }

    listeners.add(callback as EventCallback);

    if (this.options.debug) {
      console.log(`[ChatEventBus] Subscribed to event: ${event}, total listeners: ${listeners.size}`);
    }

    return () => this.off(event, callback);
  }

  /**
   * 一次性订阅
   */
  once<E extends ChatEngineEventType>(event: E, callback: EventCallback<ChatEngineEventPayloadMap[E]>): UnsubscribeFn {
    this.checkDestroyed();

    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }

    this.onceListeners.get(event)!.add(callback as EventCallback);

    if (this.options.debug) {
      console.log(`[ChatEventBus] Once subscribed to event: ${event}`);
    }

    return () => this.onceListeners.get(event)?.delete(callback as EventCallback);
  }

  /**
   * 取消订阅
   */
  off<E extends ChatEngineEventType>(event: E, callback?: EventCallback<ChatEngineEventPayloadMap[E]>): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback as EventCallback);
      this.onceListeners.get(event)?.delete(callback as EventCallback);

      if (this.options.debug) {
        console.log(`[ChatEventBus] Unsubscribed specific callback from event: ${event}`);
      }
    } else {
      this.listeners.delete(event);
      this.onceListeners.delete(event);

      if (this.options.debug) {
        console.log(`[ChatEventBus] Unsubscribed all callbacks from event: ${event}`);
      }
    }
  }

  /**
   * 发布事件
   */
  emit<E extends ChatEngineEventType>(event: E, payload: ChatEngineEventPayloadMap[E]): void {
    if (this.destroyed) return;

    // 记录历史
    if (this.options.historySize > 0) {
      this.recordHistory(event, payload);
    }

    if (this.options.debug) {
      console.log(`[ChatEventBus] Emitting event: ${event}`, payload);
    }

    // 通知常规订阅者
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(payload);
      } catch (error) {
        console.error(`[ChatEventBus] Error in event handler for ${event}:`, error);
      }
    });

    // 通知一次性订阅者并清理
    const onceSubs = this.onceListeners.get(event);
    if (onceSubs && onceSubs.size > 0) {
      onceSubs.forEach((cb) => {
        try {
          cb(payload);
        } catch (error) {
          console.error(`[ChatEventBus] Error in once handler for ${event}:`, error);
        }
      });
      onceSubs.clear();
    }
  }

  /**
   * 等待事件（Promise 方式）
   */
  waitFor<E extends ChatEngineEventType>(event: E, timeout = 30000): Promise<ChatEngineEventPayloadMap[E]> {
    this.checkDestroyed();

    return new Promise((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | null = null;

      const handler = (payload: ChatEngineEventPayloadMap[E]) => {
        if (timer) {
          clearTimeout(timer);
        }
        resolve(payload);
      };

      if (timeout > 0) {
        timer = setTimeout(() => {
          this.onceListeners.get(event)?.delete(handler as EventCallback);
          reject(new Error(`[ChatEventBus] Timeout waiting for event: ${event} (${timeout}ms)`));
        }, timeout);
      }

      this.once(event, handler);
    });
  }

  /**
   * 带过滤条件的等待
   */
  waitForMatch<E extends ChatEngineEventType>(
    event: E,
    filter: EventFilter<ChatEngineEventPayloadMap[E]>,
    timeout = 30000,
  ): Promise<ChatEngineEventPayloadMap[E]> {
    this.checkDestroyed();

    return new Promise((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      let unsubscribe: UnsubscribeFn | null = null;

      const handler = (payload: ChatEngineEventPayloadMap[E]) => {
        try {
          if (filter(payload)) {
            if (timer) {
              clearTimeout(timer);
            }
            if (unsubscribe) {
              unsubscribe();
            }
            resolve(payload);
          }
        } catch (error) {
          console.error(`[ChatEventBus] Error in filter for ${event}:`, error);
        }
      };

      if (timeout > 0) {
        timer = setTimeout(() => {
          if (unsubscribe) {
            unsubscribe();
          }
          reject(new Error(`[ChatEventBus] Timeout waiting for matching event: ${event} (${timeout}ms)`));
        }, timeout);
      }

      unsubscribe = this.on(event, handler);
    });
  }

  /**
   * 订阅自定义事件
   */
  onCustom<T = unknown>(eventName: string, callback: EventCallback<T>): UnsubscribeFn {
    this.checkDestroyed();

    const key = `custom:${eventName}`;
    if (!this.customListeners.has(key)) {
      this.customListeners.set(key, new Set());
    }

    this.customListeners.get(key)!.add(callback as EventCallback);

    if (this.options.debug) {
      console.log(`[ChatEventBus] Subscribed to custom event: ${eventName}`);
    }

    return () => this.customListeners.get(key)?.delete(callback as EventCallback);
  }

  /**
   * 发布自定义事件
   */
  emitCustom<T = unknown>(eventName: string, data: T): void {
    if (this.destroyed) return;

    const key = `custom:${eventName}`;

    // 记录历史
    if (this.options.historySize > 0) {
      this.recordHistory(ChatEngineEventType.CUSTOM, { eventName, data });
    }

    if (this.options.debug) {
      console.log(`[ChatEventBus] Emitting custom event: ${eventName}`, data);
    }

    this.customListeners.get(key)?.forEach((cb) => {
      try {
        cb(data);
      } catch (error) {
        console.error(`[ChatEventBus] Error in custom event handler for ${eventName}:`, error);
      }
    });
  }

  /**
   * 获取事件历史记录
   */
  getHistory(): EventHistoryItem[] {
    return [...this.history];
  }

  /**
   * 清理所有订阅
   */
  clear(): void {
    this.listeners.clear();
    this.onceListeners.clear();
    this.customListeners.clear();
    this.history = [];

    if (this.options.debug) {
      console.log('[ChatEventBus] All subscriptions cleared');
    }
  }

  /**
   * 销毁事件总线
   */
  destroy(): void {
    this.clear();
    this.destroyed = true;

    if (this.options.debug) {
      console.log('[ChatEventBus] Event bus destroyed');
    }
  }

  /**
   * 获取指定事件的监听器数量
   */
  listenerCount(event: ChatEngineEventType): number {
    const regular = this.listeners.get(event)?.size || 0;
    const once = this.onceListeners.get(event)?.size || 0;
    return regular + once;
  }

  /**
   * 获取所有事件的监听器数量
   */
  getTotalListenerCount(): number {
    let total = 0;
    this.listeners.forEach((set) => {
      total += set.size;
    });
    this.onceListeners.forEach((set) => {
      total += set.size;
    });
    this.customListeners.forEach((set) => {
      total += set.size;
    });
    return total;
  }

  /**
   * 检查是否有指定事件的监听器
   */
  hasListeners(event: ChatEngineEventType): boolean {
    return this.listenerCount(event) > 0;
  }

  private recordHistory(event: ChatEngineEventType | string, payload: unknown): void {
    this.history.push({
      event,
      payload,
      timestamp: Date.now(),
    });

    // 保持历史记录在限制范围内
    while (this.history.length > this.options.historySize) {
      this.history.shift();
    }
  }

  private checkDestroyed(): void {
    if (this.destroyed) {
      throw new Error('[ChatEventBus] Event bus has been destroyed');
    }
  }
}

/**
 * 创建事件总线实例
 */
export function createEventBus(options?: ChatEventBusOptions): IChatEventBus {
  return new ChatEventBus(options);
}

export { ChatEngineEventType };
