import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdDateRangePickerProps } from './type';
import { RangeInputPopup } from '../range-input';
import RangePanel from './panel/RangePanel';
import useRange from './hooks/useRange';
import {
  parseToDayjs,
  formatTime,
  formatDate,
  isValidDate,
  getDefaultFormat,
  initYearMonthTime,
} from '../_common/js/date-picker/format';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils';
import { dateRangePickerDefaultProps } from './defaultProps';
import log from '../_common/js/log';

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
    presetsPlacement,
    panelPreselection,
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
    time,
    activeIndex,
    isHoverCell,
    setActiveIndex,
    onChange,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setTime,
    setYear,
    setMonth,
    isFirstValueSelected,
    setIsFirstValueSelected,
    cacheValue,
    setCacheValue,
  } = useRange(props);

  const { format, timeFormat, valueType } = getDefaultFormat({
    mode,
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
      setCacheValue(formatDate(value || [], { format }));
      setTime(formatTime(value || [dayjs().format(timeFormat), dayjs().format(timeFormat)], timeFormat));

      // 空数据重置为当前年月
      if (!value.length) {
        const { year: defaultYear, month: defaultMonth } = initYearMonthTime({ value, mode, format, enableTimePicker });
        setYear(defaultYear);
        setMonth(defaultMonth);
      } else if (value.length === 2 && !enableTimePicker) {
        // 确保右侧面板月份比左侧大 避免两侧面板月份一致
        const nextMonth = value.map((v: string) => parseToDayjs(v, format).month());
        if (year[0] === year[1] && nextMonth[0] === nextMonth[1]) {
          nextMonth[0] === 11 ? (nextMonth[0] -= 1) : (nextMonth[1] += 1);
        }
        setYear(value.map((v: string) => parseToDayjs(v, format).year()));
        setMonth(nextMonth);
      } else {
        setYear(value.map((v: string) => parseToDayjs(v, format).year()));
        setMonth(value.map((v: string) => parseToDayjs(v, format).month()));
      }
    } else {
      setIsHoverCell(false);
      setIsFirstValueSelected(false);
      setInputValue(formatDate(value || [], { format }));
    }
    // eslint-disable-next-line
  }, [popupVisible]);

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    setIsHoverCell(true);
    const nextValue = [...inputValue];
    nextValue[activeIndex] = formatDate(date, { format });
    setInputValue(nextValue);
  }

  // 日期 leave
  function onCellMouseLeave() {
    setIsHoverCell(false);
    setInputValue(cacheValue);
  }

  // 日期点击
  function onCellClick(date: Date, { e, partial }) {
    onPick?.(date, { e, partial: activeIndex ? 'end' : 'start' });

    setIsHoverCell(false);
    setIsSelected(true);

    const nextValue = [...inputValue];
    nextValue[activeIndex] = formatDate(date, { format });
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
    const notValidIndex = nextValue.findIndex((v) => !v || !isValidDate(v, format));

    // 当两端都有有效值时更改 value
    if (notValidIndex === -1 && nextValue.length === 2) {
      // 二次修改时当其中一侧不符合上次区间规范时，清空另一侧数据
      if (!isFirstValueSelected && parseToDayjs(nextValue[0], format).isAfter(parseToDayjs(nextValue[1], format))) {
        nextValue[activeIndex ? 0 : 1] = '';
        setCacheValue(nextValue);
        setInputValue(nextValue);
      } else {
        onChange(formatDate(nextValue, { format, targetFormat: valueType, autoSwap: true }), {
          dayjsValue: nextValue.map((v) => parseToDayjs(v, format)),
          trigger: 'pick',
        });
      }
    }

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (!isFirstValueSelected) {
      let nextIndex = notValidIndex;
      if (nextIndex === -1) nextIndex = activeIndex ? 0 : 1;
      setActiveIndex(nextIndex);
      setIsFirstValueSelected(true);
    } else {
      setPopupVisible(false);
    }
  }

  // 头部快速切换
  function onJumperClick({ trigger, partial }) {
    const partialIndex = partial === 'start' ? 0 : 1;

    const monthCountMap = { date: 1, week: 1, month: 12, quarter: 12, year: 120 };
    const monthCount = monthCountMap[mode] || 0;
    const current = new Date(year[partialIndex], month[partialIndex]);

    let next = null;
    if (trigger === 'prev') {
      next = subtractMonth(current, monthCount);
    } else if (trigger === 'current') {
      next = new Date();
    } else if (trigger === 'next') {
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

    const nextTime = [...time];
    nextTime[activeIndex] = val;
    setTime(nextTime);

    setIsSelected(true);
    setInputValue(formatDate(nextInputValue, { format }));
    setCacheValue(formatDate(nextInputValue, { format }));
  }

  // 确定
  function onConfirmClick() {
    const nextValue = [...inputValue];

    const notValidIndex = nextValue.findIndex((v) => !v || !isValidDate(v, format));

    // 当两端都有有效值时更改 value
    if (notValidIndex === -1 && nextValue.length === 2) {
      // 二次修改时当其中一侧不符合上次区间规范时，清空另一侧数据
      if (!isFirstValueSelected && parseToDayjs(nextValue[0], format).isAfter(parseToDayjs(nextValue[1], format))) {
        nextValue[activeIndex ? 0 : 1] = '';
        setCacheValue(nextValue);
        setInputValue(nextValue);
      } else {
        onChange(formatDate(nextValue, { format, targetFormat: valueType, autoSwap: true }), {
          dayjsValue: nextValue.map((v) => parseToDayjs(v, format)),
          trigger: 'confirm',
        });
      }
    }

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (!isFirstValueSelected) {
      let nextIndex = notValidIndex;
      if (nextIndex === -1) nextIndex = activeIndex ? 0 : 1;
      setActiveIndex(nextIndex);
      setIsFirstValueSelected(true);
    } else {
      setPopupVisible(false);
    }
  }

  // 预设
  function onPresetClick(preset: any) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    if (!Array.isArray(presetValue)) {
      log.error('DateRangePicker', `preset: ${preset} 预设值必须是数组!`);
    } else {
      onChange(formatDate(presetValue, { format, targetFormat: valueType, autoSwap: true }), {
        dayjsValue: presetValue.map((p) => parseToDayjs(p, format)),
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
    panelPreselection,
    year,
    month,
    mode,
    format,
    presets,
    time,
    disableDate,
    firstDayOfWeek,
    timePickerProps,
    enableTimePicker,
    presetsPlacement,
    activeIndex,
    popupVisible,
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
        status={props.status}
        tips={props.tips}
        inputValue={inputValue}
        popupProps={popupProps}
        rangeInputProps={rangeInputProps}
        popupVisible={popupVisible}
        panel={<RangePanel {...panelProps} />}
      />
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';
DateRangePicker.defaultProps = dateRangePickerDefaultProps;

export default DateRangePicker;
