import { useCallback, useRef, useState } from 'react';
import { throttle } from 'lodash-es';
import { zoomIn, zoomOut, clampScale, DEFAULT_IMAGE_SCALE } from '@tdesign/common-js/image-viewer/transform';
import type { ZoomOptions, ZoomResult, TranslateOffset } from '@tdesign/common-js/image-viewer/transform';
import type { ImageScale } from '../type';

// 从 common 包重新导出类型，保持向后兼容
export type { ZoomOptions, ZoomResult, TranslateOffset };

const useScale = (imageScale: ImageScale) => {
  const { max, min, step, defaultScale } = { ...DEFAULT_IMAGE_SCALE, ...imageScale };

  const calcDefaultScale = useCallback(() => clampScale(defaultScale, min, max), [defaultScale, max, min]);

  const distance = useRef(0);
  const [scale, setScale] = useState(calcDefaultScale());
  const scaleRef = useRef(scale);
  const lastZoomResultRef = useRef<ZoomResult>({});

  const paramsRef = useRef({ step, min, max });
  paramsRef.current = { step, min, max };

  // --- 节流（50ms，leading-only）：防止高频滚轮/触摸过度触发 ---
  const zoomOptionsRef = useRef<ZoomOptions | undefined>();

  const doZoomRef = useRef(
    throttle(
      () => {
        const { step: s, min: mi, max: ma } = paramsRef.current;
        const { newScale, zoomResult } = zoomIn(scaleRef.current, s, mi, ma, zoomOptionsRef.current);
        lastZoomResultRef.current = zoomResult;
        scaleRef.current = newScale;
        setScale(newScale);
      },
      50,
      { leading: true, trailing: false },
    ),
  );

  const zoomOutOptionsRef = useRef<ZoomOptions | undefined>();
  const doZoomOutRef = useRef(
    throttle(
      () => {
        const { step: s, min: mi, max: ma } = paramsRef.current;
        const { newScale, zoomResult } = zoomOut(scaleRef.current, s, mi, ma, zoomOutOptionsRef.current);
        lastZoomResultRef.current = zoomResult;
        scaleRef.current = newScale;
        setScale(newScale);
      },
      50,
      { leading: true, trailing: false },
    ),
  );

  const onZoomIn = useCallback((zoomOptions?: ZoomOptions): ZoomResult => {
    zoomOptionsRef.current = zoomOptions;
    const prevScale = scaleRef.current;
    doZoomRef.current();
    // 被节流丢弃或已达边界 → 返回空结果，避免调用方使用过期的位移数据
    if (scaleRef.current === prevScale) return {};
    return lastZoomResultRef.current;
  }, []);

  const onZoomOut = useCallback((zoomOptions?: ZoomOptions): ZoomResult => {
    zoomOutOptionsRef.current = zoomOptions;
    const prevScale = scaleRef.current;
    doZoomOutRef.current();
    // 被节流丢弃或已达边界 → 返回空结果，避免调用方使用过期的位移数据
    if (scaleRef.current === prevScale) return {};
    return lastZoomResultRef.current;
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
