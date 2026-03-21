import { useEffect, useRef } from 'react';
import useLatest from './useLatest';

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
  enabled?: boolean;
  enableTouch?: boolean; // 支持触摸事件
  onDown?: (e: MouseCallback, ctx: MouseContext) => void;
  onMove?: (e: MouseCallback, ctx: MouseContext) => void;
  onUp?: (e: MouseCallback, ctx: MouseContext) => void;
  onEnter?: (e: MouseCallback, ctx: MouseContext) => void;
  onLeave?: (e: MouseCallback, ctx: MouseContext) => void;
};

const useMouseEvent = (elementRef: React.RefObject<HTMLElement>, options: MouseEventOptions) => {
  const { enabled = true, enableTouch = true } = options;
  const optionsRef = useLatest(options);
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
    if (!event) return;
    const coordinate = getCoordinate(event);
    handler(event, { coordinate });
  };

  const handleMouseMove = (e: MouseEventLike) => {
    if (!isMovingRef.current) return;
    e.preventDefault();
    emitMouseChange(e, optionsRef.current.onMove);
  };

  const handleMouseUp = (e: MouseEventLike) => {
    if (!isMovingRef.current) return;
    isMovingRef.current = false;
    emitMouseChange(e, optionsRef.current.onUp);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
  };

  const handleMouseDown = (e: MouseEventLike) => {
    // 只处理鼠标左键，忽略中和右键
    // 触摸事件没有 button 属性，会正常处理
    if ('button' in e && e.button !== 0) return;

    isMovingRef.current = true;
    emitMouseChange(e, optionsRef.current.onDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    if (!optionsRef.current.enableTouch) return;
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
  };

  const handleMouseEnter = (e: MouseEventLike) => {
    emitMouseChange(e, optionsRef.current.onEnter);
  };

  const handleMouseLeave = (e: MouseEventLike) => {
    emitMouseChange(e, optionsRef.current.onLeave);
  };

  useEffect(() => {
    const el = elementRef.current;
    if (!el || !enabled) return;

    el.addEventListener('mousedown', handleMouseDown);
    // 下面这两个一般是为了处理 hover 状态，可选性监听
    optionsRef.current.onEnter && el.addEventListener('mouseenter', handleMouseEnter);
    optionsRef.current.onLeave && el.addEventListener('mouseleave', handleMouseLeave);

    if (enableTouch) {
      el.addEventListener('touchstart', handleMouseDown, { passive: false });
      el.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);

      if (enableTouch) {
        el.removeEventListener('touchstart', handleMouseDown);
        el.removeEventListener('touchend', handleMouseUp);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, enabled, enableTouch]);

  return {
    isMoving: isMovingRef.current,
  };
};

export default useMouseEvent;
