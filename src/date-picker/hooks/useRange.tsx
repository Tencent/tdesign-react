import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import useControlled from '../../hooks/useControlled';
import { RangeInputRefInterface } from '../../range-input';
import { TdDateRangePickerProps, DateValue } from '../type';
import useFormat from './useFormat';

export const PARTIAL_MAP = { first: 'start', second: 'end' };

// 初始化面板年份月份
function initYearMonthTime(value: DateValue[], mode = 'date', format: string, timeFormat = 'HH:mm:ss') {
  const defaultYearMonthTime = {
    year: [dayjs().year(), dayjs().year()],
    month: [dayjs().month(), dayjs().month()],
    time: [dayjs().format(timeFormat), dayjs().format(timeFormat)],
  };
  if (mode === 'year') {
    defaultYearMonthTime.year[1] += 10;
  } else if (mode === 'month') {
    defaultYearMonthTime.year[1] += 1;
  } else if (mode === 'date') {
    defaultYearMonthTime.month[1] += 1;
  }

  if (!value || !Array.isArray(value) || !value.length) {
    return defaultYearMonthTime;
  }

  return {
    year: value.map((v) => dayjs(v, format).year()),
    month: value.map((v) => dayjs(v, format).month()),
    time: value.map((v) => dayjs(v, format).format(timeFormat)),
  };
}

export default function useRange(props: TdDateRangePickerProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const name = `${classPrefix}-date-range-picker`;

  const isMountedRef = useRef(false);
  const inputRef = useRef<RangeInputRefInterface>();

  const {
    mode,
    prefixIcon,
    suffixIcon,
    rangeInputProps: rangeInputPropsFromProps,
    popupProps: popupPropsFromProps,
    allowInput,
    clearable,
    placeholder = globalDatePickerConfig.placeholder[mode],
    onBlur,
    onFocus,
    onInput,
  } = props;

  const [value, onChange] = useControlled(props, 'value', props.onChange);
  const { format, isValidDate, timeFormat, formatDate, formatTime } = useFormat({
    mode,
    value,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  // warning invalid value
  if (!Array.isArray(value)) {
    console.error(`typeof value: ${value} must be Array!`);
  } else if (!isValidDate(value, 'valueType')) {
    console.error(`value: ${value} is invalid datetime!`);
  }

  const [popupVisible, setPopupVisible] = useState(false);
  const [isHoverCell, setIsHoverCell] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // 确定当前选中的输入框序号
  const [isFirstValueSelected, setIsFirstValueSelected] = useState(false); // 记录面板点击次数，两次后才自动关闭
  const [timeValue, setTimeValue] = useState(initYearMonthTime(value, mode, format, timeFormat).time);
  const [month, setMonth] = useState<Array<number>>(initYearMonthTime(value, mode, format).month);
  const [year, setYear] = useState<Array<number>>(initYearMonthTime(value, mode, format).year);
  // 未真正选中前可能不断变更输入框的内容
  const [inputValue, setInputValue] = useState(formatDate(value));
  // 选择阶段预选状态
  const [cacheValue, setCacheValue] = useState(formatDate(value));

  // input 设置
  const rangeInputProps = {
    ...rangeInputPropsFromProps,
    ref: inputRef,
    clearable,
    prefixIcon,
    readonly: !allowInput,
    placeholder,
    activeIndex: popupVisible ? activeIndex : undefined,
    suffixIcon: suffixIcon || <CalendarIcon />,
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
      onBlur?.({ value: newVal, partial: PARTIAL_MAP[position], e });
    },
    onFocus: (newVal: string[], { e, position }) => {
      onFocus?.({ value: newVal, partial: PARTIAL_MAP[position], e });
      setActiveIndex(position === 'first' ? 0 : 1);
    },
    onChange: (newVal: string[], { e, position }) => {
      const index = position === 'first' ? 0 : 1;

      onInput?.({ input: newVal[index], value, partial: PARTIAL_MAP[position], e });
      setInputValue(newVal);

      // 跳过不符合格式化的输入框内容
      if (!isValidDate(newVal)) return;
      const newYear = [];
      const newMonth = [];
      const newTime = [];
      newVal.forEach((v, i) => {
        newYear.push(dayjs(v).year() || year[i]);
        newMonth.push(dayjs(v).month() || month[i]);
        newTime.push(dayjs(v).format(timeFormat) || timeValue[i]);
      });
      setYear(newYear);
      setMonth(newMonth);
      setTimeValue(newTime);
    },
    onEnter: (newVal: string[]) => {
      if (!isValidDate(newVal) && !isValidDate(value)) return;

      setPopupVisible(false);
      if (isValidDate(newVal)) {
        onChange(formatDate(newVal, 'valueType') as DateValue[], {
          dayjsValue: newVal.map((v) => dayjs(v)),
          trigger: 'enter',
        });
      } else if (isValidDate(value)) {
        setInputValue(formatDate(value));
      } else {
        setInputValue([]);
      }
    },
  };

  // popup 设置
  const popupProps = {
    expandAnimation: true,
    ...popupPropsFromProps,
    overlayStyle: popupPropsFromProps?.overlayStyle ?? { width: 'auto' },
    overlayClassName: classNames(popupPropsFromProps?.overlayClassName, `${name}__panel-container`),
    onVisibleChange: (visible: boolean, context) => {
      // 输入框点击不关闭面板
      if (context.trigger === 'trigger-element-click') {
        const indexMap = { 0: 'first', 1: 'second' };
        inputRef.current.focus({ position: indexMap[activeIndex] });
        return setPopupVisible(true);
      }
      if (visible) {
        // 展开后重置点击次数
        setIsFirstValueSelected(false);
      } else {
        setIsHoverCell(false);
        setInputValue(formatDate(value));
      }

      setPopupVisible(visible);
    },
  };

  // 输入框响应 value 变化
  useEffect(() => {
    if (!value) {
      setInputValue([]);
      setCacheValue([]);
      setTimeValue([dayjs().format(timeFormat), dayjs().format(timeFormat)]);
      return;
    }
    if (!isValidDate(value, 'valueType')) return;

    setInputValue(formatDate(value));
    setCacheValue(formatDate(value));
    setTimeValue(formatTime(value));
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
    timeValue,
    inputValue,
    popupVisible,
    rangeInputProps,
    popupProps,
    isHoverCell,
    onChange,
    setYear,
    setMonth,
    setTimeValue,
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
