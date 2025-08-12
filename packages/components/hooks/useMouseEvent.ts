import { useEffect, useRef } from 'react';

export type MouseEventLike = MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent;
export type MouseCallback = MouseEvent | React.MouseEvent | Touch | React.Touch;

/**
 * 鼠标相对当前元素的坐标
 */
export interface MouseCoordinate {
  x: number;
  y: number;
}
export interface MouseContext {
  coordinate: MouseCoordinate;
}

type MouseEventOptions = {
  enableTouch?: boolean;
  onStart?: (e: MouseCallback, ctx: MouseContext) => void;
  onEnter?: (e: MouseCallback, ctx: MouseContext) => void;
  onMove?: (e: MouseCallback, ctx: MouseContext) => void;
  onLeave?: (e: MouseCallback, ctx: MouseContext) => void;
  onEnd?: (e: MouseCallback, ctx: MouseContext) => void;
};

const useMouseEvent = (elementRef: React.RefObject<HTMLElement>, options: MouseEventOptions) => {
  const { enableTouch = true } = options; // 默认支持触摸事件
  const isMovingRef = useRef(false);

  const normalizeEvent = (e: MouseEventLike) => {
    if (!enableTouch) {
      return e as MouseEvent;
    }
    if ('touches' in e) {
      return e.touches[0];
    }
    if ('changedTouches' in e) {
      return e.changedTouches[0];
    }
    return e as MouseEvent;
  };

  const getCoordinate = (event: MouseCallback) => {
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }
    const { clientX, clientY } = event;
    const left = clientX - rect.left;
    const top = clientY - rect.top;
    return {
      x: Math.min(Math.max(0, left), rect.width),
      y: Math.min(Math.max(0, top), rect.height),
    };
  };

  const emitMouseChange = (e: MouseEventLike, handler?: (e: MouseCallback, ctx: MouseContext) => void) => {
    if (!handler) return;
    const event = normalizeEvent(e);
    const coordinate = getCoordinate(event);
    handler(event, { coordinate });
  };

  const handleMouseMove = (e: MouseEventLike) => {
    if (!isMovingRef.current) return;
    e.preventDefault();
    emitMouseChange(e, options.onMove);
  };

  const handleMouseEnd = (e: MouseEventLike) => {
    if (!isMovingRef.current) return;
    isMovingRef.current = false;
    emitMouseChange(e, options.onEnd);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseEnd);
    if (!enableTouch) return;
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseEnd);
  };

  const handleMouseStart = (e: MouseEventLike) => {
    isMovingRef.current = true;
    emitMouseChange(e, options.onStart);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseEnd);
    if (!enableTouch) return;
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseEnd);
  };

  const handleMouseEnter = (e: MouseEventLike) => {
    emitMouseChange(e, options.onEnter);
  };

  const handleMouseLeave = (e: MouseEventLike) => {
    emitMouseChange(e, options.onLeave);
  };

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    el.addEventListener('mousedown', handleMouseStart);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseEnd);
    if (!enableTouch) return;
    el.addEventListener('touchstart', handleMouseStart, { passive: false });

    return () => {
      el.removeEventListener('mousedown', handleMouseStart);
      el.removeEventListener('mouseenter', handleMouseStart);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseEnd);
      el.removeEventListener('touchstart', handleMouseStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef.current, options]);

  return {
    isMoving: isMovingRef.current,
  };
};

export default useMouseEvent;
