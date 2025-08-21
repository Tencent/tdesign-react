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
  onDown?: (e: MouseCallback, ctx: MouseContext) => void;
  onMove?: (e: MouseCallback, ctx: MouseContext) => void;
  onUp?: (e: MouseCallback, ctx: MouseContext) => void;
  onEnter?: (e: MouseCallback, ctx: MouseContext) => void;
  onLeave?: (e: MouseCallback, ctx: MouseContext) => void;
};

const useMouseEvent = (elementRef: React.RefObject<HTMLElement>, options: MouseEventOptions) => {
  const { enableTouch = true } = options; // 默认支持触摸事件
  const isMovingRef = useRef(false);

  const normalizeEvent = (e: MouseEventLike) => {
    if (!enableTouch) {
      return e as MouseEvent;
    }
    if ('touches' in e && e.touches.length > 0) {
      return e.touches[0];
    }
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      return e.changedTouches[0];
    }
    if ('clientX' in e && 'clientY' in e) {
      return e as MouseEvent;
    }
    return undefined;
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

  const handleMouseUp = (e: MouseEventLike) => {
    if (!isMovingRef.current) return;
    isMovingRef.current = false;
    emitMouseChange(e, options.onUp);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
  };

  const handleMouseDown = (e: MouseEventLike) => {
    isMovingRef.current = true;
    emitMouseChange(e, options.onDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    if (!enableTouch) return;
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
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

    // 基本上只要开启了鼠标事件，就会用到这三个
    // 有的组件虽然只需要 mousemove 的回调结果，但也需要 mousedown 和 mouseup 来控制状态
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    // 下面这两个一般是为了处理 hover 状态，可选性监听
    options.onEnter && el.addEventListener('mouseenter', handleMouseEnter);
    options.onLeave && el.addEventListener('mouseleave', handleMouseLeave);

    if (!enableTouch) return;
    el.addEventListener('touchstart', handleMouseDown, { passive: false });
    el.addEventListener('touchend', handleMouseUp);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseenter', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('touchstart', handleMouseDown);
      el.removeEventListener('touchend', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef.current, options]);

  return {
    isMoving: isMovingRef.current,
  };
};

export default useMouseEvent;
