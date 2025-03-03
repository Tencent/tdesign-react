import { useRef, useEffect } from 'react';
import { debounce , isEqual } from 'lodash-es';
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
  const observeRef = useRef(null);
  const optionsRef = useRef<Options>();
  const signalRen = useRef(0);
  const callbackRef = useLatest(cb);

  if (!isEqual(options, optionsRef.current)) {
    signalRen.current += 1;
  }

  optionsRef.current = options;

  useEffect(() => {
    if (!targetEl || !targetEl?.nodeType) return;

    try {
      const { debounceTime, config } = optionsRef.current;
      const mutationCallback: MutationCallback = (...args) => {
        callbackRef.current(...args);
      };
      observeRef.current = new MutationObserver(
        debounceTime > 0 ? debounce(mutationCallback, debounceTime) : mutationCallback,
      );
      observeRef.current.observe(targetEl, config);
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (observeRef.current) {
        observeRef.current.disconnect();
        observeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEl, signalRen.current]);
}
