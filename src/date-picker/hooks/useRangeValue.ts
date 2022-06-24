import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import useControlled from '../../hooks/useControlled';
import { TdDateRangePickerProps, DateValue } from '../type';
import useFormat from './useFormat';

export const PARTIAL_MAP = { first: 'start', second: 'end' };

// 初始化面板年份月份
function initYearMonthTime(value: DateValue[], mode = 'date', format: string, timeFormat = 'HH:mm:ss') {
  const defaultYearMonthTime = {
    year: [dayjs().year(), dayjs().year()],
    month: [dayjs().month(), dayjs().month()],
    time: [dayjs().format(timeFormat), dayjs().format(timeFormat)],
  };
  if (mode === 'year') {
    defaultYearMonthTime.year[1] += 10;
  } else if (mode === 'month') {
    defaultYearMonthTime.year[1] += 1;
  } else if (mode === 'date') {
    defaultYearMonthTime.month[1] += 1;
  }

  if (!value || !Array.isArray(value) || !value.length) {
    return defaultYearMonthTime;
  }

  return {
    year: value.map((v) => dayjs(v, format).year() || dayjs(v).year()),
    month: value.map((v) => dayjs(v, format).month() || dayjs(v).month()),
    time: value.map((v) => dayjs(v, format).format(timeFormat) || dayjs(v).format(timeFormat)),
  };
}

export default function useRange(props: TdDateRangePickerProps) {
  const [value, onChange] = useControlled(props, 'value', props.onChange);
  const { format, isValidDate, timeFormat, formatDate, formatTime } = useFormat({
    value,
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  // warning invalid value
  if (!Array.isArray(value)) {
    console.error(`typeof value: ${value} must be Array!`);
  } else if (!isValidDate(value, 'valueType')) {
    console.error(`value: ${value} is invalid datetime! Check whether the value is consistent with format: ${format}`);
  }

  const [isFirstValueSelected, setIsFirstValueSelected] = useState(false); // 记录面板点击次数，两次后才自动关闭
  const [time, setTime] = useState(initYearMonthTime(value, props.mode, format, timeFormat).time);
  const [month, setMonth] = useState<Array<number>>(initYearMonthTime(value, props.mode, format).month);
  const [year, setYear] = useState<Array<number>>(initYearMonthTime(value, props.mode, format).year);
  const [cacheValue, setCacheValue] = useState(formatDate(value)); // 缓存选中值，panel 点击时更改

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setCacheValue([]);
      setTime([dayjs().format(timeFormat), dayjs().format(timeFormat)]);
      return;
    }
    if (!isValidDate(value, 'valueType')) return;

    setCacheValue(formatDate(value));
    setTime(formatTime(value));
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
