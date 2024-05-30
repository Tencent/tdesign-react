import { useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

const DEFAULT_OPTIONS = {
  debounceTime: 0,
  config: {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  } as MutationObserverInit,
};

export default function useMutationObservable(
  targetEl: HTMLElement | null,
  cb: MutationCallback,
  options = DEFAULT_OPTIONS,
) {
  const observeRef = useRef(null);

  useEffect(() => {
    if (!cb || typeof cb !== 'function') return;
    const { debounceTime } = options;
    observeRef.current = new MutationObserver(debounceTime > 0 ? debounce(cb, debounceTime) : cb);
  }, [cb, options]);

  useEffect(() => {
    if (!targetEl || !targetEl?.nodeType) return;

    const { config } = options;
    try {
      observeRef.current.observe(targetEl, config);
    } catch (e) {
      console.error(e);
    }

    return () => {
      observeRef.current.disconnect();
    };
  }, [targetEl, options]);
}
