import { useRef, useEffect } from 'react';
import { debounce, isEqual } from 'lodash-es';
import useLatest from './useLatest';

const DEFAULT_OPTIONS = {
  debounceTime: 0,
  config: {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  } as MutationObserverInit,
};

type Options = typeof DEFAULT_OPTIONS;

export default function useMutationObservable(
  targetEl: HTMLElement | null,
  cb: MutationCallback,
  options = DEFAULT_OPTIONS,
) {
  const optionsRef = useRef<Options>(null);
  const signalRef = useRef(0);
  const callbackRef = useLatest(cb);

  if (!isEqual(options, optionsRef.current)) {
    signalRef.current += 1;
  }

  optionsRef.current = options;

  useEffect(() => {
    if (!targetEl || !targetEl?.nodeType) return;
    let observer: MutationObserver = null;
    try {
      const { debounceTime, config } = optionsRef.current;
      const mutationCallback: MutationCallback = (...args) => {
        callbackRef.current(...args);
      };
      observer = new MutationObserver(debounceTime > 0 ? debounce(mutationCallback, debounceTime) : mutationCallback);
      observer.observe(targetEl, config);
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEl, signalRef.current]);
}
