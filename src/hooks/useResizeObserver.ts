import { useLayoutEffect } from 'react';

export default function useResizeObserver(container: HTMLElement, callback: (data: [ResizeObserverEntry]) => void) {
  let containerObserver: ResizeObserver = null;

  const cleanupObserver = () => {
    if (!containerObserver) return;
    containerObserver.unobserve(container);
    containerObserver.disconnect();
    containerObserver = null;
  };

  const addObserver = (el: HTMLElement) => {
    containerObserver = new ResizeObserver(callback);
    containerObserver.observe(el);
  };

  useLayoutEffect(() => {
    const isSupport = window && window.ResizeObserver;
    if (!isSupport) return;

    cleanupObserver();
    container && addObserver(container);

    return () => {
      cleanupObserver();
    };
    // eslint-disable-next-line
  }, [container, containerObserver]);
}
