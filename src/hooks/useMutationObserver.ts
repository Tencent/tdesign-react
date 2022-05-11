import { useEffect } from 'react';

const config: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};
function useMutationObserver(
  dom: HTMLElement,
  callback: MutationCallback,
  options: MutationObserverInit = config,
): void {
  useEffect(() => {
    if (dom) {
      const observer = new MutationObserver(callback);
      observer.observe(dom, options);
      return () => {
        observer.disconnect();
      };
    }
  }, [callback, dom, options]);
}

export { useMutationObserver };
