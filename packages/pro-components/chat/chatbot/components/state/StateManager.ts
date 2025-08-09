import { applyJsonPatch } from '../../core';
import type { StateManager } from './types';

const generateRandomRunId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `run_${timestamp}_${random}`;
};

/**
 * 状态管理器
 * 提供集中化的状态管理和订阅机制
 * 基于AG-UI协议的特点：每轮对话有固定的runId，在RUN_FINISH之前所有状态都使用这个runId
 */
class StateManagerImpl implements StateManager {
  private states: Record<string, any> = {};

  private subscribers: Set<(state: any, runId: string) => void> = new Set();

  private currentRunId: string | null = null;

  /**
   * 获取当前运行的runId
   */
  getCurrentRunId(): string | null {
    return this.currentRunId;
  }

  /**
   * 获取当前状态（基于当前runId）
   */
  getCurrentState(): any {
    if (!this.currentRunId) return null;
    return this.states[this.currentRunId];
  }

  /**
   * 获取指定runId的状态
   */
  getState(runId: string): any {
    return this.states[runId];
  }

  /**
   * 设置状态并通知所有订阅者
   */
  private setState(runId: string, state: any): void {
    this.states[runId] = state;
    this.currentRunId = runId;

    // 通知所有订阅者
    this.subscribers.forEach((callback) => {
      try {
        callback(state, runId);
      } catch (error) {
        console.error(`状态订阅回调执行失败 [${runId}]:`, error);
      }
    });
  }

  /**
  /**
   * 订阅指定runId的状态变化
   */
  subscribe(runId: string, callback: (state: any) => void): () => void {
    // 为了兼容新的接口，我们需要重新设计订阅机制
    const wrappedCallback = (state: any, stateRunId: string) => {
      if (stateRunId === runId) {
        callback(state);
      }
    };

    this.subscribers.add(wrappedCallback);

    // 如果指定的runId已有状态，立即调用一次回调
    if (this.states[runId] !== undefined) {
      try {
        callback(this.states[runId]);
      } catch (error) {
        console.error(`状态订阅回调执行失败 [${runId}]:`, error);
      }
    }

    // 返回取消订阅函数
    return () => {
      this.subscribers.delete(wrappedCallback);
    };
  }

  /**
   * 订阅当前状态（自动使用currentRunId）
   */
  subscribeToCurrentState(callback: (state: any, runId: string | null) => void): () => void {
    let currentUnsubscribe: (() => void) | null = null;
    let lastRunId: string | null = null;

    const updateSubscription = () => {
      // 如果runId发生变化，重新订阅
      if (this.currentRunId !== lastRunId) {
        // 取消之前的订阅
        if (currentUnsubscribe) {
          currentUnsubscribe();
          currentUnsubscribe = null;
        }

        lastRunId = this.currentRunId;

        // 如果有新的runId，订阅新的状态
        if (this.currentRunId) {
          currentUnsubscribe = this.subscribe(this.currentRunId, (state) => {
            callback(state, this.currentRunId);
          });
        } else {
          // 没有runId时，通知回调
          callback(null, null);
        }
      }
    };

    // 初始订阅
    updateSubscription();

    // 定期检查runId变化
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
  handleStateEvent(event: { type: string; snapshot?: any; delta?: any[]; runId?: string }): void {
    if (event.type === 'STATE_SNAPSHOT') {
      // 处理STATE_SNAPSHOT：提取runId和状态数据
      if (event.snapshot && typeof event.snapshot === 'object') {
        Object.entries(event.snapshot).forEach(([runId, stateData]) => {
          console.log(`STATE_SNAPSHOT: 设置状态 [${runId}]`, stateData);
          this.setState(runId || generateRandomRunId(), stateData);
        });
      }
    } else if (event.type === 'STATE_DELTA') {
      // 处理STATE_DELTA：从delta路径中提取runId
      if (event.delta && Array.isArray(event.delta)) {
        const firstDelta = event.delta[0];
        if (firstDelta && firstDelta.path) {
          const pathParts = firstDelta.path.split('/');
          if (pathParts.length > 1) {
            const runId = pathParts[1]; // 路径格式: /runId/items/...
            const currentState = this.getState(runId);

            if (currentState) {
              try {
                // 重新构造原始结构以应用JSON Patch
                const originalStructure = { [runId]: currentState };
                const updatedStructure = applyJsonPatch(originalStructure, event.delta);
                const updatedState = updatedStructure[runId];

                console.log(`STATE_DELTA: 更新状态 [${runId}]`, updatedState);
                this.setState(runId, updatedState);
              } catch (error) {
                console.error(`STATE_DELTA处理失败 [${runId}]:`, error);
              }
            } else {
              console.warn(`STATE_DELTA: 找不到状态 [${runId}]`);
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
    this.currentRunId = null;
  }
}

// 全局单例
export const stateManager = new StateManagerImpl();
