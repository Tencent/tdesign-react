import { ImageScale } from '../type';

const useImageScale = (imageScale: ImageScale) => {
  const result: ImageScale = {
    ...imageScale,
    max: 2,
    min: 0.5,
    step: 0.5,
  };
  if (imageScale?.min !== undefined) result.min = imageScale.min;
  if (imageScale?.max !== undefined) result.max = imageScale.max;
  if (imageScale?.step !== undefined) result.step = imageScale.step;
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
