import { useLayoutEffect } from 'react';
import isFunction from 'lodash/isFunction';

export default function useResizeObserver(container: HTMLElement, callback: (data: [ResizeObserverEntry]) => void) {
  let containerObserver: ResizeObserver = null;

  const cleanupObserver = () => {
    if (!containerObserver) return;
    containerObserver.unobserve(container);
    isFunction(containerObserver.disconnect) && containerObserver.disconnect();
    containerObserver = null;
  };

  const addObserver = (el: HTMLElement) => {
    containerObserver = new ResizeObserver(callback);
    containerObserver.observe(el);
  };

  useLayoutEffect(() => {
    const isSupport = typeof window !== 'undefined' && window.ResizeObserver;
    if (!isSupport) return;

    cleanupObserver();
    container && addObserver(container);

    return () => {
      cleanupObserver();
    };
    // eslint-disable-next-line
  }, [container, containerObserver]);
}
