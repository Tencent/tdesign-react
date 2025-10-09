import { useRef } from 'react';
import useMouseEvent from '../../hooks/useMouseEvent';

interface DialogDragProps {
  dialogCardRef: React.MutableRefObject<HTMLDivElement | null>;
  canDraggable?: boolean;
}

const RESERVED_BORDER_WIDTH = 8; // 保留边框宽度，避免拖拽时误操作

const useDialogDrag = (props: DialogDragProps) => {
  const { dialogCardRef, canDraggable } = props;

  const validWindow = typeof window === 'object';
  const screenHeight = validWindow ? window.innerHeight || document.documentElement.clientHeight : undefined;
  const screenWidth = validWindow ? window.innerWidth || document.documentElement.clientWidth : undefined;

  const dragOffset = useRef({ x: 0, y: 0 });

  const moving = useRef(false);

  useMouseEvent(dialogCardRef, {
    enabled: canDraggable,
    onDown: (e) => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight, style } = dialogCardRef.current;
      if (offsetWidth > screenWidth || offsetHeight > screenHeight)
        return;

      if (e.clientX - offsetLeft <= RESERVED_BORDER_WIDTH || e.clientX - offsetLeft >= offsetWidth - RESERVED_BORDER_WIDTH)
        return;
      if (e.clientY - offsetTop <= RESERVED_BORDER_WIDTH || e.clientY - offsetTop >= offsetHeight - RESERVED_BORDER_WIDTH)
        return;

      style.cursor = 'move';
      moving.current = true;
      dragOffset.current = {
        x: e.clientX - offsetLeft,
        y: e.clientY - offsetTop,
      };
    },
    onMove: (e) => {
      if (!moving.current)
        return;

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
      if (moving.current) {
        moving.current = false;
        dialogCardRef.current.style.cursor = 'default';
      }
    },
  });
};

export default useDialogDrag;
