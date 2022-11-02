import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon as TdCalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import { RangeInputRefInterface } from '../../range-input';
import { TdDateRangePickerProps, DateValue } from '../type';
import { isValidDate, formatDate, getDefaultFormat, parseToDayjs } from '../../_common/js/date-picker/format';
import useRangeValue from './useRangeValue';

export const PARTIAL_MAP = { first: 'start', second: 'end' };

export default function useRange(props: TdDateRangePickerProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const { CalendarIcon } = useGlobalIcon({ CalendarIcon: TdCalendarIcon });
  const name = `${classPrefix}-date-range-picker`;

  const isMountedRef = useRef(false);
  const inputRef = useRef<RangeInputRefInterface>();

  const {
    value,
    onChange,
    time,
    setTime,
    month,
    setMonth,
    year,
    setYear,
    cacheValue,
    setCacheValue,
    isFirstValueSelected,
    setIsFirstValueSelected,
  } = useRangeValue(props);

  const { format, timeFormat, valueType } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [isHoverCell, setIsHoverCell] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // 确定当前选中的输入框序号
  // 未真正选中前可能不断变更输入框的内容
  const [inputValue, setInputValue] = useState(formatDate(value, { format }));

  // input 设置
  const rangeInputProps = {
    ...props.rangeInputProps,
    ref: inputRef,
    separator: props.separator ?? globalDatePickerConfig.rangeSeparator,
    clearable: props.clearable,
    prefixIcon: props.prefixIcon,
    readonly: !props.allowInput,
    placeholder: props.placeholder ?? globalDatePickerConfig.placeholder[props.mode],
    activeIndex: popupVisible ? activeIndex : undefined,
    suffixIcon: props.suffixIcon ?? <CalendarIcon />,
    className: classNames({
      [`${name}__input--placeholder`]: isHoverCell,
    }),
    onClick: ({ position }) => {
      setActiveIndex(position === 'first' ? 0 : 1);
    },
    onClear: ({ e }) => {
      e.stopPropagation();
      setPopupVisible(false);
      onChange([], { dayjsValue: [], trigger: 'clear' });
    },
    onBlur: (newVal: string[], { e, position }) => {
      props.onBlur?.({ value: newVal, partial: PARTIAL_MAP[position], e });
    },
    onFocus: (newVal: string[], { e, position }) => {
      props.onFocus?.({ value: newVal, partial: PARTIAL_MAP[position], e });
      setActiveIndex(position === 'first' ? 0 : 1);
    },
    onChange: (newVal: string[], { e, position }) => {
      const index = position === 'first' ? 0 : 1;

      props.onInput?.({ input: newVal[index], value, partial: PARTIAL_MAP[position], e });
      setInputValue(newVal);

      // 跳过不符合格式化的输入框内容
      if (!isValidDate(newVal, format)) return;
      const newYear = [];
      const newMonth = [];
      const newTime = [];
      newVal.forEach((v, i) => {
        newYear.push(dayjs(v).year() || year[i]);
        newMonth.push(dayjs(v).month() || month[i]);
        newTime.push(dayjs(v).format(timeFormat) || time[i]);
      });
      setYear(newYear);
      setMonth(newMonth);
      setTime(newTime);
    },
    onEnter: (newVal: string[]) => {
      if (!isValidDate(newVal, format) && !isValidDate(value, format)) return;

      setPopupVisible(false);
      if (isValidDate(newVal, format)) {
        onChange(formatDate(newVal, { format, targetFormat: valueType, autoSwap: true }) as DateValue[], {
          dayjsValue: newVal.map((v) => parseToDayjs(v, format)),
          trigger: 'enter',
        });
      } else if (isValidDate(value, format)) {
        setInputValue(formatDate(value, { format }));
      } else {
        setInputValue([]);
      }
    },
  };

  // popup 设置
  const popupProps = {
    expandAnimation: true,
    ...props.popupProps,
    overlayInnerStyle: props.popupProps?.overlayInnerStyle ?? { width: 'auto' },
    overlayClassName: classNames(props.popupProps?.overlayClassName, `${name}__panel-container`),
    onVisibleChange: (visible: boolean, context) => {
      // 这里劫持了进一步向 popup 传递的 onVisibleChange 事件，为了保证可以在 Datepicker 中使用 popupProps.onVisibleChange，故此处理
      props.popupProps?.onVisibleChange?.(visible, context);
      // 输入框点击不关闭面板
      if (context.trigger === 'trigger-element-click') {
        const indexMap = { 0: 'first', 1: 'second' };
        inputRef.current.focus({ position: indexMap[activeIndex] });
        return setPopupVisible(true);
      }

      setPopupVisible(visible);
    },
  };

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setInputValue([]);
      return;
    }
    if (!isValidDate(value, format)) return;

    setInputValue(formatDate(value, { format }));
    // eslint-disable-next-line
  }, [value]);

  // activeIndex 变化自动 focus 对应输入框
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    const indexMap = { 0: 'first', 1: 'second' };
    inputRef.current.focus({ position: indexMap[activeIndex] });
    // eslint-disable-next-line
  }, [activeIndex]);

  return {
    year,
    month,
    value,
    time,
    inputValue,
    popupVisible,
    rangeInputProps,
    popupProps,
    isHoverCell,
    onChange,
    setYear,
    setMonth,
    setTime,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    activeIndex,
    setActiveIndex,
    isFirstValueSelected,
    setIsFirstValueSelected,
    cacheValue,
    setCacheValue,
  };
}
