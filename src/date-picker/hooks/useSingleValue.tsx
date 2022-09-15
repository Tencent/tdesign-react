import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { formatDate, formatTime, isValidDate, getDefaultFormat } from '../../_common/js/date-picker/format';
import useControlled from '../../hooks/useControlled';
import { TdDatePickerProps } from '../type';
import { extractTimeFormat } from '../../_common/js/date-picker/utils';
import log from '../../_common/js/log';

export default function useSingleValue(props: TdDatePickerProps) {
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

  const [time, setTime] = useState(formatTime(value, timeFormat));
  const [month, setMonth] = useState<number>(dayjs(value).month() || new Date().getMonth());
  const [year, setYear] = useState<number>(dayjs(value).year() || new Date().getFullYear());
  const [cacheValue, setCacheValue] = useState(formatDate(value, { format })); // 缓存选中值，panel 点击时更改

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setCacheValue('');
      return;
    }
    if (!isValidDate(value, format)) return;

    setCacheValue(formatDate(value, { format }));
    setTime(formatTime(value, timeFormat));
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
