import { useLayoutEffect } from 'react';

export default function useResizeObserver(container: HTMLElement, callback: (data: [ResizeObserverEntry]) => void) {
  let containerObserver: ResizeObserver = null;

  const observeContainer = () => {
    if (!container || !container || !window || !window.ResizeObserver) {
      containerObserver?.unobserve(container);
      containerObserver?.disconnect();
    } else {
      containerObserver = new ResizeObserver(callback);
      containerObserver.observe(container);
    }
  };

  useLayoutEffect(() => {
    observeContainer();
    return () => {
      containerObserver?.unobserve(container);
      containerObserver?.disconnect();
    };
    // eslint-disable-next-line
  }, [container, containerObserver]);
}
