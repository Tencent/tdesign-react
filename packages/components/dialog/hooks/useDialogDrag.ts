import { useRef } from 'react';
import useMouseEvent from '../../hooks/useMouseEvent';

interface DialogDragProps {
  dialogCardRef: React.MutableRefObject<HTMLDivElement | null>;
  canDraggable?: boolean;
}

const useDialogDrag = (props: DialogDragProps) => {
  const { dialogCardRef, canDraggable } = props;

  const validWindow = typeof window === 'object';
  const screenHeight = validWindow ? window.innerHeight || document.documentElement.clientHeight : undefined;
  const screenWidth = validWindow ? window.innerWidth || document.documentElement.clientWidth : undefined;

  const dragOffset = useRef({ x: 0, y: 0 });

  useMouseEvent(dialogCardRef, {
    onDown: (e) => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight, style } = dialogCardRef.current;
      if (offsetWidth > screenWidth || offsetHeight > screenHeight) return;
      style.cursor = 'move';
      dragOffset.current = {
        x: e.clientX - offsetLeft,
        y: e.clientY - offsetTop,
      };
    },
    onMove: (e) => {
      const { offsetWidth, offsetHeight, style } = dialogCardRef.current;
      let diffX = e.clientX - dragOffset.current.x;
      let diffY = e.clientY - dragOffset.current.y;
      // 拖拽上左边界限制
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

  if (!canDraggable) return;
};

export default useDialogDrag;
