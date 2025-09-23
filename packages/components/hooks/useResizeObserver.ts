import useIsomorphicLayoutEffect from './useLayoutEffect';
import { canUseDocument } from '../_util/dom';
import useLatest from './useLatest';

export default function useResizeObserver(
  container: React.MutableRefObject<HTMLElement | null>,
  callback: (data: ResizeObserverEntry[]) => void,
  enabled = true,
) {
  const callbackRef = useLatest(callback);

  useIsomorphicLayoutEffect(() => {
    const isSupport = canUseDocument && window.ResizeObserver;
    const element = container.current;
    let observer: ResizeObserver = null;

    if (!enabled) return;

    if (isSupport && element) {
      const resizeCallback: ResizeObserverCallback = (entries) => {
        callbackRef.current(entries);
      };
      observer = new ResizeObserver(resizeCallback);
      observer.observe(element);
    }

    return () => {
      if (observer && element) {
        observer.unobserve(element);
        observer.disconnect?.();
        observer = null;
      }
    };
    // eslint-disable-next-line
  }, [container, enabled]);
}
