import { useRef } from 'react';

export type Noop = (...args: any[]) => any;

/**
 *  在某些场景中，你可能会需要用 useCallback 记住一个回调，
 *  但由于内部函数必须经常重新创建，记忆效果不是很好，导致子组件重复 render。
 *  对于超级复杂的子组件，重新渲染会对性能造成影响。
 *  通过 usePersistFn，可以保证函数地址永远不会变化。
 * @param fn
 */
export function usePersistFn<T extends Noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>();
  if (!persistFn.current) {
    persistFn.current = function (...args) {
      return fnRef.current.apply(this, args);
    } as T;
  }

  return persistFn.current;
}
