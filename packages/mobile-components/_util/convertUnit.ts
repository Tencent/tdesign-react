import { isNumber } from 'lodash-es';

export const convertUnit = (val: string | number | undefined) => {
  if (val == null) return 0;
  return isNumber(val) ? `${val}px` : val;
};

export const reconvertUnit = (val: string | number | undefined) => {
  if (val == null) return 0;
  return isNumber(val) ? Number(val) : Number(val.slice(0, -2));
};
