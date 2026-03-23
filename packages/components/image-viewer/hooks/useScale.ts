import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageScale } from '../type';

export interface ZoomOptions {
  /** 缩放中心点 X 坐标（相对于预览图片容器中心的偏移量） */
  mouseOffsetX?: number;
  /** 缩放中心点 Y 坐标（相对于预览图片容器中心的偏移量） */
  mouseOffsetY?: number;
  /** 当前位移 */
  currentTranslate?: { translateX: number; translateY: number };
}

export interface ZoomResult {
  /** 缩放后的新位移 */
  newTranslate?: { translateX: number; translateY: number };
}

export interface UseScaleOptions {
  /** 自定义滚轮处理函数，返回 true 表示已处理，不执行默认逻辑 */
  onWheelZoom?: (e: WheelEvent, handlers: { onZoom: () => void; onZoomOut: (options?: ZoomOptions) => ZoomResult }) => boolean;
}

/**
 * 计算缩放后的位移补偿
 * 公式：newTranslate = scaleRatio * T + (1 - scaleRatio) * Z
 * 其中 Z 为缩放中心，T 为当前位移，scaleRatio = newScale / oldScale
 */
const calculateTranslateOffset = (
  oldScale: number,
  newScale: number,
  options: ZoomOptions,
): { translateX: number; translateY: number } | undefined => {
  const { mouseOffsetX, mouseOffsetY, currentTranslate } = options;
  // 缺少缩放中心信息时，不计算位移补偿
  if (mouseOffsetX == null || mouseOffsetY == null) {
    return undefined;
  }

  const scaleRatio = newScale / oldScale;
  const { translateX = 0, translateY = 0 } = currentTranslate ?? {};

  return {
    translateX: scaleRatio * translateX + (1 - scaleRatio) * mouseOffsetX,
    translateY: scaleRatio * translateY + (1 - scaleRatio) * mouseOffsetY,
  };
};

const useScale = (imageScale: ImageScale, visible: boolean, options?: UseScaleOptions) => {
  const { max = Infinity, min = 0, step = 0.1, defaultScale = 1 } = imageScale;

  const calcDefaultScale = useCallback(() => Math.max(Math.min(defaultScale, max), min), [defaultScale, max, min]);

  const distance = useRef(0);
  const [scale, setScale] = useState(calcDefaultScale());
  // 用 ref 追踪最新的 scale 值，以便同步计算位移补偿
  const scaleRef = useRef(scale);

  // 复用的 clamp 函数
  const clamp = useCallback((value: number) => Math.max(min, Math.min(max, value)), [max, min]);

  const onZoom = useCallback(() => {
    const newScale = clamp(scaleRef.current + step);
    scaleRef.current = newScale;
    setScale(newScale);
  }, [clamp, step]);

  const onZoomOut = useCallback(
    (zoomOptions?: ZoomOptions): ZoomResult => {
      const currentScale = scaleRef.current;
      const newScale = clamp(currentScale - step);

      // 先计算位移补偿（使用同步的 scale 值）
      const result: ZoomResult = zoomOptions
        ? { newTranslate: calculateTranslateOffset(currentScale, newScale, zoomOptions) }
        : {};

      // 再更新 scale
      scaleRef.current = newScale;
      setScale(newScale);

      return result;
    },
    [clamp, step],
  );

  const onResetScale = useCallback(() => {
    const defaultVal = calcDefaultScale();
    scaleRef.current = defaultVal;
    setScale(defaultVal);
  }, [calcDefaultScale]);

  // 鼠标滚轮缩放
  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      // 如果提供了自定义处理函数且返回 true，不执行默认逻辑
      if (options?.onWheelZoom?.(e, { onZoom, onZoomOut })) {
        return;
      }
      e.deltaY < 0 ? onZoom() : onZoomOut();
    },
    [onZoom, onZoomOut, options],
  );

  // 双指缩放
  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    e.preventDefault();
    const [touch1, touch2] = Array.from(e.touches);
    distance.current = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const [touch1, touch2] = Array.from(e.touches);
      const currentDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
      if (currentDistance > distance.current) {
        onZoom();
      } else {
        onZoomOut();
      }
      distance.current = currentDistance;
    },
    [onZoom, onZoomOut],
  );

  const onTouchEnd = useCallback(() => {
    distance.current = 0;
  }, []);

  useEffect(() => {
    if (!visible) return;
    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [visible, onWheel, onTouchStart, onTouchMove, onTouchEnd]);

  return {
    scale,
    onZoom,
    onZoomOut,
    onResetScale,
  };
};

export default useScale;
