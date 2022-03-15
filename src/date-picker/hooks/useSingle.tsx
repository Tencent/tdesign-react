import React, { useState, useMemo, useCallback } from 'react';
import { CalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import useConfig from '../../_util/useConfig';
import useDefault from '../../_util/useDefault';
import { TdDatePickerProps, DateValue } from '../type';

const TIME_FORMAT = 'HH:mm:ss';

window.dayjs = dayjs;
export default function useSingle(props: TdDatePickerProps) {
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
    timePickerProps,
    allowInput = true,
    clearable = true,
    presets,
    disableDate,
    format = 'YYYY-MM-DD',
    valueType = 'YYYY-MM-DD',
    placeholder = globalDatePickerConfig.placeholder[mode],
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    onBlur,
    onFocus,
    onInput,
  } = props;

  const [value, onChange] = useDefault(valueFromProps, defaultValueFromProps, onChangeFromProps);

  if (value && !isValidDate(value)) console.error(`value: ${value} is invalid datetime;`);

  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder);
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeValue, setTimeValue] = useState(dayjs(value).format(TIME_FORMAT));
  // const [isHoverCell, setIsHoverCell] = useState(false);

  // 日期格式化
  const formatDate = useCallback(
    (date: DateValue, type = 'format') => {
      if (!date) return '';
      const formatMap = { format, valueType };
      let dateFormat = formatMap[type] || 'YYYY-MM-DD';
      let formatedDate = dayjs(date);
      const [hour, minute, second, millisecond = 0] = timeValue.split(':');

      const arrTime = ['H', 'h', 'm', 's'];
      const hasTime = arrTime.some((f) => String(dateFormat).includes(f));
      if (enableTimePicker) {
        if (!hasTime) dateFormat = [dateFormat, TIME_FORMAT].join(' ');
        formatedDate = formatedDate
          .hour(+hour)
          .minute(+minute)
          .second(+second)
          .millisecond(+millisecond);
      }

      return formatedDate.format(dateFormat);
    },
    [timeValue, enableTimePicker, format, valueType],
  );
  // 未真正选中前可能不断变更输入框的内容
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : '');

  function isValidDate(...args: any) {
    return dayjs(...args).isValid();
  }

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
          onChange(formatDate(val, 'valueType'), dayjs(val));
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

  const panelProps = useMemo(
    () => ({
      value,
      onChange,
      inputValue,
      formatDate,
      timePickerProps,
      mode,
      format,
      presets,
      valueType,
      enableTimePicker,
      firstDayOfWeek,
      disableDate,
      timeValue,
      setInputValue,
      setPopupVisible,
      setTimeValue,
    }),
    [
      setTimeValue,
      timeValue,
      disableDate,
      firstDayOfWeek,
      enableTimePicker,
      inputValue,
      value,
      onChange,
      setInputValue,
      setPopupVisible,
      formatDate,
      timePickerProps,
      mode,
      format,
      presets,
      valueType,
    ],
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
    panelProps,
  };
}
