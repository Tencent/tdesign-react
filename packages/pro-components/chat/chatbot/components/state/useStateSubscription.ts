import { useState, useEffect } from 'react';
import { stateManager } from './StateManager';
import type { StateSubscriptionOptions, UseStateSubscriptionReturn } from './types';

/**
 * 状态订阅Hook
 * 支持两种模式：
 * 1. 不指定runId：订阅当前活跃runId的状态（会跟随最新状态变化）
 * 2. 指定runId：订阅特定runId的状态（不会跟随其他runId变化）
 */
export function useStateSubscription<T = any>(options: StateSubscriptionOptions = {}): UseStateSubscriptionReturn<T> {
  const { initialState, runId: targetRunId } = options;

  // 状态Map：runId -> state
  const [stateMap, setStateMap] = useState<Map<string, T>>(() => {
    const map = new Map<string, T>();

    if (targetRunId) {
      // 如果指定了runId，获取该runId的状态
      const targetState = stateManager.getState(targetRunId);
      if (targetState !== undefined) {
        map.set(targetRunId, targetState);
      }
    } else {
      // 如果没有指定runId，获取当前runId的状态
      const currentRunId = stateManager.getCurrentRunId();
      if (currentRunId) {
        const currentState = stateManager.getCurrentState();
        if (currentState !== undefined) {
          map.set(currentRunId, currentState);
        }
      }
    }

    return map;
  });

  const [currentRunId, setCurrentRunId] = useState<string | null>(() => targetRunId || stateManager.getCurrentRunId());

  const [updating, setUpdating] = useState(false);

  // 订阅状态变化
  useEffect(() => {
    if (targetRunId) {
      // 模式1：订阅特定runId的状态
      const unsubscribe = stateManager.subscribe(targetRunId, (newState: T) => {
        setStateMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(targetRunId, newState);
          return newMap;
        });
        setUpdating(false);
      });

      return unsubscribe;
    }
    // 模式2：订阅当前活跃runId的状态
    const unsubscribe = stateManager.subscribeToCurrentState((newState: T, newRunId: string | null) => {
      if (newRunId) {
        setStateMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(newRunId, newState);
          return newMap;
        });
        setCurrentRunId(newRunId);
      } else {
        // 如果没有当前runId，清空状态
        setStateMap(new Map());
        setCurrentRunId(null);
      }
      setUpdating(false);
    });

    return unsubscribe;
  }, [targetRunId]);

  // 获取当前应该显示的状态
  const displayRunId = targetRunId || currentRunId;
  const displayState = displayRunId ? stateMap.get(displayRunId) : undefined;

  return {
    state: displayState !== undefined ? displayState : initialState || null,
    runId: displayRunId,
    updating,
    // 新增：返回完整的状态Map，供调试使用
    stateMap,
  };
}
