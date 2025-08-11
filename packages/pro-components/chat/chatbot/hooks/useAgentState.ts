import { useState, useEffect } from 'react';
import { stateManager } from '../core/adapters/agui';
import type { StateActionOptions, UseStateActionReturn } from '../core/adapters/agui';

/**
/**
 * 状态订阅Hook
 * 支持两种模式：
 * 1. 不指定stateKey：订阅当前活跃stateKey的状态（会跟随最新状态变化）
 * 2. 指定stateKey：订阅特定stateKey的状态（不会跟随其他stateKey变化）
 */
export function useAgentState<T = any>(options: StateActionOptions = {}): UseStateActionReturn<T> {
  const { initialState, stateKey: targetStateKey } = options;

  // 初始化状态Map的工具函数
  const initializeStateMap = (): Map<string, T> => {
    const map = new Map<string, T>();

    // 设置状态的通用逻辑
    const setStateIfExists = (key: string, state: T | undefined) => {
      if (state !== undefined) {
        map.set(key, state);
      } else if (initialState !== undefined) {
        map.set(key, initialState);
      }
    };

    if (targetStateKey) {
      // 模式1：指定stateKey
      const targetState = stateManager.getState(targetStateKey);
      setStateIfExists(targetStateKey, targetState);
    } else {
      // 模式2：当前活跃stateKey
      const currentStateKey = stateManager.getCurrentStateKey();
      if (currentStateKey) {
        const currentState = stateManager.getCurrentState();
        setStateIfExists(currentStateKey, currentState);
      }
    }

    return map;
  };

  // 状态Map：stateKey -> state
  const [stateMap, setStateMap] = useState<Map<string, T>>(initializeStateMap);

  const [currentStateKey, setCurrentStateKey] = useState<string | null>(
    () => targetStateKey || stateManager.getCurrentStateKey(),
  );

  const [updating, setUpdating] = useState(false);

  // 订阅状态变化
  useEffect(() => {
    if (targetStateKey) {
      // 模式1：订阅特定stateKey的状态
      const unsubscribe = stateManager.subscribe(targetStateKey, (newState: T) => {
        setStateMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(targetStateKey, newState);
          return newMap;
        });
        setUpdating(false);
      });

      return unsubscribe;
    }
    // 模式2：订阅当前活跃stateKey的状态
    const unsubscribe = stateManager.subscribeToCurrentState((newState: T, newStateKey: string | null) => {
      if (newStateKey) {
        setStateMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(newStateKey, newState);
          return newMap;
        });
        setCurrentStateKey(newStateKey);
      } else {
        // 如果没有当前stateKey，清空状态
        setStateMap(new Map());
        setCurrentStateKey(null);
      }
      setUpdating(false);
    });

    return unsubscribe;
  }, [targetStateKey]);

  // 获取当前应该显示的状态
  const displayStateKey = targetStateKey || currentStateKey;
  const displayState = displayStateKey ? stateMap.get(displayStateKey) : undefined;

  return {
    state: displayState !== undefined ? displayState : initialState || null,
    setStateMap,
    stateKey: displayStateKey,
    updating,
    stateMap,
  };
}
