import { useEffect, useRef } from 'react';
import useMouseEvent from '../../hooks/useMouseEvent';

interface DialogDragProps {
  dialogCardRef: React.MutableRefObject<HTMLDivElement | null>;
  canDraggable?: boolean;
}

const useDialogDrag = (props: DialogDragProps) => {
  const { dialogCardRef, canDraggable } = props;

  const dragOffset = useRef({ x: 0, y: 0 });

  /**
   * Ensure the dialog stays within viewport bounds when window is resized
   */
  const clampPosition = () => {
    const { offsetWidth, offsetHeight, style } = dialogCardRef.current;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let left = parseFloat(style.left || '0');
    let top = parseFloat(style.top || '0');

    if (isNaN(left)) left = 0;
    if (isNaN(top)) top = 0;

    let newLeft = left;
    let newTop = top;

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;

    if (newLeft + offsetWidth > screenWidth) {
      newLeft = screenWidth - offsetWidth;
    }

    if (newTop + offsetHeight > screenHeight) {
      newTop = screenHeight - offsetHeight;
    }

    style.left = `${newLeft}px`;
    style.top = `${newTop}px`;
  };

  useMouseEvent(dialogCardRef, {
    enabled: canDraggable,
    onDown: (e) => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight, style } = dialogCardRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (offsetWidth > screenWidth || offsetHeight > screenHeight) return;

      style.cursor = 'move';
      dragOffset.current = {
        x: e.clientX - offsetLeft,
        y: e.clientY - offsetTop,
      };
    },
    onMove: (e) => {
      const { offsetWidth, offsetHeight, style } = dialogCardRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let diffX = e.clientX - dragOffset.current.x;
      let diffY = e.clientY - dragOffset.current.y;

      if (diffX < 0) diffX = 0;
      if (diffY < 0) diffY = 0;

      if (screenWidth - offsetWidth - diffX < 0) diffX = screenWidth - offsetWidth;
      if (screenHeight - offsetHeight - diffY < 0) diffY = screenHeight - offsetHeight;

      style.position = 'absolute';
      style.left = `${diffX}px`;
      style.top = `${diffY}px`;
    },
    onUp: () => {
      dialogCardRef.current.style.cursor = 'default';
    },
  });

  useEffect(() => {
    if (!canDraggable) return;
    window.addEventListener('resize', clampPosition);
    return () => window.removeEventListener('resize', clampPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canDraggable]);
};

export default useDialogDrag;
