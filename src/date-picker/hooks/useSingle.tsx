import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import { TdDatePickerProps } from '../type';
import { isValidDate, formatDate, formatTime, getDefaultFormat } from './useFormat';
import useSingleValue from './useSingleValue';

export default function useSingleInput(props: TdDatePickerProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
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
  const [inputValue, setInputValue] = useState(formatDate(value, { format, targetFormat: format }));

  // input 设置
  const inputProps = {
    ...props.inputProps,
    ref: inputRef,
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
      onChange('', { dayjsValue: dayjs(''), trigger: 'clear' });
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
      const newMonth = dayjs(val).month();
      const newYear = dayjs(val).year();
      const newTime = formatTime(val, timeFormat);
      !Number.isNaN(newYear) && setYear(newYear);
      !Number.isNaN(newMonth) && setMonth(newMonth);
      !Number.isNaN(newTime) && setTime(newTime);
    },
    onEnter: (val: string) => {
      if (!isValidDate(val, format) && !isValidDate(value, format)) return;

      setPopupVisible(false);
      if (isValidDate(val, format)) {
        onChange(formatDate(val, { format, targetFormat: valueType }), { dayjsValue: dayjs(val), trigger: 'enter' });
      } else if (isValidDate(value, format)) {
        setInputValue(formatDate(value, { format, targetFormat: format }));
      } else {
        setInputValue('');
      }
    },
  };

  // popup 设置
  const popupProps = {
    expandAnimation: true,
    ...props.popupProps,
    overlayStyle: props.popupProps?.overlayStyle ?? { width: 'auto' },
    overlayClassName: classNames(props.popupProps?.overlayClassName, `${name}__panel-container`),
    onVisibleChange: (visible: boolean, context: any) => {
      if (context.trigger === 'trigger-element-click') {
        return setPopupVisible(true);
      }
      if (!visible) {
        setIsHoverCell(false);
        setInputValue(formatDate(value, { format, targetFormat: format }));
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
    if (!isValidDate(value, valueType)) return;

    setInputValue(formatDate(value, { format, targetFormat: format }));
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
