import { useRef, useEffect } from 'react';

export interface Coordinate {
  x: number;
  y: number;
}

interface DraggableCallback {
  (coordinate: Coordinate, event?: MouseEvent): void;
}

interface DraggableProps {
  start?: DraggableCallback;
  drag?: DraggableCallback;
  end?: DraggableCallback;
}

const useDrag = (ref, options: DraggableProps) => {
  const { start, end, drag } = options;

  const isDraggingRef = useRef(false);

  const getCoordinate = (event: MouseEvent) => {
    try {
      const rect = ref.current?.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      return {
        y: Math.min(Math.max(0, top), rect.height),
        x: Math.min(Math.max(0, left), rect.width),
      };
    } catch (error) {
      return {
        y: null,
        x: null,
      };
    }
  };

  const handlePointerMove = (e: MouseEvent) => {
    if (isDraggingRef.current) drag(getCoordinate(e), e);
  };

  const handlePointerUp = (e: MouseEvent) => {
    isDraggingRef.current = false;
    end(getCoordinate(e), e);
    window.removeEventListener('mouseup', handlePointerUp);
    window.removeEventListener('mousemove', handlePointerMove);
  };

  const handlePointerDown = (e: MouseEvent) => {
    isDraggingRef.current = true;
    start(getCoordinate(e), e);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('mousemove', handlePointerMove);
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handlePointerDown);
    }
    return () => {
      if (element) {
        element.removeEventListener('mousedown', handlePointerDown);
      }
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('mousemove', handlePointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isDragging: isDraggingRef.current,
  };
};

export default useDrag;
