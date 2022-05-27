import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import useControlled from '../../hooks/useControlled';
import { TdDatePickerProps, DateValue } from '../type';
import useFormat from './useFormat';

export default function useSingle(props: TdDatePickerProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const name = `${classPrefix}-date-picker`;

  const inputRef = useRef<HTMLInputElement>();

  const {
    mode,
    prefixIcon,
    suffixIcon,
    inputProps: inputPropsFromProps,
    popupProps: popupPropsFromProps,
    allowInput,
    clearable,
    placeholder = globalDatePickerConfig.placeholder[mode],
    onBlur,
    onFocus,
    onInput,
  } = props;

  const [value, onChange] = useControlled(props, 'value', props.onChange);
  const { isValidDate, formatDate, formatTime } = useFormat({
    value,
    mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [isHoverCell, setIsHoverCell] = useState(false);
  const [timeValue, setTimeValue] = useState(formatTime(value));
  const [month, setMonth] = useState<number>(dayjs(value).month() || new Date().getMonth());
  const [year, setYear] = useState<number>(dayjs(value).year() || new Date().getFullYear());
  // 未真正选中前可能不断变更输入框的内容
  const [inputValue, setInputValue] = useState(formatDate(value));
  const [cacheValue, setCacheValue] = useState(formatDate(value)); // 缓存选中值，panel 点击时更改

  // input 设置
  const inputProps = {
    ...inputPropsFromProps,
    ref: inputRef,
    clearable,
    prefixIcon,
    readonly: !allowInput,
    placeholder,
    suffixIcon: suffixIcon || <CalendarIcon />,
    className: classNames({
      [`${name}__input--placeholder`]: isHoverCell,
    }),
    onClear: ({ e }) => {
      e.stopPropagation();
      setPopupVisible(false);
      onChange('', { dayjsValue: dayjs(''), trigger: 'clear' });
    },
    onBlur: (val: string, { e }) => {
      onBlur?.({ value: val, e });
    },
    onFocus: (_: string, { e }) => {
      onFocus?.({ value, e });
    },
    onChange: (val: string, { e }) => {
      onInput?.({ input: val, value, e });

      // 输入事件
      setInputValue(val);

      // 跳过不符合格式化的输入框内容
      if (!isValidDate(val)) return;
      const newMonth = dayjs(val).month();
      const newYear = dayjs(val).year();
      const newTime = formatTime(val);
      !Number.isNaN(newYear) && setYear(newYear);
      !Number.isNaN(newMonth) && setMonth(newMonth);
      !Number.isNaN(newTime) && setTimeValue(newTime);
    },
    onEnter: (val: string) => {
      if (!isValidDate(val) && !isValidDate(value)) return;

      setPopupVisible(false);
      if (isValidDate(val)) {
        onChange(formatDate(val, 'valueType') as DateValue, { dayjsValue: dayjs(val), trigger: 'enter' });
      } else if (isValidDate(value)) {
        setInputValue(formatDate(value));
      } else {
        setInputValue('');
      }
    },
  };

  // popup 设置
  const popupProps = {
    expandAnimation: true,
    ...popupPropsFromProps,
    overlayStyle: popupPropsFromProps?.overlayStyle ?? { width: 'auto' },
    overlayClassName: classNames(popupPropsFromProps?.overlayClassName, `${name}__panel-container`),
    onVisibleChange: (visible: boolean) => {
      setPopupVisible(visible);
      if (!visible) {
        setIsHoverCell(false);
        setInputValue(formatDate(value));
      }
    },
  };

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setInputValue('');
      setCacheValue('');
      setTimeValue(formatTime(new Date()));
      return;
    }
    if (!isValidDate(value, 'valueType')) return;

    setInputValue(formatDate(value));
    setCacheValue(formatDate(value));
    setTimeValue(formatTime(value));
    // eslint-disable-next-line
  }, [value]);

  return {
    year,
    month,
    value,
    timeValue,
    inputValue,
    popupVisible,
    inputProps,
    popupProps,
    inputRef,
    cacheValue,
    onChange,
    setYear,
    setMonth,
    setTimeValue,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setCacheValue,
  };
}
