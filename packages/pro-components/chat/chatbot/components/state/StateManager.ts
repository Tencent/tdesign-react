import { applyJsonPatch } from '../../core';
import type { StateManager } from './types';

const generateRandomStateKey = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `state_${timestamp}_${random}`;
};

/**
 * 状态管理器
 * 提供集中化的状态管理和订阅机制
 * 支持通用的状态key策略，由业务层决定如何区分不同的状态
 */
class StateManagerImpl implements StateManager {
  private states: Record<string, any> = {};

  private subscribers: Set<(state: any, stateKey: string) => void> = new Set();

  private currentStateKey: string | null = null;

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
   * 设置状态并通知所有订阅者
   */
  private setState(stateKey: string, state: any): void {
    this.states[stateKey] = state;
    this.currentStateKey = stateKey;

    // 通知所有订阅者
    this.subscribers.forEach((callback) => {
      try {
        callback(state, stateKey);
      } catch (error) {
        console.error(`状态订阅回调执行失败 [${stateKey}]:`, error);
      }
    });
  }

  /**
   * 订阅指定状态key的状态变化
   */
  subscribe(stateKey: string, callback: (state: any) => void): () => void {
    // 为了兼容新的接口，我们需要重新设计订阅机制
    const wrappedCallback = (state: any, currentStateKey: string) => {
      if (currentStateKey === stateKey) {
        callback(state);
      }
    };

    this.subscribers.add(wrappedCallback);

    // 如果指定的状态key已有状态，立即调用一次回调
    if (this.states[stateKey] !== undefined) {
      try {
        callback(this.states[stateKey]);
      } catch (error) {
        console.error(`状态订阅回调执行失败 [${stateKey}]:`, error);
      }
    }

    // 返回取消订阅函数
    return () => {
      this.subscribers.delete(wrappedCallback);
    };
  }

  /**
   * 订阅当前状态（自动使用当前状态key）
   */
  subscribeToCurrentState(callback: (state: any, stateKey: string | null) => void): () => void {
    let currentUnsubscribe: (() => void) | null = null;
    let lastStateKey: string | null = null;

    const updateSubscription = () => {
      // 如果状态key发生变化，重新订阅
      if (this.currentStateKey !== lastStateKey) {
        // 取消之前的订阅
        if (currentUnsubscribe) {
          currentUnsubscribe();
          currentUnsubscribe = null;
        }

        lastStateKey = this.currentStateKey;

        // 如果有新的状态key，订阅新的状态
        if (this.currentStateKey) {
          currentUnsubscribe = this.subscribe(this.currentStateKey, (state) => {
            callback(state, this.currentStateKey);
          });
        } else {
          // 没有状态key时，通知回调
          callback(null, null);
        }
      }
    };

    // 初始订阅
    updateSubscription();

    // 定期检查状态key变化
    const interval = setInterval(updateSubscription, 100);

    // 返回取消订阅函数
    return () => {
      if (currentUnsubscribe) {
        currentUnsubscribe();
      }
      clearInterval(interval);
    };
  }

  /**
   * 处理AG-UI状态事件
   */
  handleStateEvent(event: { type: string; snapshot?: any; delta?: any[]; stateKey?: string }): void {
    if (event.type === 'STATE_SNAPSHOT') {
      // 处理STATE_SNAPSHOT：提取状态key和状态数据
      if (event.snapshot && typeof event.snapshot === 'object') {
        Object.entries(event.snapshot).forEach(([stateKey, stateData]) => {
          console.log(`STATE_SNAPSHOT: 设置状态 [${stateKey}]`, stateData);
          this.setState(stateKey || generateRandomStateKey(), stateData);
        });
      }
    } else if (event.type === 'STATE_DELTA') {
      // 处理STATE_DELTA：从delta路径中提取状态key
      if (event.delta && Array.isArray(event.delta)) {
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

                console.log(`STATE_DELTA: 更新状态 [${stateKey}]`, updatedState);
                this.setState(stateKey, updatedState);
              } catch (error) {
                console.error(`STATE_DELTA处理失败 [${stateKey}]:`, error);
              }
            } else {
              console.warn(`STATE_DELTA: 找不到状态 [${stateKey}]`);
            }
          }
        }
      }
    }
  }

  // 清理所有状态和订阅
  clear(): void {
    this.states = {};
    this.subscribers.clear();
    this.currentStateKey = null;
  }
}

// 全局单例
export const stateManager = new StateManagerImpl();
