import { canUseDocument } from '../_util/dom';
import { off, on } from '../_util/listener';
import useDebounce from './useDebounce';
import useLatest from './useLatest';
import useIsomorphicLayoutEffect from './useLayoutEffect';

export default function useResizeObserver(
  container: React.MutableRefObject<HTMLElement | null>,
  callback: (data: ResizeObserverEntry[]) => void,
  options: {
    enabled?: boolean;
    debounce?: number;
  } = {},
) {
  const { enabled = true, debounce = 0 } = options;

  const debounceRef = useDebounce(callback, debounce);
  const callbackRef = useLatest(debounceRef);

  const onResize = () => {
    callbackRef.current();
  };

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;

    const isSupport = canUseDocument && typeof window.ResizeObserver !== 'undefined';
    const element = container.current;

    let observer: ResizeObserver | null = null;

    if (isSupport && element) {
      observer = new ResizeObserver((entries) => {
        callbackRef.current(entries);
      });
      observer.observe(element);
    } else if (element) {
      on(window, 'resize', onResize);
    }

    return () => {
      if (observer && element) {
        observer.unobserve(element);
        observer.disconnect?.();
        observer = null;
      } else {
        off(window, 'resize', onResize);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, enabled]);
}
