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
export function useAgentStateAction<T = any>(options: StateActionOptions = {}): UseStateActionReturn<T> {
  const { initialState, stateKey: targetStateKey } = options;

  // 状态Map：stateKey -> state
  const [stateMap, setStateMap] = useState<Map<string, T>>(() => {
    const map = new Map<string, T>();

    if (targetStateKey) {
      // 如果指定了stateKey，获取该stateKey的状态
      const targetState = stateManager.getState(targetStateKey);
      if (targetState !== undefined) {
        map.set(targetStateKey, targetState);
      }
    } else {
      // 如果没有指定stateKey，获取当前stateKey的状态
      const currentStateKey = stateManager.getCurrentStateKey();
      if (currentStateKey) {
        const currentState = stateManager.getCurrentState();
        if (currentState !== undefined) {
          map.set(currentStateKey, currentState);
        }
      }
    }

    return map;
  });

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
    stateKey: displayStateKey,
    updating,
    stateMap,
  };
}
