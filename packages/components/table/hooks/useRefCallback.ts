import { useCallback, useRef } from 'react';

/**
 * 用于在 ref 挂载时触发回调函数
 */
export default function useRefCallback<T extends HTMLElement = HTMLElement>(ref?: React.MutableRefObject<T | null>) {
  const callbacks = useRef<Array<(node: T) => void>>([]);
  const unmountCallbacks = useRef<Array<() => void>>([]);

  /**
   * 主要的 ref 回调函数
   * 1. 作为 ref 使用：<div ref={onMount} />
   * 2. 注册回调：onMount((node) => { ... })
   */
  const onMount = useCallback(
    (nodeOrCallback: T | ((node: T) => void)) => {
      // 如果传入的是函数，则注册回调
      if (typeof nodeOrCallback === 'function') {
        callbacks.current.push(nodeOrCallback);
        return;
      }

      // 否则是 ref 挂载
      const node = nodeOrCallback as T;
      const prevNode = ref?.current;

      // 更新 ref
      if (ref) {
        // eslint-disable-next-line no-param-reassign
        ref.current = node;
      }

      // 如果是新挂载（从 null 变为有值），触发所有挂载回调
      if (node && !prevNode) {
        callbacks.current.forEach((callback) => {
          callback(node);
        });
      }

      // 如果是卸载（从有值变为 null），触发所有卸载回调
      if (!node && prevNode) {
        unmountCallbacks.current.forEach((callback) => {
          callback();
        });
      }

      return node;
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /**
   * 注册卸载回调
   */
  const onUnmount = useCallback((callback: () => void) => {
    unmountCallbacks.current.push(callback);
  }, []);

  /**
   * 手动清除回调
   */
  const clearCallbacks = useCallback(() => {
    callbacks.current = [];
    unmountCallbacks.current = [];
  }, []);

  return {
    onMount,
    onUnmount,
    clearCallbacks,
  };
}
