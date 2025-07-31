import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

export interface Coordinate {
  x: number;
  y: number;
}

export type DraggableEvent = MouseEvent | TouchEvent;

interface DraggableCallback {
  (coordinate: Coordinate, event?: DraggableEvent): void;
}

interface DraggableProps {
  start?: DraggableCallback;
  drag?: DraggableCallback;
  end?: DraggableCallback;
}

const useDrag = (ref: MutableRefObject<HTMLDivElement>, options: DraggableProps) => {
  const { start, end, drag } = options;

  const isDraggingRef = useRef(false);

  const getCoordinate = (event: DraggableEvent) => {
    try {
      const rect = ref.current?.getBoundingClientRect();

      const isTouchEvent = 'touches' in event;
      const evt = isTouchEvent ? event.touches[0] || event.changedTouches[0] : event;
      const left = evt.clientX - rect.left;
      const top = evt.clientY - rect.top;
      return {
        y: Math.min(Math.max(0, top), rect.height),
        x: Math.min(Math.max(0, left), rect.width),
      };
    } catch (error) {
      return { y: null, x: null };
    }
  };

  const handlePointerMove = (e: DraggableEvent) => {
    if (isDraggingRef.current) drag(getCoordinate(e), e);
  };

  const handlePointerUp = (e: DraggableEvent) => {
    isDraggingRef.current = false;
    end(getCoordinate(e), e);
    document.removeEventListener('mouseup', handlePointerUp);
    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('touchend', handlePointerUp);
    document.removeEventListener('touchmove', handlePointerMove);
  };

  const handlePointerDown = (e: DraggableEvent) => {
    isDraggingRef.current = true;
    start(getCoordinate(e), e as any);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchend', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove);
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handlePointerDown);
      element.addEventListener('touchstart', handlePointerDown, { passive: false });
    }
    return () => {
      if (element) {
        element.removeEventListener('mousedown', handlePointerDown);
        element.removeEventListener('touchstart', handlePointerDown);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isDragging: isDraggingRef.current,
  };
};

export default useDrag;
