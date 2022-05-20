import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdDateRangePickerProps } from './type';
import { RangeInputPopup } from '../range-input';
import DateRangePickerPanel from './panel/DateRangePickerPanel';
import useRange from './hooks/useRange';
import useFormat from './hooks/useFormat';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils-new';
import { dateRangePickerDefaultProps } from './defaultProps';

export interface DateRangePickerProps extends TdDateRangePickerProps, StyledProps {}

const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>((props, ref) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();

  const {
    className,
    style,
    disabled,
    mode,
    enableTimePicker,
    disableDate,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    presets,
    timePickerProps,
    onPick,
  } = props;

  const {
    inputValue,
    popupVisible,
    rangeInputProps,
    popupProps,
    value,
    year,
    month,
    timeValue,
    activeIndex,
    isHoverCell,
    setActiveIndex,
    onChange,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setTimeValue,
    setYear,
    setMonth,
    isFirstValueSelected,
    setIsFirstValueSelected,
    cacheValue,
    setCacheValue,
  } = useRange(props);

  const { formatTime, formatDate, isValidDate, format, timeFormat } = useFormat({
    mode,
    value,
    enableTimePicker,
    format: props.format,
    valueType: props.valueType,
  });

  // 记录面板是否选中过
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    // 面板展开重置数据
    if (popupVisible) {
      setIsSelected(false);
      setIsFirstValueSelected(false);
      setCacheValue(formatDate(value || []));
      setTimeValue(formatTime(value || [dayjs().format(timeFormat), dayjs().format(timeFormat)]));
    }
    // eslint-disable-next-line
  }, [value, popupVisible]);

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    setIsHoverCell(true);
    const nextValue = [...inputValue];
    nextValue[activeIndex] = formatDate(date);
    setInputValue(nextValue);
  }

  // 日期 leave
  function onCellMouseLeave() {
    setIsHoverCell(false);
    setInputValue(cacheValue);
  }

  // 日期点击
  function onCellClick(date: Date, { e, partial }) {
    onPick?.(date, { e, partial });

    setIsHoverCell(false);
    setIsSelected(true);

    const nextValue = [...inputValue];
    nextValue[activeIndex] = formatDate(date);
    setCacheValue(nextValue);
    setInputValue(nextValue);

    // date 模式自动切换年月
    if (mode === 'date') {
      // 选择了不属于面板中展示月份的日期
      const partialIndex = partial === 'start' ? 0 : 1;
      const isAdditional = dayjs(date).month() !== month[partialIndex];
      if (isAdditional) {
        // 保证左侧时间小于右侧
        if (activeIndex === 0) setMonth([dayjs(date).month(), Math.min(dayjs(date).month() + 1, 11)]);
        if (activeIndex === 1) setMonth([Math.max(dayjs(date).month() - 1, 0), dayjs(date).month()]);
      }
    }

    // 有时间选择器走 confirm 逻辑
    if (enableTimePicker) return;

    // 确保两端都是有效值
    const notValidIndex = nextValue.findIndex((v) => !v || !isValidDate(v));

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (notValidIndex === -1 && nextValue.length === 2 && !enableTimePicker && isFirstValueSelected) {
      onChange(formatDate(nextValue, 'valueType'), {
        dayjsValue: nextValue.map((v) => dayjs(v)),
        trigger: 'pick',
      });
      setIsFirstValueSelected(false);
      setPopupVisible(false);
    } else if (notValidIndex !== -1) {
      setActiveIndex(notValidIndex);
    } else {
      setActiveIndex(activeIndex ? 0 : 1);
    }

    // 记录选中一次
    setIsFirstValueSelected(true);
  }

  // 头部快速切换
  function onJumperClick(flag: number, { partial }) {
    const partialIndex = partial === 'start' ? 0 : 1;

    const monthCountMap = { date: 1, month: 12, year: 120 };
    const monthCount = monthCountMap[mode] || 0;
    const current = new Date(year[partialIndex], month[partialIndex]);

    let next = null;
    if (flag === -1) {
      next = subtractMonth(current, monthCount);
    } else if (flag === 0) {
      next = new Date();
    } else if (flag === 1) {
      next = addMonth(current, monthCount);
    }

    const nextYear = [...year];
    nextYear[partialIndex] = next.getFullYear();
    const nextMonth = [...month];
    nextMonth[partialIndex] = next.getMonth();

    // 保证左侧时间不大于右侧
    if (partialIndex === 0) {
      nextYear[1] = Math.max(nextYear[0], nextYear[1]);

      if (nextYear[0] === nextYear[1]) {
        nextMonth[1] = Math.max(nextMonth[0], nextMonth[1]);
      }
    }

    // 保证左侧时间不大于右侧
    if (partialIndex === 1) {
      nextYear[0] = Math.min(nextYear[0], nextYear[1]);

      if (nextYear[0] === nextYear[1]) {
        nextMonth[0] = Math.min(nextMonth[0], nextMonth[1]);
      }
    }

    setYear(nextYear);
    setMonth(nextMonth);
  }

  // time-picker 点击
  function onTimePickerChange(val: string) {
    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(val);

    const nextInputValue = [...inputValue];
    const changedInputValue = inputValue[activeIndex];
    const currentDate = !dayjs(changedInputValue, format).isValid()
      ? dayjs().year(year[activeIndex]).month(month[activeIndex])
      : dayjs(changedInputValue, format);
    // am pm 12小时制转化 24小时制
    let nextHours = hours;
    if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
    if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;

    const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
    nextInputValue[activeIndex] = nextDate;

    const nextTimeValue = [...timeValue];
    nextTimeValue[activeIndex] = val;
    setTimeValue(nextTimeValue);

    setIsSelected(true);
    setInputValue(formatDate(nextInputValue));
    setCacheValue(formatDate(nextInputValue));
  }

  // 确定
  function onConfirmClick() {
    const nextValue = [...inputValue];

    const notValidIndex = nextValue.findIndex((v) => !v || !isValidDate(v));

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (notValidIndex === -1 && nextValue.length === 2 && isFirstValueSelected) {
      onChange(formatDate(nextValue, 'valueType'), {
        dayjsValue: nextValue.map((v) => dayjs(v)),
        trigger: 'confirm',
      });
      setYear(nextValue.map((v) => dayjs(v, format).year()));
      setMonth(nextValue.map((v) => dayjs(v, format).month()));
      setPopupVisible(false);
    } else if (notValidIndex !== -1) {
      setActiveIndex(notValidIndex);
    } else {
      setActiveIndex(activeIndex ? 0 : 1);
    }

    // 记录选中一次
    setIsFirstValueSelected(true);
  }

  // 预设
  function onPresetClick(preset: any) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    if (!Array.isArray(presetValue)) {
      console.error(`preset: ${preset} 预设值必须是数组!`);
    } else {
      onChange(formatDate(presetValue, 'valueType'), {
        dayjsValue: presetValue.map((p) => dayjs(p)),
        trigger: 'preset',
      });
      setPopupVisible(false);
    }
  }

  function onYearChange(nextVal: number, { partial }) {
    let partialIndex = partial === 'start' ? 0 : 1;
    if (enableTimePicker) partialIndex = activeIndex;

    const nextYear = [...year];
    nextYear[partialIndex] = nextVal;
    // 保证左侧时间不大于右侧
    if (partialIndex === 0) nextYear[1] = Math.max(nextYear[0], nextYear[1]);
    if (partialIndex === 1) nextYear[0] = Math.min(nextYear[0], nextYear[1]);

    setYear(nextYear);
  }

  function onMonthChange(nextVal: number, { partial }) {
    let partialIndex = partial === 'start' ? 0 : 1;
    if (enableTimePicker) partialIndex = activeIndex;

    const nextMonth = [...month];
    nextMonth[partialIndex] = nextVal;
    // 保证左侧时间不大于右侧
    if (year[0] === year[1]) {
      if (partialIndex === 0) nextMonth[1] = Math.max(nextMonth[0], nextMonth[1]);
      if (partialIndex === 1) nextMonth[0] = Math.min(nextMonth[0], nextMonth[1]);
    }

    setMonth(nextMonth);
  }

  const panelProps = {
    hoverValue: isHoverCell ? inputValue : [],
    value: isSelected ? cacheValue : value,
    isFirstValueSelected,
    year,
    month,
    mode,
    format,
    presets,
    timeValue,
    disableDate,
    firstDayOfWeek,
    timePickerProps,
    enableTimePicker,
    activeIndex,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
  };

  return (
    <div className={classNames(`${classPrefix}-date-range-picker`, className)} style={style} ref={ref}>
      <RangeInputPopup
        disabled={disabled}
        inputValue={inputValue}
        popupProps={popupProps}
        rangeInputProps={rangeInputProps}
        popupVisible={popupVisible}
        panel={<DateRangePickerPanel {...panelProps} />}
      />
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';
DateRangePicker.defaultProps = dateRangePickerDefaultProps;

export default DateRangePicker;
