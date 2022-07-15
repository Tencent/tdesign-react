import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import useFormat from './useFormat';
import useControlled from '../../hooks/useControlled';
import { TdDatePickerProps } from '../type';

export default function useSingleValue(props: TdDatePickerProps) {
  const [value, onChange] = useControlled<string, any>(props, 'value', props.onChange);
  const { isValidDate, formatDate, formatTime } = useFormat({
    value,
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  const [time, setTime] = useState(formatTime(value));
  const [month, setMonth] = useState<number>(dayjs(value).month() || new Date().getMonth());
  const [year, setYear] = useState<number>(dayjs(value).year() || new Date().getFullYear());
  const [cacheValue, setCacheValue] = useState(formatDate(value)); // 缓存选中值，panel 点击时更改

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setCacheValue('');
      return;
    }
    if (!isValidDate(value, 'valueType')) return;

    setCacheValue(formatDate(value));
    setTime(formatTime(value));
    // eslint-disable-next-line
  }, [value]);

  return {
    year,
    month,
    value,
    time,
    cacheValue,
    onChange,
    setYear,
    setMonth,
    setTime,
    setCacheValue,
  };
}
