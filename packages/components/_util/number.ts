export const numberToPercent = (number: number) => `${number * 100}%`;

/**
 * 精确加法函数，避免 JavaScript 浮点误差
 * - 浮点运算会导致类似 0.1 + 0.2 = 0.30000000000000004 的问题
 * - 该函数通过将数字放大为整数进行运算，再缩小回原精度，得到更精确的结果
 */
export function accAdd(num1: number, num2: number): number {
  // 获取每个数字的小数位长度
  const precision1 = (num1.toString().split('.')[1] || '').length;
  const precision2 = (num2.toString().split('.')[1] || '').length;

  // 取两者中较大的小数位长度，用于计算放大倍数
  const scale = 10 ** Math.max(precision1, precision2);

  // 将小数放大为整数
  const sum = Math.round(num1 * scale) + Math.round(num2 * scale);

  // 缩放回原精度，得到最终结果
  return sum / scale;
}
