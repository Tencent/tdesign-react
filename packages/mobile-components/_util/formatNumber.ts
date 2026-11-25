/**
 * 格式化数字
 * @param value 传入的数字字符串
 * @param allowDecimal 是否允许小数，默认为 true
 * @param allowNegative 是否允许负数，默认为 true
 * @returns 返回格式化后的数字字符串
 */
export const formatNumber = (value: string, allowDecimal = true, allowNegative = true) => {
  let resultValue = value;
  if (allowDecimal) {
    const index = value.indexOf('.');
    if (index !== -1) {
      resultValue = `${value.slice(0, index + 1)}${value.slice(index).replace(/\./g, '')}`;
    }
  } else {
    const [splitValue = ''] = value.split('.');
    resultValue = splitValue;
  }

  if (allowNegative) {
    const index = value.indexOf('-');
    if (index !== -1) {
      resultValue = `${value.slice(0, index + 1)}${value.slice(index).replace(/-/g, '')}`;
    }
  } else {
    resultValue = value.replace(/-/g, '');
  }

  return resultValue.replace(/[^\d.-]/g, '');
};
