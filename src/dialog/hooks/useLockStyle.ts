import { useRef, useCallback } from 'react';
import useLayoutEffect from '../../_util/useLayoutEffect';
import getScrollbarWidth from '../../_common/js/utils/getScrollbarWidth';

let key = 1;

export default function useDialogLockStyle({ preventScrollThrough, visible, mode, showInAttachedElement }) {
  const lockStyleRef = useRef(document.createElement('style'));
  const timerRef = useRef(null);

  const clearStyleFunc = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      lockStyleRef.current.parentNode?.removeChild?.(lockStyleRef.current);
    }, 150);
  }, []);

  useLayoutEffect(() => {
    const hasScrollBar = document.body.scrollHeight > document.body.clientHeight;
    const scrollbarWidth = hasScrollBar ? getScrollbarWidth() : 0;

    lockStyleRef.current.dataset.id = `td_dialog_${+new Date()}_${(key += 1)}`;
    lockStyleRef.current.innerHTML = `
      html body {
        overflow-y: hidden;
        width: calc(100% - ${scrollbarWidth}px);
      }
    `;

    return clearStyleFunc;
  }, [clearStyleFunc]);

  useLayoutEffect(() => {
    if (mode !== 'modal' || !preventScrollThrough || showInAttachedElement) return;

    if (visible) {
      document.head.appendChild(lockStyleRef.current);
    } else {
      clearStyleFunc();
    }
  }, [preventScrollThrough, visible, mode, showInAttachedElement, clearStyleFunc]);
}
