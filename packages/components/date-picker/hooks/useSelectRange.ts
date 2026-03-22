import { isArray, isFunction } from 'lodash-es';
import {
  computePaginationDisabled,
  decadeHasAnyAllowed,
  getRangeBounds,
  monthHasAnyAllowed,
  yearHasAnyAllowed,
} from '@tdesign/common-js/date-picker/utils';

import { useMemo } from 'react';
import type { TdDatePickerProps } from '../type';

interface UseSelectRangeProps {
  range: TdDatePickerProps['range'];
  mode: TdDatePickerProps['mode'];
  year: number;
  month?: number;
}

export function useSelectRange(props: UseSelectRangeProps) {
  const rangeBounds = useMemo(() => getRangeBounds(props.range), [props.range]);

  const monthAllowed = (year: number, month: number): boolean => monthHasAnyAllowed(props.range, year, month);
  const yearAllowed = (year: number): boolean => yearHasAnyAllowed(props.range, year);
  const decadeAllowed = (decadeEndYear: number): boolean => decadeHasAnyAllowed(props.range, decadeEndYear);

  const paginationDisabled = useMemo(
    () => computePaginationDisabled(props.range, props.mode, props.year, props.month),
    [props],
  );

  const canLoadMoreTop = (firstValue: number): boolean => {
    const { min } = rangeBounds;

    if (isArray(props.range)) {
      if (!min) return true;
      const minYear = min.getFullYear();
      if (props.mode === 'year') {
        const minDecadeEnd = Math.floor(minYear / 10) * 10 + 9;
        return firstValue > minDecadeEnd;
      }
      return firstValue > minYear;
    }

    if (isFunction(props.range)) {
      if (props.mode === 'year') {
        for (let i = firstValue - 10; i >= firstValue - 50; i -= 10) {
          if (decadeAllowed(i)) return true;
        }
        return false;
      }
      for (let i = firstValue - 1; i > firstValue - 10; i--) {
        if (yearAllowed(i)) return true;
      }
      return false;
    }

    return true;
  };

  const canLoadMoreBottom = (lastValue: number): boolean => {
    const { max } = rangeBounds;

    if (isArray(props.range)) {
      if (!max) return true;
      const maxYear = max.getFullYear();
      if (props.mode === 'year') {
        const maxDecadeEnd = Math.floor(maxYear / 10) * 10 + 9;
        return lastValue < maxDecadeEnd;
      }
      return lastValue < maxYear;
    }

    if (isFunction(props.range)) {
      if (props.mode === 'year') {
        for (let i = lastValue + 10; i <= lastValue + 50; i += 10) {
          if (decadeAllowed(i)) return true;
        }
        return false;
      }
      for (let i = lastValue + 1; i <= lastValue + 10; i++) {
        if (yearAllowed(i)) return true;
      }
      return false;
    }

    return true;
  };

  return {
    rangeBounds,
    monthHasAnyAllowed: monthAllowed,
    yearHasAnyAllowed: yearAllowed,
    decadeHasAnyAllowed: decadeAllowed,
    paginationDisabled,
    canLoadMoreTop,
    canLoadMoreBottom,
  };
}
