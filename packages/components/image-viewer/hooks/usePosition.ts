import { useCallback, useRef, useState } from 'react';

import useMouseEvent from '../../hooks/useMouseEvent';

export type PositionType = [number, number];

interface PositionOptions {
  initPosition?: PositionType;
}

const usePosition = (imgRef: React.RefObject<HTMLDivElement>, options?: PositionOptions) => {
  const { initPosition = [0, 0] } = options || {};

  const [position, setPosition] = useState<PositionType>(initPosition);
  const [isDragging, setIsDragging] = useState(false);
  const lastScreenPositionRef = useRef<{ x: number; y: number } | null>(null);

  // 始终保持最新值的 ref，供外部免订阅地读取
  const positionRef = useRef<PositionType>(position);
  positionRef.current = position;

  const isDraggingRef = useRef<boolean>(isDragging);
  isDraggingRef.current = isDragging;

  useMouseEvent(imgRef, {
    onDown: (e) => {
      const { screenX, screenY } = e;
      lastScreenPositionRef.current = { x: screenX, y: screenY };
      setIsDragging(true);
    },
    onMove: (e) => {
      if (!lastScreenPositionRef.current) return;

      const { screenX, screenY } = e;
      const { x: lastX, y: lastY } = lastScreenPositionRef.current;

      setPosition(([x, y]) => [x + screenX - lastX, y + screenY - lastY]);

      lastScreenPositionRef.current = { x: screenX, y: screenY };
    },
    onUp: () => {
      lastScreenPositionRef.current = null;
      setIsDragging(false);
    },
  });

  const resetPosition = useCallback(() => {
    setPosition(initPosition);
  }, [initPosition]);

  return {
    position,
    positionRef,
    setPosition,
    resetPosition,
    isDragging,
    isDraggingRef,
  };
};

export default usePosition;
