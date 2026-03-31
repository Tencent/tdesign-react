import { useCallback, useRef, useState } from 'react';
import { throttle } from 'lodash-es';
import { zoomIn, zoomOut, clampScale } from '@tdesign/common-js/image-viewer/transform';
import type { ZoomOptions, ZoomResult, TranslateOffset } from '@tdesign/common-js/image-viewer/types';
import type { ImageScale } from '../type';
import { DEFAULT_IMAGE_SCALE } from './constants';

// 从 common 包重新导出类型，保持向后兼容
export type { ZoomOptions, ZoomResult, TranslateOffset };

const useScale = (imageScale: ImageScale, _visible: boolean) => {
  const { max, min, step, defaultScale } = { ...DEFAULT_IMAGE_SCALE, ...imageScale };

  const calcDefaultScale = useCallback(() => clampScale(defaultScale, min, max), [defaultScale, max, min]);

  const distance = useRef(0);
  const [scale, setScale] = useState(calcDefaultScale());
  // 用 ref 追踪最新的 scale 值，以便同步计算位移补偿
  const scaleRef = useRef(scale);

  // 存储上一次缩放的结果，供节流后同步返回
  const lastZoomResultRef = useRef<ZoomResult>({});

  // 节流内部实现（50ms 间隔），与 Vue 版本保持一致
  const doZoomRef = useRef(
    throttle(
      (scaleRefObj: React.MutableRefObject<number>, stepVal: number, minVal: number, maxVal: number) => {
        const { newScale, zoomResult } = zoomIn(scaleRefObj.current, stepVal, minVal, maxVal);
        lastZoomResultRef.current = zoomResult;
        scaleRefObj.current = newScale;
        setScale(newScale);
      },
      50,
      { leading: true, trailing: false },
    ),
  );

  const doZoomOutRef = useRef(
    throttle(
      (
        scaleRefObj: React.MutableRefObject<number>,
        stepVal: number,
        minVal: number,
        maxVal: number,
        zoomOptions?: ZoomOptions,
      ) => {
        const { newScale, zoomResult } = zoomOut(scaleRefObj.current, stepVal, minVal, maxVal, zoomOptions);
        lastZoomResultRef.current = zoomResult;
        scaleRefObj.current = newScale;
        setScale(newScale);
      },
      50,
      { leading: true, trailing: false },
    ),
  );

  const onZoom = useCallback(() => {
    doZoomRef.current(scaleRef, step, min, max);
  }, [step, min, max]);

  const onZoomOut = useCallback(
    (zoomOptions?: ZoomOptions): ZoomResult => {
      doZoomOutRef.current(scaleRef, step, min, max, zoomOptions);
      return lastZoomResultRef.current;
    },
    [step, min, max],
  );

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

  return {
    scale,
    onZoom,
    onZoomOut,
    onResetScale,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default useScale;
