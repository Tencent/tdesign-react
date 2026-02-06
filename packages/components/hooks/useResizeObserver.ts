import { useRef } from 'react';
import { canUseDocument } from '../_util/dom';
import useLatest from './useLatest';
import useIsomorphicLayoutEffect from './useLayoutEffect';

export default function useResizeObserver(
  container: React.MutableRefObject<HTMLElement | null>,
  callback: (data: ResizeObserverEntry[]) => void,
  enabled = true,
) {
  const callbackRef = useLatest(callback);
  const observerRef = useRef<ResizeObserver | null>(null);

  useIsomorphicLayoutEffect(() => {
    const isSupport = canUseDocument && window.ResizeObserver;
    const element = container.current;

    if (!enabled) return;

    if (isSupport && element && element instanceof Element) {
      const resizeCallback: ResizeObserverCallback = (entries) => {
        callbackRef.current(entries);
      };
      observerRef.current = new ResizeObserver(resizeCallback);
      observerRef.current.observe(element);
    }

    return () => {
      if (observerRef.current && element && element instanceof Element) {
        observerRef.current.unobserve(element);
        observerRef.current.disconnect?.();
        observerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [container, enabled]);
}
