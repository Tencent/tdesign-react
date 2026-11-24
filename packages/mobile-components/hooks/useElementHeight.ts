import { useRef, useState, useEffect, useCallback } from 'react';

export interface UseElementHeightOptions {
  /** 是否立即计算高度 */
  immediate?: boolean;
  /** 监听窗口大小变化 */
  resizeObserver?: boolean;
}

/**
 * 用于计算元素高度的 hook
 * @param targetRef 目标元素的 ref
 * @param options 配置选项
 * @returns 返回高度和重新计算的方法
 */
export default function useElementHeight(
  targetRef: React.RefObject<HTMLElement | null>,
  options: UseElementHeightOptions = {},
) {
  const { immediate = true, resizeObserver = false } = options;
  const [elementHeight, setElementHeight] = useState(0);
  const resizeObserverInstance = useRef<ResizeObserver | null>(null);

  const calculateHeight = useCallback(() => {
    const currentElement = targetRef.current;
    if (currentElement) {
      // 使用 getBoundingClientRect 获取精确高度
      const { height } = currentElement.getBoundingClientRect();
      setElementHeight(height);
    }
  }, [targetRef]);

  const setupResizeObserver = useCallback(() => {
    if (!resizeObserver) return;

    const currentElement = targetRef.current;
    if (currentElement && window.ResizeObserver) {
      resizeObserverInstance.current = new ResizeObserver(() => {
        calculateHeight();
      });
      resizeObserverInstance.current.observe(currentElement);
    }
  }, [resizeObserver, calculateHeight, targetRef]);

  const cleanupResizeObserver = useCallback(() => {
    if (resizeObserverInstance.current) {
      resizeObserverInstance.current.disconnect();
      resizeObserverInstance.current = null;
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      // 使用 setTimeout 确保在 DOM 更新后计算高度
      const timeoutId = setTimeout(calculateHeight, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [immediate, calculateHeight]);

  useEffect(() => {
    setupResizeObserver();
    return cleanupResizeObserver;
  }, [setupResizeObserver, cleanupResizeObserver]);

  return {
    height: elementHeight,
    calculateHeight,
  };
}
