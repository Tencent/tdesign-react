import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import useLatest from './useLatest';

export interface UseEventListenerOptions extends AddEventListenerOptions {
  /** 为 false 时不绑定监听，默认 true */
  enabled?: boolean;
}

/**
 * 在指定元素上以原生方式绑定事件监听。
 *
 * React 17+ 在根节点上以 passive: true 注册 touchmove 等事件，
 * 导致组件内 onTouchMove 中调用 e.preventDefault() 无法生效，
 * 页面会跟随触摸滚动（见 https://github.com/facebook/react/pull/19654）。
 * 需要 preventDefault 的场景（如阻止页面滚动）应使用本 hook
 * 并传入 { passive: false }。
 *
 * - handler 始终持有最新闭包（基于 useLatest），状态变化时无需重新绑定；
 * - 目标元素延迟挂载或被替换时会自动重新绑定（ref 本身的变化不触发渲染，
 *   故在每次提交后将 ref.current 同步到 state 以驱动重新绑定）；
 * - options 仅在绑定时读取，绑定后再修改 passive/capture 等不会生效。
 *
 * @param targetRef 目标元素 ref
 * @param eventName 事件名
 * @param handler 事件回调
 * @param options 原生 addEventListener options，另支持 enabled 控制是否绑定
 */
export default function useEventListener<K extends keyof HTMLElementEventMap>(
  targetRef: RefObject<HTMLElement | null>,
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options: UseEventListenerOptions = {},
) {
  const handlerLatest = useLatest(handler);
  const { enabled = true, ...listenerOptions } = options;
  const listenerOptionsLatest = useLatest(listenerOptions);

  const [target, setTarget] = useState<HTMLElement | null>(targetRef.current);

  // ref.current 的变化不会触发渲染，需在每次提交后将其同步到 state，
  // 这样目标元素延迟挂载或被替换时才会触发重新绑定。
  // setTarget 传入相同引用时 React 会跳过渲染，不会造成无限更新。
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTarget(targetRef.current);
  });

  useEffect(() => {
    if (!enabled || !target) {
      return undefined;
    }
    const bindOptions = listenerOptionsLatest.current;
    const listener = ((event: HTMLElementEventMap[K]) => handlerLatest.current(event)) as EventListener;
    target.addEventListener(eventName, listener, bindOptions);

    return () => {
      target.removeEventListener(eventName, listener, bindOptions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, target, enabled]);
}
