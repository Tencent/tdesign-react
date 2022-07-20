// 缩放控制
import { useCallback, useState } from 'react';

const useScale = (imageScale) => {
  const [scale, setScale] = useState(1);
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

  const onResetScale = useCallback(() => setScale(1), []);

  return {
    scale,
    onZoom,
    onZoomOut,
    onResetScale,
  };
};

export default useScale;
