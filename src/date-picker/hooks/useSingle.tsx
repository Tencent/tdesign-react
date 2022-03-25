import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { CalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import useDefault from '../../_util/useDefault';
import { TdDatePickerProps, DateValue } from '../type';

const TIME_FORMAT = 'HH:mm:ss';

// window.dayjs = dayjs;
export default function useSingle(props: TdDatePickerProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const name = `${classPrefix}-date-picker`;

  const inputRef = useRef<HTMLInputElement>();

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

  const [value, onChange] = useDefault(valueFromProps, defaultValueFromProps, onChangeFromProps);

  if (value && !isValidDate(value)) console.error(`value: ${value} is invalid datetime;`);

  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder);
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeValue, setTimeValue] = useState(dayjs(value).format(TIME_FORMAT));
  const [month, setMonth] = useState(dayjs(value).month() || new Date().getMonth());
  const [year, setYear] = useState(dayjs(value).year() || new Date().getFullYear());
  const [isHoverCell, setIsHoverCell] = useState(false);

  // 兼容未传入正确 format 场景
  const getFinalFormat = useCallback(
    (format) => {
      let dateFormat = format;
      const arrTime = ['H', 'h', 'm', 's'];
      const hasTime = arrTime.some((f) => String(dateFormat).includes(f));
      if (enableTimePicker && !hasTime) dateFormat = [dateFormat, TIME_FORMAT].join(' ');
      return dateFormat;
    },
    [enableTimePicker],
  );

  // 日期格式化
  const formatDate = useCallback(
    (newDate: DateValue, type = 'format') => {
      if (!newDate) return '';
      const formatMap = { format, valueType };
      const dateFormat = getFinalFormat(formatMap[type]);

      let formatedDate = dayjs(newDate);
      const [hour, minute, second, millisecond = 0] = timeValue.split(':');
      if (enableTimePicker) {
        formatedDate = formatedDate
          .hour(+hour)
          .minute(+minute)
          .second(+second)
          .millisecond(+millisecond);
      }

      return formatedDate.format(dateFormat);
    },
    [timeValue, enableTimePicker, format, valueType, getFinalFormat],
  );

  // 未真正选中前可能不断变更输入框的内容
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : undefined);

  function isValidDate(...args: any) {
    return dayjs(...args).isValid();
  }

  // input 设置
  const inputProps = useMemo(
    () => ({
      ...inputPropsFromProps,
      ref: inputRef,
      clearable,
      prefixIcon,
      readonly: !allowInput,
      placeholder: inputPlaceholder,
      suffixIcon: suffixIcon || <CalendarIcon />,
      className: classNames({
        [`${name}__input--placeholder`]: isHoverCell,
      }),
      onClear: ({ e }) => {
        e.stopPropagation();
        setPopupVisible(false);
        onChange('', dayjs(''));
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
        onInput?.({ input: val, value, e });

        // 输入事件
        setInputValue(val);

        const finalFormat = getFinalFormat(format);
        // 跳过不符合格式化的输入框内容
        if (!isValidDate(val, finalFormat, true)) return;
        const newMonth = dayjs(val).month();
        const newYear = dayjs(val).year();
        const newTime = dayjs(val).format(TIME_FORMAT);
        !Number.isNaN(newYear) && setYear(newYear);
        !Number.isNaN(newMonth) && setMonth(newMonth);
        !Number.isNaN(newTime) && setTimeValue(newTime);
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
      name,
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
      isHoverCell,
      getFinalFormat,
    ],
  );

  // popup 设置
  const popupProps = useMemo(
    () => ({
      ...popupPropsFromProps,
      expandAnimation: true,
      overlayClassName: `${name}__panel-container`,
      onVisibleChange: (visible: boolean) => {
        setPopupVisible(visible);
        if (!visible) {
          setIsHoverCell(false);
          setInputPlaceholder(placeholder);
        }
      },
    }),
    [name, placeholder, popupPropsFromProps, setInputPlaceholder, setPopupVisible],
  );

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) return setInputValue('');
    if (!isValidDate(value, format, true)) return;

    setInputValue(formatDate(value));
  }, [value, format, formatDate, setInputValue]);

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
    onChange,
    setYear,
    setMonth,
    setTimeValue,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    formatDate,
  };
}
