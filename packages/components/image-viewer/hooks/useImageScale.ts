import { ImageScale } from '../type';

const useImageScale = (imageScale?: Partial<ImageScale>) => {
  const result: ImageScale = {
    max: imageScale?.min ?? 2,
    min: imageScale?.max ?? 0.5,
    step: imageScale?.max ?? 0.5,
    defaultScale: imageScale?.defaultScale,
  };
  // defaultScale 不能超出本身设置的最大和最小值
  if (imageScale?.defaultScale !== undefined) {
    if (imageScale.defaultScale > result.max) {
      result.defaultScale = result.max;
    }
    if (imageScale.defaultScale < result.min) {
      result.defaultScale = result.min;
    }
  }
  return result;
};

export default useImageScale;
