import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import useControlled from '../../hooks/useControlled';
import { TdDateRangePickerProps, DateRangeValue } from '../type';
import { isValidDate, formatDate, formatTime, getDefaultFormat, parseToDayjs } from './useFormat';
import { extractTimeFormat } from '../../_common/js/date-picker/utils';
import log from '../../_common/js/log';

export const PARTIAL_MAP = { first: 'start', second: 'end' };

// 初始化面板年份月份
export function initYearMonthTime({
  value,
  mode = 'date',
  format,
  timeFormat = 'HH:mm:ss',
  enableTimePicker,
}: {
  value: DateRangeValue;
  mode: string;
  format: string;
  timeFormat?: string;
  enableTimePicker?: boolean;
}) {
  const defaultYearMonthTime = {
    year: [dayjs().year(), dayjs().year()],
    month: [dayjs().month(), dayjs().month()],
    time: [dayjs().format(timeFormat), dayjs().format(timeFormat)],
  };
  if (mode === 'year') {
    defaultYearMonthTime.year[1] += 10;
  } else if (mode === 'month' || mode === 'quarter') {
    defaultYearMonthTime.year[1] += 1;
  } else if ((mode === 'date' || mode === 'week') && !enableTimePicker) {
    defaultYearMonthTime.month[1] += 1;
  }

  if (!value || !Array.isArray(value) || !value.length) {
    return defaultYearMonthTime;
  }

  return {
    year: value.map((v) => parseToDayjs(v, format).year()),
    month: value.map((v) => parseToDayjs(v, format).month()),
    time: value.map((v) => parseToDayjs(v, format).format(timeFormat)),
  };
}

export default function useRange(props: TdDateRangePickerProps) {
  const [value, onChange] = useControlled(props, 'value', props.onChange);

  const { format, valueType, timeFormat } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  if (props.enableTimePicker) {
    if (!extractTimeFormat(format))
      log.error('DatePicker', `format: ${format} 不规范，包含时间选择必须要有时间格式化 HH:mm:ss`);
    if (!extractTimeFormat(valueType) && valueType !== 'time-stamp')
      log.error('DatePicker', `valueType: ${valueType} 不规范，包含时间选择必须要有时间格式化 HH:mm:ss`);
  }

  // warning invalid value
  if (!Array.isArray(value)) {
    log.error('DatePicker', `typeof value: ${value} must be Array!`);
  } else if (!isValidDate(value, valueType)) {
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
  const [cacheValue, setCacheValue] = useState(formatDate(value, { format, targetFormat: format })); // 缓存选中值，panel 点击时更改

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setCacheValue([]);
      return;
    }
    if (!isValidDate(value, valueType)) return;

    setCacheValue(formatDate(value, { format, targetFormat: format }));
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
