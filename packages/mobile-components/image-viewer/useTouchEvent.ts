import type React from 'react';
import { useEffect, useRef } from 'react';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';
import type { DispatchZoomChangeFunc, TransformType, UpdateTransformFunc } from './transform';

type Point = {
  x: number;
  y: number;
};

type TouchPointInfoType = {
  point1: Point;
  point2: Point;
  eventType: string;
};

function getDistance(a: Point, b: Point) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.hypot(x, y);
}

export function useTouchEvent(
  imgRef: React.MutableRefObject<HTMLImageElement[]>,
  movable: boolean,
  open: boolean,
  minScale: number,
  transform: TransformType,
  updateTransform: UpdateTransformFunc,
  dispatchZoomChange: DispatchZoomChangeFunc,
  currentIndex?: number,
  swiperRootRef?: React.MutableRefObject<HTMLDivElement>,
) {
  const { rotate, scale, x, y } = transform;

  const isTouching = useRef(false);
  const touchPointInfo = useRef<TouchPointInfoType>({
    point1: { x: 0, y: 0 },
    point2: { x: 0, y: 0 },
    eventType: 'none',
  });

  const updateTouchPointInfo = (values: Partial<TouchPointInfoType>) => {
    touchPointInfo.current = {
      ...touchPointInfo.current,
      ...values,
    };
  };

  const onTouchStart = (event: React.TouchEvent<HTMLImageElement>) => {
    if (!movable) return;
    event.stopPropagation();
    isTouching.current = true;

    const { touches = [] } = event;
    if (touches.length > 1) {
      // touch zoom
      updateTouchPointInfo({
        point1: { x: touches[0].clientX, y: touches[0].clientY },
        point2: { x: touches[1].clientX, y: touches[1].clientY },
        eventType: 'touchZoom',
      });
    } else {
      updateTouchPointInfo({
        point1: {
          x: touches[0].clientX - x,
          y: touches[0].clientY - y,
        },
        eventType: 'move',
      });
    }
  };

  const onTouchMove = (event: React.TouchEvent<HTMLImageElement>) => {
    const { touches = [] } = event;
    const { point1, point2, eventType } = touchPointInfo.current;
    if (scale === 1 && touches.length === 1) return;
    isTouching.current = true;

    if (touches.length > 1 && eventType === 'touchZoom') {
      if (swiperRootRef.current?.style?.transform && swiperRootRef.current?.style?.transform !== 'none') {
        return;
      }
      // touch zoom
      const newPoint1 = {
        x: touches[0].clientX,
        y: touches[0].clientY,
      };
      const newPoint2 = {
        x: touches[1].clientX,
        y: touches[1].clientY,
      };
      const ratio = getDistance(newPoint1, newPoint2) / getDistance(point1, point2);

      dispatchZoomChange(ratio, 'touchZoom', true);
    } else if (eventType === 'move') {
      const newX = touches[0].clientX - point1.x;
      const newY = touches[0].clientY - point1.y;

      // touch move
      updateTransform(
        {
          x: newX,
          y: newY,
        },
        'move',
      );
      updateTouchPointInfo({ eventType: 'move' });
    }
  };

  const onTouchEnd = () => {
    if (!open) return;

    if (isTouching) {
      isTouching.current = false;
    }

    updateTouchPointInfo({ eventType: 'none' });

    if (minScale > scale) {
      /** When the scaling ratio is less than the minimum scaling ratio, reset the scaling ratio */
      return updateTransform({ x: 0, y: 0, scale: minScale }, 'touchZoom');
    }

    const width = imgRef.current[currentIndex].offsetWidth * scale;
    const height = imgRef.current[currentIndex].offsetHeight * scale;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { left, top } = imgRef.current[currentIndex].getBoundingClientRect();
    const isRotate = rotate % 180 !== 0;

    const fixState = getFixScaleEleTransPosition(isRotate ? height : width, isRotate ? width : height, left, top);

    if (fixState) {
      updateTransform({ ...fixState }, 'dragRebound');
    }
  };

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    if (open && movable) {
      window.addEventListener('touchmove', preventDefault, {
        passive: false,
      });
    }
    return () => {
      window.removeEventListener('touchmove', preventDefault);
    };
  }, [open, movable]);

  return {
    isTouching,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
