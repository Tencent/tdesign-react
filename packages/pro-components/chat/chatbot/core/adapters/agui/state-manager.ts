import { applyJsonPatch } from '../../utils';

/**
 * 状态管理器
 * 支持两种订阅模式：
 * 1. 最新状态模式：订阅最新状态，适用于状态覆盖场景
 * 2. 绑定状态模式：订阅特定stateKey，适用于状态隔离场景
 */

export interface StateManager {
  /**
   * 获取当前活跃的状态key
   */
  getCurrentStateKey: () => string | null;
  /**
   * 获取当前状态（基于当前状态key）
   */
  getCurrentState: () => any;
  /**
   * 获取指定状态key的状态
   */
  getState: (stateKey: string) => any;
  /**
   * 获取所有状态keys
   */
  getAllStateKeys: () => string[];
  /**
   * 订阅状态变化
   * @param callback 状态变化回调函数
   * @param targetStateKey 可选：指定订阅特定的stateKey，不传则订阅当前活跃状态
   */
  subscribe: (callback: (state: any, stateKey: string) => void, targetStateKey?: string) => () => void;
  /**
   * 处理AG-UI状态事件，自动从事件中提取stateKey
   */
  handleStateEvent: (event: { type: string; snapshot?: any; delta?: any[] }) => void;
  /**
   * 清理所有状态和订阅
   */
  clear: () => void;
}

export class StateManagerImpl implements StateManager {
  private states: Record<string, any> = {};

  private currentStateKey: string | null = null;

  // 最新状态订阅者（覆盖模式）
  private latestSubscribers: Set<(state: any, stateKey: string) => void> = new Set();

  // 绑定状态订阅者（隔离模式）
  private boundSubscribers: Map<string, Set<(state: any) => void>> = new Map();

  /**
   * 获取当前活跃的状态key
   */
  getCurrentStateKey(): string | null {
    return this.currentStateKey;
  }

  /**
   * 获取当前状态（基于当前状态key）
   */
  getCurrentState(): any {
    if (!this.currentStateKey) return null;
    return this.states[this.currentStateKey];
  }

  /**
   * 获取指定状态key的状态
   */
  getState(stateKey: string): any {
    return this.states[stateKey];
  }

  /**
   * 获取所有状态keys
   */
  getAllStateKeys(): string[] {
    return Object.keys(this.states);
  }

  /**
   * 订阅最新状态（覆盖模式）
   * 适用于只有一个组件，每轮都用新状态更新的场景
   */
  subscribeToLatest(callback: (state: any, stateKey: string) => void): () => void {
    this.latestSubscribers.add(callback);
    // 立即调用一次当前状态
    if (this.currentStateKey && this.states[this.currentStateKey]) {
      try {
        callback(this.states[this.currentStateKey], this.currentStateKey);
      } catch (error) {
        console.error(`最新状态订阅回调执行失败 [${this.currentStateKey}]:`, error);
      }
    }

    return () => this.latestSubscribers.delete(callback);
  }

  /**
   * 订阅状态变化（实现 StateManager 接口）
   * @param callback 状态变化回调函数
   * @param targetStateKey 可选：指定订阅特定的stateKey，不传则订阅当前活跃状态
   */
  subscribe(callback: (state: any, stateKey: string) => void, targetStateKey?: string): () => void {
    if (targetStateKey) {
      // 绑定模式：订阅特定 stateKey
      return this.subscribeToState(targetStateKey, (state) => callback(state, targetStateKey));
    }
    // 最新模式：订阅最新状态
    return this.subscribeToLatest(callback);
  }

  /**
   * 订阅特定状态（隔离模式）
   * 适用于每轮对话创建新组件，各自保持独立状态的场景
   */
  subscribeToState(stateKey: string, callback: (state: any) => void): () => void {
    if (!this.boundSubscribers.has(stateKey)) {
      this.boundSubscribers.set(stateKey, new Set());
    }
    this.boundSubscribers.get(stateKey)!.add(callback);

    // 立即调用一次（如果状态存在）
    if (this.states[stateKey]) {
      try {
        callback(this.states[stateKey]);
      } catch (error) {
        console.error(`绑定状态订阅回调执行失败 [${stateKey}]:`, error);
      }
    }

    return () => {
      this.boundSubscribers.get(stateKey)?.delete(callback);
    };
  }

  /**
   * 处理AG-UI状态事件
   * 自动从事件中提取stateKey，无需外部传递
   */
  handleStateEvent(event: { type: string; snapshot?: any; delta?: any[] }): void {
    if (event.type === 'STATE_SNAPSHOT') {
      // 处理STATE_SNAPSHOT：立即更新
      if (event.snapshot && typeof event.snapshot === 'object') {
        Object.entries(event.snapshot).forEach(([stateKey, stateData]) => {
          this.setState(stateKey, stateData);
        });
      }
    } else if (event.type === 'STATE_DELTA') {
      // 处理STATE_DELTA：立即更新
      if (event.delta && Array.isArray(event.delta)) {
        // 从第一个delta操作的路径中提取stateKey
        const firstDelta = event.delta[0];
        if (firstDelta && firstDelta.path) {
          const pathParts = firstDelta.path.split('/');
          if (pathParts.length > 1) {
            const stateKey = pathParts[1]; // 路径格式: /stateKey/items/...
            const currentState = this.getState(stateKey);

            if (currentState) {
              try {
                // 重新构造原始结构以应用JSON Patch
                const originalStructure = { [stateKey]: currentState };
                const updatedStructure = applyJsonPatch(originalStructure, event.delta);
                const updatedState = updatedStructure[stateKey];
                this.setState(stateKey, updatedState);
              } catch (error) {
                console.error(`STATE_DELTA处理失败 [${stateKey}]:`, error);
              }
            } else {
              console.warn(`STATE_DELTA: 找不到状态 [${stateKey}]，可能需要先接收STATE_SNAPSHOT`);
            }
          }
        }
      }
    }
  }

  // 清理所有状态和订阅
  clear(): void {
    // 清理状态和订阅
    this.states = {};
    this.latestSubscribers.clear();
    this.boundSubscribers.clear();
    this.currentStateKey = null;
  }

  /**
   * 设置状态并立即通知订阅者
   */
  private setState(stateKey: string, state: any): void {
    // 更新状态
    this.states[stateKey] = state;
    this.currentStateKey = stateKey;
    this.notifySubscribers(stateKey, state);
  }

  /**
   * 通知订阅者
   */
  private notifySubscribers(stateKey: string, state: any): void {
    // 通知绑定订阅者（只通知对应stateKey的订阅者）
    const boundSubs = this.boundSubscribers.get(stateKey);
    if (boundSubs) {
      boundSubs.forEach((callback) => {
        try {
          callback(state);
        } catch (error) {
          console.error(`绑定状态订阅回调执行失败 [${stateKey}]:`, error);
        }
      });
    }

    // 通知最新状态订阅者（所有订阅者都收到最新状态）
    this.latestSubscribers.forEach((callback) => {
      try {
        callback(state, stateKey);
      } catch (error) {
        console.error(`最新状态订阅回调执行失败 [${stateKey}]:`, error);
      }
    });
  }
}

// 全局单例
export const stateManager = new StateManagerImpl();
