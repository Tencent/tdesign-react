import { useState, useEffect } from 'react';
import {
  formatDate,
  formatTime,
  isValidDate,
  getDefaultFormat,
  parseToDayjs,
  extractTimeFormat,
} from '../../_common/js/date-picker/format';
import useControlled from '../../hooks/useControlled';
import { TdDatePickerProps } from '../type';
import log from '../../_common/js/log';

export default function useSingleValue(props: TdDatePickerProps) {
  const [value, onChange] = useControlled(props, 'value', props.onChange);

  const { format, timeFormat } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    enableTimePicker: props.multiple ? false : props.enableTimePicker,
  });

  if (props.enableTimePicker) {
    if (!extractTimeFormat(format))
      log.error('DatePicker', `format: ${format} is invalid，time selection must include time formatting HH:mm:ss`);
  }

  const [time, setTime] = useState(() =>
    formatTime(props.multiple ? value?.[0] : value, format, timeFormat, props.defaultTime),
  );
  const [month, setMonth] = useState<number>(() => parseToDayjs(props.multiple ? value?.[0] : value, format).month());
  const [year, setYear] = useState<number>(() => parseToDayjs(props.multiple ? value?.[0] : value, format).year());
  const [cacheValue, setCacheValue] = useState(() => formatDate(props.multiple ? value?.[0] : value, { format })); // 缓存选中值，panel 点击时更改

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setCacheValue('');
      return;
    }
    if (!isValidDate(value, format)) return;

    setCacheValue(formatDate(value, { format }));
    setTime(formatTime(value, format, timeFormat, props.defaultTime));
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
