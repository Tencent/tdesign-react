/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
// import { stateManager } from 'tdesign-web-components/lib/chat-engine';
import { stateManager } from '../core';

/**
 * 状态订阅相关类型定义
 */

export interface StateActionOptions {
  /**
   * 初始状态
   */
  initialState?: Record<string, any>;
  /**
   * 只订阅特定key的变化
   */
  subscribeKey?: string;
}

export interface UseStateActionReturn {
  /**
   * 全量状态Map - 包含所有stateKey的状态
   * 格式: { [stateKey]: stateData }
   */
  stateMap: Record<string, any>;
  /**
   * 当前最新的状态key
   */
  currentStateKey: string | null;
  /**
   * 设置状态Map，用于加载历史对话消息中的state数据
   */
  setStateMap: (stateMap: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  /**
   * 获取当前完整状态的方法
   */
  getCurrentState: () => Record<string, any>;
  /**
   * 获取特定 key 状态的方法
   */
  getStateByKey: (key: string) => any;
}

export const useAgentState = <T = any>(options: StateActionOptions = {}): UseStateActionReturn => {
  const { initialState, subscribeKey } = options;
  const [stateMap, setStateMap] = useState<Record<string, any>>(initialState || {});
  const [currentStateKey, setCurrentStateKey] = useState<string | null>(null);

  // 使用 ref 来避免不必要的重新渲染
  const stateMapRef = useRef(stateMap);
  stateMapRef.current = stateMap;

  useEffect(
    () =>
      stateManager.subscribeToLatest((newState: T, newStateKey: string) => {
        // 如果指定了 subscribeKey，只有匹配时才更新状态
        if (subscribeKey && newStateKey !== subscribeKey) {
          // 仍然更新内部状态，但不触发重新渲染
          stateMapRef.current = {
            ...stateMapRef.current,
            [newStateKey]: newState,
          };
          return;
        }

        setStateMap((prev) => ({
          ...prev,
          [newStateKey]: newState,
        }));
        setCurrentStateKey(newStateKey);
      }),
    [subscribeKey],
  );

  return {
    stateMap: stateMapRef.current,
    currentStateKey,
    setStateMap,
    getCurrentState: () => stateMapRef.current,
    getStateByKey: (key: string) => stateMapRef.current[key],
  };
};

// 创建 AgentState Context
export const AgentStateContext = createContext<UseStateActionReturn | null>(null);

// 简化的状态选择器
export const useAgentStateDataByKey = (stateKey?: string) => {
  const contextState = useContext(AgentStateContext);
  const independentState = useAgentState({ subscribeKey: stateKey });

  return useMemo(() => {
    if (contextState) {
      // 有 Provider，使用 Context 状态
      const { stateMap } = contextState;
      return stateKey ? stateMap[stateKey] : stateMap;
    }

    // 没有 Provider，使用独立状态
    const { stateMap } = independentState;
    return stateKey ? stateMap[stateKey] : stateMap;
  }, [
    stateKey,
    // 关键：添加和 useAgentStateByKey 相同的深度依赖逻辑
    contextState && (stateKey ? contextState.stateMap[stateKey] : JSON.stringify(contextState.stateMap)),
    independentState && (stateKey ? independentState.stateMap[stateKey] : JSON.stringify(independentState.stateMap)),
  ]);
};

// 导出 Context Hook
export const useAgentStateContext = (): UseStateActionReturn => {
  const context = useContext(AgentStateContext);

  if (!context) {
    throw new Error('useAgentState must be used within AgentStateProvider');
  }

  return context;
};
