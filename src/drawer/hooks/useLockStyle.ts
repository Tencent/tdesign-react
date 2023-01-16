import { useRef, useCallback, useMemo } from 'react';
import useLayoutEffect from '../../_util/useLayoutEffect';
import getScrollbarWidth from '../../_common/js/utils/getScrollbarWidth';

let key = 1;

export default function useLockStyle(props) {
  const { preventScrollThrough, mode, visible, showInAttachedElement, placement, sizeValue } = props;
  const lockStyleRef = useRef(document.createElement('style'));
  const timerRef = useRef(null);

  const clearStyleFunc = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      lockStyleRef.current.parentNode?.removeChild?.(lockStyleRef.current);
    }, 150);
  }, []);

  const marginString = useMemo(
    () =>
      ({
        top: `margin: ${sizeValue} 0 0 0`,
        left: `margin: 0 0 0 ${sizeValue}`,
        right: `margin: 0 0 0 -${sizeValue}`,
        bottom: `margin: -${sizeValue} 0 0 0`,
      }[placement]),
    [placement, sizeValue],
  );

  useLayoutEffect(() => {
    const hasScrollBar = document.body.scrollHeight > document.body.clientHeight;
    const scrollbarWidth = hasScrollBar ? getScrollbarWidth() : 0;
    lockStyleRef.current.dataset.id = `td_drawer_${+new Date()}_${(key += 1)}`;
    lockStyleRef.current.innerHTML = `
      html body {
        overflow-y: hidden;
        transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1) 0s;
        ${mode === 'push' ? marginString : `width: calc(100% - ${scrollbarWidth}px);`}
      }
    `;

    return clearStyleFunc;
  }, [mode, marginString, clearStyleFunc]);

  useLayoutEffect(() => {
    if (!preventScrollThrough || showInAttachedElement) return;

    if (visible) {
      document.head.appendChild(lockStyleRef.current);
    } else {
      clearStyleFunc();
    }
  }, [preventScrollThrough, visible, showInAttachedElement, clearStyleFunc]);
}
