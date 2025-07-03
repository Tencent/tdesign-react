import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageScale } from '../type';

const useScale = (imageScale: ImageScale, visible: boolean) => {
  const { max = Infinity, min = 0, step = 0.1, defaultScale = 1 } = imageScale;

  const calcDefaultScale = useCallback(() => Math.max(Math.min(defaultScale, max), min), [defaultScale, max, min]);

  const distance = useRef(0);
  const [scale, setScale] = useState(calcDefaultScale());

  const onZoom = useCallback(() => {
    setScale((scale) => {
      const newScale = scale + step;
      if (newScale < min) return min;
      if (newScale > max) return max;
      return newScale;
    });
  }, [max, min, step]);

  const onZoomOut = useCallback(() => {
    setScale((scale) => {
      const newScale = scale - step;
      if (newScale < min) return min;
      if (newScale > max) return max;
      return newScale;
    });
  }, [max, min, step]);

  const onResetScale = useCallback(() => {
    setScale(calcDefaultScale());
  }, [calcDefaultScale]);

  // 鼠标滚轮缩放
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.deltaY < 0 ? onZoom() : onZoomOut();
  }, [onZoom, onZoomOut]);

  // 双指缩放
  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    e.preventDefault();
    const [touch1, touch2] = Array.from(e.touches);
    distance.current = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
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
  }, [onZoom, onZoomOut]);

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
