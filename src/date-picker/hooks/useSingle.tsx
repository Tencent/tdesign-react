import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon as TdCalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import { TdDatePickerProps } from '../type';
import {
  isValidDate,
  formatDate,
  formatTime,
  getDefaultFormat,
  parseToDayjs,
} from '../../_common/js/date-picker/format';
import useSingleValue from './useSingleValue';
import type { TdPopupProps } from '../../popup/type';

export default function useSingleInput(props: TdDatePickerProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const { CalendarIcon } = useGlobalIcon({ CalendarIcon: TdCalendarIcon });
  const name = `${classPrefix}-date-picker`;

  const { format, valueType, timeFormat } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  const inputRef = useRef<HTMLInputElement>();

  const { value, onChange, time, setTime, month, setMonth, year, setYear, cacheValue, setCacheValue } =
    useSingleValue(props);

  const [popupVisible, setPopupVisible] = useState(false);
  const [isHoverCell, setIsHoverCell] = useState(false);
  // 未真正选中前可能不断变更输入框的内容
  const [inputValue, setInputValue] = useState(formatDate(value, { format }));

  // input 设置
  const inputProps = {
    ...props.inputProps,
    ref: inputRef,
    size: props.size,
    clearable: props.clearable,
    prefixIcon: props.prefixIcon,
    readonly: !props.allowInput,
    placeholder: props.placeholder ?? globalDatePickerConfig.placeholder[props.mode],
    suffixIcon: props.suffixIcon ?? <CalendarIcon />,
    className: classNames({
      [`${name}__input--placeholder`]: isHoverCell,
    }),
    onClear: ({ e }) => {
      e.stopPropagation();
      setPopupVisible(false);
      onChange('', { dayjsValue: dayjs(), trigger: 'clear' });
    },
    onBlur: (val: string, { e }) => {
      props.onBlur?.({ value: val, e });
    },
    onFocus: (_: string, { e }) => {
      props.onFocus?.({ value, e });
    },
    onChange: (val: string) => {
      // 输入事件
      setInputValue(val);

      // 跳过不符合格式化的输入框内容
      if (!isValidDate(val, format)) return;
      setCacheValue(val);
      const newMonth = parseToDayjs(val, format).month();
      const newYear = parseToDayjs(val, format).year();
      const newTime = formatTime(val, format, timeFormat, props.defaultTime);
      !Number.isNaN(newYear) && setYear(newYear);
      !Number.isNaN(newMonth) && setMonth(newMonth);
      !Number.isNaN(newTime) && setTime(newTime);
    },
    onEnter: (val: string) => {
      if (!val) {
        onChange('', { dayjsValue: dayjs(), trigger: 'enter' });
        setPopupVisible(false);
        return;
      }

      if (!isValidDate(val, format) && !isValidDate(value, format)) return;

      setPopupVisible(false);
      if (isValidDate(val, format)) {
        onChange(formatDate(val, { format, targetFormat: valueType }), {
          dayjsValue: parseToDayjs(val, format),
          trigger: 'enter',
        });
      } else if (isValidDate(value, format)) {
        setInputValue(formatDate(value, { format }));
      } else {
        setInputValue('');
      }
    },
  };

  // popup 设置
  const popupProps = {
    expandAnimation: true,
    ...props.popupProps,
    trigger: 'mousedown' as TdPopupProps['trigger'],
    overlayInnerStyle: props.popupProps?.overlayInnerStyle ?? { width: 'auto' },
    overlayClassName: classNames(props.popupProps?.overlayClassName, `${name}__panel-container`),
    onVisibleChange: (visible: boolean, context: any) => {
      // 这里劫持了进一步向 popup 传递的 onVisibleChange 事件，为了保证可以在 Datepicker 中使用 popupProps.onVisibleChange，故此处理
      props.popupProps?.onVisibleChange?.(visible, context);
      if (context.trigger === 'trigger-element-mousedown') {
        return setPopupVisible(true);
      }
      setPopupVisible(visible);
    },
  };

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }
    if (!isValidDate(value, format)) return;

    setInputValue(formatDate(value, { format }));
    // eslint-disable-next-line
  }, [value]);

  return {
    year,
    month,
    value,
    time,
    inputValue,
    popupVisible,
    inputProps,
    popupProps,
    inputRef,
    cacheValue,
    onChange,
    setYear,
    setMonth,
    setTime,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setCacheValue,
  };
}
