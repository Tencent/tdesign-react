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
  const mouseMoveXRef = useRef(0)

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
    mouseMoveXRef.current = e.clientX
    if (isDraggingRef.current) drag(getCoordinate(e), e);
  };

  const handlePointerLeave = (e: MouseEvent) => {
    // 鼠标move横向出元素 卸载 mousemove mouseleave 事件
    if(e.clientX !== mouseMoveXRef.current) {
      isDraggingRef.current = false;
      const element = ref.current;
      element.removeEventListener('mousemove', handlePointerMove);
      element.removeEventListener('mouseleave', handlePointerLeave);
    }
  }

  const handlePointerUp = (e: MouseEvent) => {
    isDraggingRef.current = false;
    end(getCoordinate(e), e);
    const element = ref.current;
    element.removeEventListener('mouseup', handlePointerUp);
    element.removeEventListener('mousemove', handlePointerMove);
    element.removeEventListener('mouseleave', handlePointerLeave);
  };

  const handlePointerDown = (e: MouseEvent) => {
    isDraggingRef.current = true;
    start(getCoordinate(e), e);
    const element = ref.current;
    element.addEventListener('mouseup', handlePointerUp);
    element.addEventListener('mousemove', handlePointerMove);
    element.addEventListener('mouseleave', handlePointerLeave);
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isDragging: isDraggingRef.current,
  };
};

export default useDrag;
