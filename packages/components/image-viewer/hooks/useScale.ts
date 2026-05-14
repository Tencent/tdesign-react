import { useCallback, useEffect, useRef, useState } from 'react';
import { zoomIn, zoomOut, clampScale, DEFAULT_IMAGE_SCALE } from '@tdesign/common-js/image-viewer/transform';
import type { ZoomOptions, ZoomResult } from '@tdesign/common-js/image-viewer/transform';
import type { ImageScale } from '../type';

const useScale = (imageScale: ImageScale, visible: boolean, onWheel?: (e: WheelEvent) => void) => {
  const { max, min, step, defaultScale } = { ...DEFAULT_IMAGE_SCALE, ...imageScale };

  const calcDefaultScale = useCallback(() => clampScale(defaultScale, min, max), [defaultScale, max, min]);

  const distance = useRef(0);
  const [scale, setScale] = useState(calcDefaultScale());
  const scaleRef = useRef(scale);

  const paramsRef = useRef({ step, min, max });
  paramsRef.current = { step, min, max };

  const onZoomIn = useCallback((zoomOptions?: ZoomOptions): ZoomResult => {
    const { step: s, min: mi, max: ma } = paramsRef.current;
    const { newScale, zoomResult } = zoomIn(scaleRef.current, s, mi, ma, zoomOptions);
    if (newScale === scaleRef.current) return {};
    scaleRef.current = newScale;
    setScale(newScale);
    return zoomResult;
  }, []);

  const onZoomOut = useCallback((zoomOptions?: ZoomOptions): ZoomResult => {
    const { step: s, min: mi, max: ma } = paramsRef.current;
    const { newScale, zoomResult } = zoomOut(scaleRef.current, s, mi, ma, zoomOptions);
    if (newScale === scaleRef.current) return {};
    scaleRef.current = newScale;
    setScale(newScale);
    return zoomResult;
  }, []);

  const onResetScale = useCallback(() => {
    const defaultVal = calcDefaultScale();
    scaleRef.current = defaultVal;
    setScale(defaultVal);
  }, [calcDefaultScale]);

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
        onZoomIn();
      } else {
        onZoomOut();
      }
      distance.current = currentDistance;
    },
    [onZoomIn, onZoomOut],
  );

  const onTouchEnd = useCallback(() => {
    distance.current = 0;
  }, []);

  const onWheelRef = useRef(onWheel);
  onWheelRef.current = onWheel;

  const stableOnWheel = useCallback((e: WheelEvent) => {
    onWheelRef.current?.(e);
  }, []);

  useEffect(() => {
    if (!visible) return;
    document.addEventListener('wheel', stableOnWheel, { passive: false });
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('wheel', stableOnWheel);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [visible, stableOnWheel, onTouchStart, onTouchMove, onTouchEnd]);

  return {
    scale,
    onZoomIn,
    onZoomOut,
    onResetScale,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default useScale;
