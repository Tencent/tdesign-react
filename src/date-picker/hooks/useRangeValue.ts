import { useState, useEffect } from 'react';
import useControlled from '../../hooks/useControlled';
import { TdDateRangePickerProps } from '../type';
import {
  isValidDate,
  formatDate,
  formatTime,
  getDefaultFormat,
  initYearMonthTime,
} from '../../_common/js/date-picker/format';
import { extractTimeFormat } from '../../_common/js/date-picker/utils';
import log from '../../_common/js/log';

export const PARTIAL_MAP = { first: 'start', second: 'end' };

export default function useRange(props: TdDateRangePickerProps) {
  const [value, onChange] = useControlled(props, 'value', props.onChange);

  const { format, timeFormat } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    enableTimePicker: props.enableTimePicker,
  });

  if (props.enableTimePicker) {
    if (!extractTimeFormat(format))
      log.error('DatePicker', `format: ${format} 不规范，包含时间选择必须要有时间格式化 HH:mm:ss`);
  }

  // warning invalid value
  if (!Array.isArray(value)) {
    log.error('DatePicker', `typeof value: ${value} must be Array!`);
  } else if (!isValidDate(value, format)) {
    log.error(
      'DatePicker',
      `value: ${value} is invalid dateTime! Check whether the value is consistent with format: ${format}`,
    );
  }

  const [isFirstValueSelected, setIsFirstValueSelected] = useState(false); // 记录面板点击次数，两次后才自动关闭
  const [time, setTime] = useState(initYearMonthTime({ value, mode: props.mode, format, timeFormat }).time);
  const [month, setMonth] = useState<Array<number>>(
    initYearMonthTime({ value, mode: props.mode, format, enableTimePicker: props.enableTimePicker }).month,
  );
  const [year, setYear] = useState<Array<number>>(initYearMonthTime({ value, mode: props.mode, format }).year);
  const [cacheValue, setCacheValue] = useState(formatDate(value, { format })); // 缓存选中值，panel 点击时更改

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setCacheValue([]);
      return;
    }
    if (!isValidDate(value, format)) return;

    setCacheValue(formatDate(value, { format }));
    setTime(formatTime(value, timeFormat));
    // eslint-disable-next-line
  }, [value]);

  return {
    value,
    onChange,
    year,
    setYear,
    month,
    setMonth,
    time,
    setTime,
    isFirstValueSelected,
    setIsFirstValueSelected,
    cacheValue,
    setCacheValue,
  };
}
