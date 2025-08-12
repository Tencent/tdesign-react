import { useState, useEffect } from 'react';
import { stateManager } from '../core/adapters/agui';
import type { StateActionOptions, UseStateActionReturn } from '../core/adapters/agui';

/**
 * 状态订阅Hook
 * 根据是否传入stateKey自动决定订阅模式：
 * - 传入stateKey：绑定模式，只订阅特定stateKey的状态，适用于状态隔离场景
 * - 不传stateKey：最新模式，订阅最新状态，适用于状态覆盖场景
 */
export function useAgentState<T = any>(
  options: StateActionOptions & {
    stateKey?: string;
  } = {},
): UseStateActionReturn {
  const { stateKey, initialState } = options;
  const [stateMap, setStateMap] = useState<Record<string, any>>(initialState || {});
  const [currentStateKey, setCurrentStateKey] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // 根据是否有stateKey自动决定订阅模式
  const isBoundMode = !!stateKey;

  // 订阅状态变化
  useEffect(() => {
    if (isBoundMode) {
      // 绑定模式：只订阅特定stateKey
      return stateManager.subscribeToState(stateKey, (newState: T) => {
        setStateMap((prev) => ({ ...prev, [stateKey]: newState }));
        setUpdating(false);
      });
    }
    // 最新模式：订阅最新状态，会覆盖之前的状态
    return stateManager.subscribeToLatest((newState: T, newStateKey: string) => {
      setStateMap({ [newStateKey]: newState }); // 注意：这里是覆盖，不是合并
      setCurrentStateKey(newStateKey);
      setUpdating(false);
    });
  }, [isBoundMode, stateKey]);

  const displayStateKey = isBoundMode ? stateKey : currentStateKey;

  return {
    state: stateMap,
    setStateMap,
    stateKey: displayStateKey || null,
    updating,
  };
}
