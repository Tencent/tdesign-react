import { isArray } from 'lodash-es';

export const getMeaningColumn = (mode: string | string[]) => {
  const arr = ['year', 'month', 'date', 'hour', 'minute', 'second'];

  if (isArray(mode)) {
    const ans = [];
    const [dateMode, timeMode] = mode;
    if (dateMode != null) {
      const cutIndex = arr.indexOf(dateMode);
      if (cutIndex <= 2 && cutIndex > -1) {
        ans.push(...arr.slice(0, cutIndex + 1));
      }
    }
    if (timeMode != null) {
      const cutIndex = arr.indexOf(timeMode);
      if (cutIndex > 2) {
        ans.push(...arr.slice(3, cutIndex + 1));
      }
    }
    return ans;
  }

  const cutIndex = arr.indexOf(mode);

  return arr.slice(0, cutIndex + 1);
};
