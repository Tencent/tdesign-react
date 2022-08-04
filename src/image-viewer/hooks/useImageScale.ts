import { ImageScale } from '../type';

const useImageScale = (imageScale) => {
  const result: ImageScale = {
    max: 2,
    min: 0.5,
    step: 0.5,
  };
  if (imageScale?.min !== undefined) result.min = imageScale.min;
  if (imageScale?.max !== undefined) result.max = imageScale.max;
  if (imageScale?.step !== undefined) result.step = imageScale.step;
  return result;
};

export default useImageScale;
