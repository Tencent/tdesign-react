import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LongPressEvent = PointerEvent | TouchEvent;

export interface UseLongPressOptions {
  /**
   * 触发长按的时长阈值（ms）
   * @default 350
   */
  duration?: number;
  /**
   * 移动容差（px），按下后位移超过该值视为滑动/滚动，取消本次长按
   * @default 10
   */
  moveThreshold?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /**
   * 是否阻止触发系统右键菜单（contextmenu）
   * @default false
   */
  preventContextMenu?: boolean;
  /** 达到长按阈值时触发，入参为触发长按的按下事件 */
  onLongPress?: (e: LongPressEvent) => void;
  /** 按压结束（抬起/取消）或移动取消时触发 */
  onPressEnd?: (e: LongPressEvent) => void;
}

/** 可绑定到目标元素上的事件处理器集合 */
export type LongPressHandlers = Record<string, (e: any) => void>;

export interface UseLongPressReturn {
  /** 当前是否处于长按态（按住超过阈值） */
  isLongPressed: boolean;
  /** 当前是否处于按下态（已按下，但未必达到长按阈值） */
  isPressing: boolean;
  /** 可展开绑定到目标元素上的事件处理器（优先 pointer 事件，否则回退 touch 事件） */
  handlers: LongPressHandlers;
  /** 主动停止：清理定时器并重置状态 */
  stop: () => void;
}

interface PressPoint {
  x: number;
  y: number;
}

/** 从 pointer / touch 事件中提取视口坐标 */
function getEventPoint(e: LongPressEvent): PressPoint | null {
  if ('touches' in e) {
    const touch = e.touches[0] ?? e.changedTouches[0];
    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  }
  return { x: e.clientX, y: e.clientY };
}

/**
 * 长按手势：按住超过阈值才进入长按态（isLongPressed = true），短按不触发，松开 / 超出移动容差 / 取消时退出。
 *
 * @example
 * const { isLongPressed, handlers } = useLongPress({ onLongPress: () => showMenu() });
 * // JSX: <div className={classNames({ 'is-active': isLongPressed })} {...handlers} />
 */
export function useLongPress(options: UseLongPressOptions = {}): UseLongPressReturn {
  const { duration = 350, moveThreshold = 10, disabled, preventContextMenu = false, onLongPress, onPressEnd } = options;

  const [isLongPressed, setIsLongPressed] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartPoint = useRef<PressPoint | null>(null);
  const isLongPressedRef = useRef(false);
  const isPressingRef = useRef(false);

  // 使用 ref 保存最新回调与配置，避免 handlers 频繁重建
  const optionsRef = useRef({ duration, moveThreshold, disabled, preventContextMenu, onLongPress, onPressEnd });
  optionsRef.current = { duration, moveThreshold, disabled, preventContextMenu, onLongPress, onPressEnd };

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const resetPress = useCallback(
    (e: LongPressEvent) => {
      clearLongPressTimer();
      pressStartPoint.current = null;
      const wasPressing = isPressingRef.current || isLongPressedRef.current;
      isPressingRef.current = false;
      setIsPressing(false);
      if (isLongPressedRef.current) {
        isLongPressedRef.current = false;
        setIsLongPressed(false);
      }
      if (wasPressing) {
        optionsRef.current.onPressEnd?.(e);
      }
    },
    [clearLongPressTimer],
  );

  const handlePressStart = useCallback(
    (e: LongPressEvent) => {
      if (optionsRef.current.disabled) {
        return;
      }
      // 仅响应主按键：鼠标忽略右键/中键，触摸与触控笔正常
      if ('button' in e && e.pointerType === 'mouse' && e.button !== 0) {
        return;
      }
      clearLongPressTimer();
      pressStartPoint.current = getEventPoint(e);
      isPressingRef.current = true;
      setIsPressing(true);
      longPressTimer.current = setTimeout(() => {
        isLongPressedRef.current = true;
        setIsLongPressed(true);
        optionsRef.current.onLongPress?.(e);
      }, optionsRef.current.duration);
    },
    [clearLongPressTimer],
  );

  const handlePressMove = useCallback(
    (e: LongPressEvent) => {
      if (!pressStartPoint.current) {
        return;
      }
      const point = getEventPoint(e);
      if (!point) {
        return;
      }
      const { x, y } = pressStartPoint.current;
      if (Math.hypot(point.x - x, point.y - y) > optionsRef.current.moveThreshold) {
        resetPress(e);
      }
    },
    [resetPress],
  );

  const handlePressEnd = useCallback(
    (e: LongPressEvent) => {
      if (!isPressingRef.current && !isLongPressedRef.current) {
        return;
      }
      resetPress(e);
    },
    [resetPress],
  );

  const handleContextMenu = useCallback((e: Event) => {
    if (optionsRef.current.preventContextMenu && !optionsRef.current.disabled) {
      e.preventDefault();
    }
  }, []);

  const stop = useCallback(() => {
    clearLongPressTimer();
    pressStartPoint.current = null;
    isPressingRef.current = false;
    isLongPressedRef.current = false;
    setIsPressing(false);
    setIsLongPressed(false);
  }, [clearLongPressTimer]);

  // 卸载时清理
  useEffect(() => () => stop(), [stop]);

  const handlers = useMemo<LongPressHandlers>(() => {
    const supportsPointerEvent = typeof window !== 'undefined' && 'PointerEvent' in window;
    return supportsPointerEvent
      ? {
          onPointerDown: handlePressStart,
          onPointerMove: handlePressMove,
          onPointerUp: handlePressEnd,
          onPointerCancel: resetPress,
          onPointerLeave: resetPress,
          onContextMenu: handleContextMenu,
        }
      : {
          onTouchStart: handlePressStart,
          onTouchMove: handlePressMove,
          onTouchEnd: handlePressEnd,
          onTouchCancel: resetPress,
          onContextMenu: handleContextMenu,
        };
  }, [handlePressStart, handlePressMove, handlePressEnd, resetPress, handleContextMenu]);

  return {
    isLongPressed,
    isPressing,
    handlers,
    stop,
  };
}

export default useLongPress;
