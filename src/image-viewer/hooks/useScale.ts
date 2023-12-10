// 缩放控制
import { useCallback, useState } from 'react';
import { ImageScale } from '../type';

const useScale = (imageScale: ImageScale) => {
  const [scale, setScale] = useState(() => imageScale.defaultScale ?? 1);
  const onZoom = useCallback(() => {
    setScale((scale) => {
      const newScale = scale + imageScale.step;
      if (newScale < imageScale.min) return imageScale.min;
      if (newScale > imageScale.max) return imageScale.max;
      return newScale;
    });
  }, [imageScale]);

  const onZoomOut = useCallback(() => {
    setScale((scale) => {
      const newScale = scale - imageScale.step;
      if (newScale < imageScale.min) return imageScale.min;
      if (newScale > imageScale.max) return imageScale.max;
      return newScale;
    });
  }, [imageScale]);

  const onResetScale = useCallback(() => setScale(imageScale.defaultScale ?? 1), [imageScale]);

  return {
    scale,
    onZoom,
    onZoomOut,
    onResetScale,
  };
};

export default useScale;
