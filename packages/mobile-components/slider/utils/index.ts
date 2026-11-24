import type { SliderValue } from '../type';

/**
 * 处理单个number的超限和异常
 * @param {any} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const trimSingleValue = (value: any, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

/**
 * 处理超限和异常value
 * @param value
 * @param props
 * @returns
 */
export const trimValue = (value: number | number[], props: any): number | number[] => {
  const { min, max, range } = props;

  if (range) {
    if (Array.isArray(value)) {
      const newValue = value.map((cur) => trimSingleValue(cur, min, max));
      return newValue[0] <= newValue[1] ? value : [value[1], value[0]];
    }
    return [min, max];
  }

  return trimSingleValue(value, min, max);
};

/**
 * 初始默认值，处理 range / 非 range 模式下的非法输入
 * @param defaultValue
 * @param min
 * @param max
 * @param range
 * @returns {SliderValue}
 */
export const normalizeDefaultValue = (
  defaultValue: SliderValue | undefined,
  min: number,
  max: number,
  range: boolean,
): SliderValue => {
  if (range) {
    return Array.isArray(defaultValue) ? defaultValue : [min, max];
  }
  return Array.isArray(defaultValue) ? min : (defaultValue ?? min);
};
