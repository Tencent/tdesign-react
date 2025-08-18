import { useState, useEffect, useRef } from 'react';
import { stateManager } from '../core/adapters/agui';

/**
 * 状态订阅相关类型定义
 */

export interface StateActionOptions {
  /**
   * 初始状态
   */
  initialState?: Record<string, any>;
}

export interface UseStateActionReturn {
  /**
   * 当前状态
   */
  state: Record<string, any>;
  /**
   * 当前状态key
   */
  stateKey: string | null;
  /**
   * 设置状态Map，用于加载历史对话消息中的state数据
   */
  setStateMap: (stateMap: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
}

/**
 * 状态订阅Hook
 */
export function useAgentState(options: StateActionOptions = {}): UseStateActionReturn {
  const { initialState } = options;
  const stateMap = useRef<Record<string, any>>(initialState || {});
  const [, forceUpdate] = useState({});

  // 强制更新函数
  const triggerUpdate = () => forceUpdate({});

  // 订阅状态变化 - 只在组件挂载时订阅一次
  useEffect(() => {
    // 订阅状态变化
    const unsubscribe = stateManager.subscribeToState((newState: Record<string, any>) => {
      stateMap.current = { ...newState };
      triggerUpdate(); // 触发重新渲染
    });

    // 清理函数：组件卸载时取消订阅
    return unsubscribe;
  }, []);

  return {
    state: stateMap.current,
    setStateMap: (state) => {
      if (typeof state === 'function') {
        stateMap.current = state(stateMap.current);
      } else {
        stateMap.current = state;
      }
      triggerUpdate(); // 触发重新渲染
    },
    stateKey: stateManager.getCurrentStateKey() || null,
  };
}
