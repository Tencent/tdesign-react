import { InputNumberInternalValue } from '../InputNumber';

export const isInvalidNumber = (number: number | string) => {
  if (typeof number === 'number') {
    return Number.isNaN(number);
  }

  if (!number) {
    return true;
  }

  // 普通数字 1.1 1
  // 小数点在后 1.
  // 小数点在后 .1
  return !(/^\s*-?\d+(\.\d+)?\s*$/.test(number) || /^\s*-?\d+\.\s*$/.test(number) || /^\s*-?\.\d+\s*$/.test(number));
};

export const getNumberPrecision = (number: number | string) => {
  const numStr = String(number);

  return numStr.includes('.') ? numStr.length - numStr.indexOf('.') - 1 : 0;
};

const multiE = (s: string) => {
  const m = s.match(/[e]/gi);
  return m === null ? false : m.length > 1;
};
const multiDot = (s: string) => {
  const m = s.match(/[.]/g);
  return m === null ? false : m.length > 1;
};
const multiNegative = (s: string) => {
  const m = s.match(/[-]/g);
  return m === null ? false : m.length > 1;
};
export const strToNumber = (s: string): InputNumberInternalValue => {
  if (['', undefined].includes(s)) {
    return 0;
  }
  let filterVal = s.replace(/[^\d.eE。-]/g, '').replace('。', '.');
  if (multiE(filterVal) || multiDot(filterVal) || multiNegative(filterVal)) {
    filterVal = filterVal.substr(0, filterVal.length - 1);
  }

  return filterVal;
};
