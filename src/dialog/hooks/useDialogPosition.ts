import { useEffect, useRef } from 'react';

export default function useDialogPosition(visible, dialogCardRef) {
  const mousePosRef = useRef(null);

  const getClickPosition = (e: MouseEvent) => {
    mousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    setTimeout(() => {
      mousePosRef.current = null;
    }, 100);
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('click', getClickPosition, true);
  }

  useEffect(() => {
    document.addEventListener('click', getClickPosition, true);

    return () => {
      document.removeEventListener('click', getClickPosition, true);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    // 动画渲染初始位置
    if (mousePosRef.current && dialogCardRef.current) {
      // eslint-disable-next-line
      dialogCardRef.current.style.transformOrigin = `${mousePosRef.current.x - dialogCardRef.current.offsetLeft}px ${
        mousePosRef.current.y - dialogCardRef.current.offsetTop
      }px`;
    }
  }, [visible, dialogCardRef]);
}
