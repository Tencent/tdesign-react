import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { stateManager } from '../core/adapters/agui';

/**
 * 状态订阅相关类型定义
 */

export interface StateActionOptions {
  /**
   * 初始状态
   */
  initialState?: Record<string, any>;
  /**
   * 根据是否传入stateKey自动决定订阅模式：
   * - 传入stateKey：绑定模式，只订阅特定stateKey的状态，适用于状态隔离场景
   * - 不传stateKey：最新模式，订阅最新状态，适用于状态覆盖场景
   */
  stateKey?: string;
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
  // 新增：获取当前完整状态的方法
  getCurrentState: () => Record<string, any>;
  // 新增：获取特定 key 状态的方法
  getStateByKey: (key: string) => any;
}

/**
 * 状态订阅Hook
 */
export function useAgentState<T = any>(options: StateActionOptions = {}): UseStateActionReturn {
  const { stateKey, initialState } = options;
  const stateMap = useRef<Record<string, any>>(initialState || {});
  const [currentStateKey, setCurrentStateKey] = useState<string | null>(null);
  const [, forceUpdate] = useState({});

  // 根据是否有stateKey自动决定订阅模式
  const isBoundMode = !!stateKey;

  // 强制更新函数
  const triggerUpdate = () => forceUpdate({});

  // 订阅状态变化
  useEffect(() => {
    if (isBoundMode) {
      // 绑定模式：只订阅特定stateKey
      return stateManager.subscribeToState(stateKey, (newState: T) => {
        stateMap.current = { [stateKey]: { ...stateMap.current?.[stateKey], ...newState } };
        triggerUpdate(); // 触发重新渲染
      });
    }
    // 最新模式：订阅最新状态，使用合并而不是覆盖
    return stateManager.subscribeToLatest((newState: T, newStateKey: string) => {
      stateMap.current =  { [newStateKey]: { ...stateMap.current?.[newStateKey], ...newState } };
      setCurrentStateKey(newStateKey);
      triggerUpdate(); // 触发重新渲染
    });
  }, [isBoundMode, stateKey]);

  const displayStateKey = isBoundMode ? stateKey : currentStateKey;

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
    stateKey: displayStateKey || null,
    getCurrentState: () => stateMap.current,
    getStateByKey: (key: string) => stateMap.current[key],
  };
}


// 创建 AgentState Context
export const AgentStateContext = createContext<{
  state: Record<string, any>;
  stateKey: string | null;
} | null>(null);

// 导出 Context Hook
export const useAgentStateContext = () => {
  const context = useContext(AgentStateContext);
  if (!context) {
    throw new Error('useAgentStateContext must be used within AgentStateProvider');
  }
  return context;
};
