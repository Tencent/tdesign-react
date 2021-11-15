/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 * */
export function accAdd(arg1, arg2) {
  let r1 = 0;
  let r2 = 0;
  let newArg1 = arg1;
  let newArg2 = arg2;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const c = Math.abs(r1 - r2);
  const m = 10 ** Math.max(r1, r2);
  if (c > 0) {
    const cm = 10 ** c;
    if (r1 > r2) {
      newArg1 = Number(arg1.toString().replace('.', ''));
      newArg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      newArg1 = Number(arg1.toString().replace('.', '')) * cm;
      newArg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    newArg1 = Number(arg1.toString().replace('.', ''));
    newArg2 = Number(arg2.toString().replace('.', ''));
  }
  return (newArg1 + newArg2) / m;
}
