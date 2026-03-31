import { ImageScale } from '../type';
import { DEFAULT_IMAGE_SCALE } from './constants';

const useImageScale = (imageScale?: Partial<ImageScale>) => {
  // 合并默认值和用户设置
  const result: ImageScale = {
    ...DEFAULT_IMAGE_SCALE,
    ...imageScale,
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
