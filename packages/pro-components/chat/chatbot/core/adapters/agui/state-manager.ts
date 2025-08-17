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
  private latestSubscribers: Set<(state: any) => void> = new Set();

  // Debounce 相关属性
  private pendingUpdates: Map<string, any> = new Map(); // 存储待更新的状态

  private debounceTimers: Map<string, NodeJS.Timeout> = new Map(); // 存储每个 stateKey 的 debounce 定时器

  private readonly DEBOUNCE_DELAY = 50; // debounce 延迟时间（毫秒）

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
   * 订阅特定状态（隔离模式）
   * 适用于每轮对话创建新组件，各自保持独立状态的场景
   */
  subscribeToState(callback: (state: any) => void): () => void {
    this.latestSubscribers.add(callback);
    if (!this.currentStateKey) {
      // 如果没有当前状态key，返回一个空函数
      return () => {
        // 空函数，用于清理
      };
    }
    const stateKey = this.currentStateKey;
    // 立即调用一次当前状态
    if (stateKey && this.states[stateKey]) {
      try {
        callback({[stateKey] : this.states[stateKey]});
      } catch (error) {
        console.error(`最新状态订阅回调执行失败 [${stateKey}]:`, error);
      }
    }
  
    // this.latestSubscribers.add(callback);
    // if (!this.currentStateKey) {
    //   // 如果没有当前状态key，返回一个空函数
    //   return () => {
    //     // 空函数，用于清理
    //   };
    // }
    // const stateKey = this.currentStateKey;
    // if (!this.boundSubscribers.has(stateKey)) {
    //   this.boundSubscribers.set(stateKey, new Set());
    // }
    // this.boundSubscribers.get(stateKey)!.add(callback);

    // // 立即调用一次（如果当前状态存在）
    // if (this.states[stateKey]) {
    //   try {
    //     callback({[stateKey] : this.states[stateKey]});
    //   } catch (error) {
    //     console.error(`绑定状态订阅回调执行失败 [${stateKey}]:`, error);
    //   }
    // }

    return () => this.latestSubscribers.delete(callback);
  }

  /**
   * 设置状态并通知订阅者（带 debounce）
   */
  private setState(stateKey: string, state: any): void {
    // 存储待更新的状态
    this.pendingUpdates.set(stateKey, state);
    
    // 清除之前的定时器
    if (this.debounceTimers.has(stateKey)) {
      clearTimeout(this.debounceTimers.get(stateKey)!);
    }
    
    // 设置新的 debounce 定时器
    const timer = setTimeout(() => {
      this.flushPendingUpdate(stateKey);
    }, this.DEBOUNCE_DELAY);
    
    this.debounceTimers.set(stateKey, timer);
  }

  /**
   * 立即刷新待更新的状态（用于 STATE_SNAPSHOT 等需要立即更新的场景）
   */
  private setStateImmediate(stateKey: string, state: any): void {
    // 清除该 stateKey 的 debounce 定时器
    if (this.debounceTimers.has(stateKey)) {
      clearTimeout(this.debounceTimers.get(stateKey)!);
      this.debounceTimers.delete(stateKey);
    }
    
    // 清除待更新状态
    this.pendingUpdates.delete(stateKey);
    
    // 立即更新状态
    this.flushPendingUpdate(stateKey, state);
  }

  /**
   * 刷新待更新的状态
   */
  private flushPendingUpdate(stateKey: string, overrideState?: any): void {
    this.currentStateKey = stateKey;
    // 获取最终状态（优先使用 overrideState，否则使用 pendingUpdates 中的状态）
    const finalState = overrideState || this.pendingUpdates.get(stateKey);
    
    if (finalState === undefined) {
      return; // 没有待更新的状态
    }
    
    // 更新状态
    this.states[stateKey] = finalState;
    
    // 清除待更新状态和定时器
    this.pendingUpdates.delete(stateKey);
    this.debounceTimers.delete(stateKey);
    
    // 通知特定 stateKey 的订阅者（保持向后兼容）
    // const boundSubs = this.boundSubscribers.get(stateKey);
    // console.log("=====flushPendingUpdate", stateKey, finalState, boundSubs);
    // if (boundSubs) {
    //   boundSubs.forEach((callback) => {
    //     try {
    //       callback({[stateKey]: finalState});
    //     } catch (error) {
    //       console.error(`绑定状态订阅回调执行失败 [${stateKey}]:`, error);
    //     }
    //   });
    // }

    // 通知最新状态订阅者（所有订阅者都收到最新状态）
    this.latestSubscribers.forEach((callback) => {
      try {
        callback({[stateKey]: finalState});
      } catch (error) {
        console.error(`最新状态订阅回调执行失败 [${stateKey}]:`, error);
      }
    });
  }

  setStateMap(stateMap: Record<string, any>): void {
    Object.entries(stateMap).forEach(([stateKey, stateData]) => {
      this.setStateImmediate(stateKey, stateData);
    });
  }

  /**
   * 处理AG-UI状态事件
   * 自动从事件中提取stateKey，无需外部传递
   */
  handleStateEvent(event: { type: string; snapshot?: any; delta?: any[] }): void {
    if (event.type === 'STATE_SNAPSHOT') {
      // 处理STATE_SNAPSHOT：立即更新，不使用 debounce
      if (event.snapshot && typeof event.snapshot === 'object') {
        Object.entries(event.snapshot).forEach(([stateKey, stateData]) => {
          this.setStateImmediate(stateKey, stateData);
        });
      }
    } else if (event.type === 'STATE_DELTA') {
      // 处理STATE_DELTA：使用 debounce 机制，减少频繁更新
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
                this.setState(stateKey, updatedState); // 使用 debounce
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
    // 清理所有 debounce 定时器
    this.debounceTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    
    // 清理状态和订阅
    this.states = {};
    this.latestSubscribers.clear();
    this.boundSubscribers.clear();
    this.currentStateKey = null;
    
    // 清理 debounce 相关资源
    this.pendingUpdates.clear();
    this.debounceTimers.clear();
  }
}

// 全局单例
export const stateManager = new StateManagerImpl();
