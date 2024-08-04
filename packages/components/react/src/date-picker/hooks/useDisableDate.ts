import isObject from 'lodash/isObject';
import type { TdDatePickerProps, TdDateRangePickerProps } from '../type';
import { isEnabledDate } from '../../_common/js/date-picker/utils';

export interface disableDateProps {
  disableDate?: TdDatePickerProps['disableDate'] | TdDateRangePickerProps['disableDate'];
  format?: TdDatePickerProps['format'];
  mode?: TdDatePickerProps['mode'];
  start?: Date;
  end?: Date;
}

export default function useDisableDate(props: disableDateProps) {
  const { disableDate, format, mode, start, end } = props;

  return {
    disableDate: (value: Date) => !isEnabledDate({ disableDate, format, mode, value }),
    minDate: isObject(disableDate) && 'before' in disableDate ? new Date(disableDate.before) : start,
    maxDate: isObject(disableDate) && 'after' in disableDate ? new Date(disableDate.after) : end,
  };
}
