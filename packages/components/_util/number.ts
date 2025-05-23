/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript 的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(num1,num2)
 ** 返回值：num1 加上num2 的精确结果
 * */
export function accAdd(num1: number, num2: number) {
  const isFloat = (n: number) => typeof n === 'number' && !Number.isInteger(n);

  if (isFloat(num1) && isFloat(num2)) {
    const [integer1, precision1] = String(num1).split('.');
    const [integer2, precision2] = String(num2).split('.');

    // 获取两个浮点数的最长精度
    const maxPrecisionLen = Math.max(precision1.length, precision2.length);
    // 对齐小数部分的精度长度
    const wholePrecision1 = Number(precision1.padEnd(maxPrecisionLen, '0'));
    const wholePrecision2 = Number(precision2.padEnd(maxPrecisionLen, '0'));

    // 小数部分转化成整数相加之后除以精度最长的 10 的倍数
    const precisionVal = (wholePrecision1 + wholePrecision2) / 10 ** maxPrecisionLen;
    const integerVal = Number(integer1) + Number(integer2);

    return integerVal + precisionVal;
  }

  return num1 + num2;
}
