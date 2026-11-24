import { useCallback, useEffect, useRef } from 'react';
import { isObject } from 'lodash-es';
import { preventDefault } from '../guide/utils/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
type Position = {
  x: number;
  y: number;
};

export type UseSwipeDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface UseSwipeOptions {
  /**
   * 滑动阈值，默认值为50
   */
  threshold?: number;
  /**
   * 事件监听选项，默认值为false
   */
  listenerOptions?: boolean | { passive?: boolean; capture?: boolean };

  /**
   * 滑动开始时的回调函数
   */
  onSwipeStart?: (e: TouchEvent) => void;

  /**
   * 滑动过程中的回调函数
   */
  onSwipe?: (e: TouchEvent) => void;

  /**
   * 滑动结束时的回调函数
   */
  onSwipeEnd?: (e: TouchEvent) => void;

  /**
   * 是否禁用
   */
  disabled?: boolean;
}

/**
 * Reactive swipe detection.
 *
 * @param target
 * @param options
 */
export function useSwipe(target: EventTarget | null | undefined, options = {} as UseSwipeOptions) {
  const isSwiping = useRef(false); // 用于跟踪当前是否正在发生滑动操作
  const coordsStart = useRef<Position>({ x: 0, y: 0 }); // 用于存储触摸起始位置的坐标
  const coordsEnd = useRef<Position>({ x: 0, y: 0 }); // 用于存储触摸结束位置的坐标
  const coordsOffset = useRef<Position>({ x: 0, y: 0 }); // 用于存储滑动偏移量
  const { threshold = 0, onSwipe, onSwipeEnd, onSwipeStart, listenerOptions = { passive: true }, disabled } = options;

  const updateOffset = useCallback(() => {
    coordsOffset.current = {
      x: coordsEnd.current.x - coordsStart.current.x,
      y: coordsEnd.current.y - coordsStart.current.y,
    };
  }, []);

  const updateCoordsStart = useCallback((x: number, y: number) => {
    coordsStart.current.x = x;
    coordsStart.current.y = y;
  }, []);

  const updateCoordsEnd = useCallback(
    (x: number, y: number) => {
      coordsEnd.current.x = x;
      coordsEnd.current.y = y;
      updateOffset();
    },
    [updateOffset],
  );

  const isThresholdExceeded = useCallback(
    (offset: Position) => {
      const { x, y } = offset;
      return Math.max(Math.abs(x), Math.abs(y)) >= threshold;
    },
    [threshold],
  );

  const offset = () => coordsOffset.current;

  const direction = () => {
    if (!isThresholdExceeded(coordsOffset.current)) return 'none';
    const { x, y } = coordsOffset.current;
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? 'left' : 'right';
    }
    return y > 0 ? 'up' : 'down';
  };

  const getTouchEventCoords = (e: TouchEvent) => [e.touches[0].clientX, e.touches[0].clientY];

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (disabled) return;
      if (
        listenerOptions === true ||
        (isObject(listenerOptions) && listenerOptions.capture && listenerOptions.passive)
      ) {
        preventDefault(e, false);
      }
      const [x, y] = getTouchEventCoords(e);
      updateCoordsStart(x, y);
      updateCoordsEnd(x, y);
      onSwipeStart?.(e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listenerOptions, updateCoordsStart, updateCoordsEnd, onSwipeStart],
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const [x, y] = getTouchEventCoords(e);
      updateCoordsEnd(x, y);
      if (!isSwiping.current && isThresholdExceeded(coordsOffset.current)) {
        isSwiping.current = true;
      }
      if (isSwiping.current) {
        onSwipe?.(e);
      }
    },
    [isThresholdExceeded, onSwipe, updateCoordsEnd],
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isSwiping.current) return;
      isSwiping.current = false;
      onSwipeEnd?.(e);
    },
    [onSwipeEnd],
  );

  useEffect(() => {
    if (target) {
      target.addEventListener('touchstart', onTouchStart, listenerOptions);
      target.addEventListener('touchmove', onTouchMove, listenerOptions);
      target.addEventListener('touchcancel', onTouchEnd, listenerOptions);
      target.addEventListener('touchend', onTouchEnd, listenerOptions);
    }
    return () => {
      if (target) {
        target.removeEventListener('touchstart', onTouchStart, listenerOptions);
        target.removeEventListener('touchmove', onTouchMove, listenerOptions);
        target.removeEventListener('touchcancel', onTouchEnd, listenerOptions);
        target.removeEventListener('touchend', onTouchEnd, listenerOptions);
      }
    };
  }, [
    isThresholdExceeded,
    listenerOptions,
    onSwipe,
    onSwipeEnd,
    onSwipeStart,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    target,
    updateCoordsEnd,
  ]);

  return { offset, direction };
}

/**
 * This is a polyfill for passive event support detection
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export function checkPassiveEventSupport(document = typeof window !== 'undefined' ? window.document : undefined) {
  if (!document) return false;
  let supportsPassive = false;
  const optionsBlock: AddEventListenerOptions = {
    get passive() {
      supportsPassive = true;
      return false;
    },
  };
  document.addEventListener('x', noop, optionsBlock);
  document.removeEventListener('x', noop);
  return supportsPassive;
}
