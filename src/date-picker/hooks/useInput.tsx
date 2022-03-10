import React, { useState, useMemo, useCallback } from 'react';
import { CalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import useConfig from '../../_util/useConfig';
import useDefault from '../../_util/useDefault';
import { TdDatePickerProps } from '../type';

const TIME_FORMAT = 'HH:mm:ss';

export function isValidDate(...args: any) {
  return dayjs(...args).isValid();
}

window.dayjs = dayjs;
export default function useInput(props: TdDatePickerProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const name = `${classPrefix}-date-picker`;

  const {
    mode = 'month',
    value: valueFromProps,
    defaultValue: defaultValueFromProps,
    onChange: onChangeFromProps,
    prefixIcon,
    suffixIcon,
    enableTimePicker,
    inputProps: inputPropsFromProps,
    popupProps: popupPropsFromProps,
    allowInput = true,
    clearable = true,
    format = 'YYYY-MM-DD',
    valueType = 'YYYY-MM-DD',
    placeholder = globalDatePickerConfig.placeholder[mode],
    onBlur,
    onFocus,
    onInput,
  } = props;

  // 日期格式化
  const formatDate = useCallback(
    (date: string | Date) => {
      let dateFormat = format || 'YYYY-MM-DD';
      const arrTime = ['H', 'h', 'm', 's'];
      const hasTime = arrTime.some((f) => String(dateFormat).includes(f));
      if (enableTimePicker && !hasTime) {
        dateFormat = [dateFormat, TIME_FORMAT].join(' ');
      }
      return dayjs(date).format(dateFormat);
    },
    [format, enableTimePicker],
  );

  const [value, onChange] = useDefault(valueFromProps, defaultValueFromProps, onChangeFromProps);

  if (value && !isValidDate(value)) console.error(`value: ${value} is invalid datetime;`);

  // 未真正选中前可能不断变更输入框的内容
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : '');
  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder);
  const [popupVisible, setPopupVisible] = useState(false);
  // const [isHoverCell, setIsHoverCell] = useState(false);

  // input 设置
  const inputProps = useMemo(
    () => ({
      ...inputPropsFromProps,
      clearable,
      prefixIcon,
      readonly: !allowInput,
      placeholder: inputPlaceholder,
      suffixIcon: suffixIcon || <CalendarIcon />,
      // className: classNames({
      //   [`${name}__input-placeholder`]: isHoverCell,
      // }),
      onClear: ({ e }) => {
        e.stopPropagation();
        setPopupVisible(false);
        onChange('', dayjs());
        setInputValue('');
        setInputPlaceholder(placeholder);
      },
      onBlur: (val: string, { e }) => {
        onBlur?.({ value, e });
        if (!value) return setInputValue('');

        if (!isValidDate(val, format, true)) {
          setInputValue(formatDate(value));
        }
      },
      onFocus: (_: string, { e }) => {
        onFocus?.({ value, e });
        const TODAY = dayjs().format(format);
        const renderPlaceholder = value ? placeholder : TODAY;
        setInputPlaceholder(renderPlaceholder);
      },
      onChange: (val: string, { e }) => {
        setInputValue(val);
        onInput?.({ input: val, value, e });
      },
      onEnter: (val: string) => {
        if (!isValidDate(val) && !isValidDate(value)) return;

        setPopupVisible(false);
        if (isValidDate(val, format, true)) {
          onChange(dayjs(val).format(valueType), dayjs(val));
        } else if (isValidDate(value)) {
          setInputValue(formatDate(value));
        } else {
          setInputValue('');
        }
      },
    }),
    [
      allowInput,
      suffixIcon,
      clearable,
      prefixIcon,
      inputPlaceholder,
      placeholder,
      formatDate,
      onBlur,
      onInput,
      onFocus,
      onChange,
      value,
      format,
      valueType,
      inputPropsFromProps,
    ],
  );

  // popup 设置
  const popupProps = useMemo(
    () => ({
      ...popupPropsFromProps,
      overlayClassName: `${name}__panel-container`,
      onVisibleChange: (visible: boolean) => {
        setPopupVisible(visible);
        if (!visible) setInputPlaceholder(placeholder);
      },
    }),
    [name, placeholder, popupPropsFromProps],
  );

  return {
    value,
    onChange,
    inputValue,
    setInputValue,
    inputPlaceholder,
    setInputPlaceholder,
    popupVisible,
    setPopupVisible,
    inputProps,
    popupProps,
    formatDate,
  };
}
