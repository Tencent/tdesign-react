import React, { forwardRef, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { StyledProps } from '../common';
import {
  TdDateRangePickerPanelProps,
  DatePickerYearChangeTrigger,
  DatePickerMonthChangeTrigger,
  DatePickerTimeChangeTrigger,
} from './type';
import RangePanel from './panel/RangePanel';
import useRangeValue from './hooks/useRangeValue';
import { formatDate, getDefaultFormat, parseToDayjs } from '../_common/js/date-picker/format';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils';
import log from '../_common/js/log';

export interface DateRangePickerPanelProps extends TdDateRangePickerPanelProps, StyledProps {}

const DateRangePickerPanel = forwardRef<HTMLDivElement, DateRangePickerPanelProps>((props, ref) => {
  const {
    className,
    style,
    mode,
    enableTimePicker,
    disableDate,
    firstDayOfWeek,
    presets,
    timePickerProps,
    presetsPlacement,
    panelPreselection,
    onPanelClick,
  } = props;

  const {
    value,
    year,
    month,
    time,
    onChange,
    setTime,
    setYear,
    setMonth,
    isFirstValueSelected,
    setIsFirstValueSelected,
    cacheValue,
    setCacheValue,
  } = useRangeValue(props);

  const { format } = getDefaultFormat({
    mode,
    enableTimePicker,
    format: props.format,
  });

  // 记录面板是否选中过
  const [isSelected, setIsSelected] = useState(false);
  const [isHoverCell, setIsHoverCell] = useState(false);
  const [hoverValue, setHoverValue] = useState([]);
  const activeIndex = useMemo(() => (isFirstValueSelected ? 1 : 0), [isFirstValueSelected]);

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    setIsHoverCell(true);
    const nextValue = [...hoverValue];
    nextValue[activeIndex] = formatDate(date, { format });
    setHoverValue(nextValue);
  }

  // 日期 leave
  function onCellMouseLeave() {
    setIsHoverCell(false);
    setHoverValue(cacheValue);
  }

  // 日期点击
  function onCellClick(date: Date, { e, partial }) {
    setIsSelected(true);

    const nextValue = [...cacheValue];
    nextValue[activeIndex] = formatDate(date, { format });
    setCacheValue(nextValue);

    props.onCellClick?.({ date: nextValue.map((v) => dayjs(v).toDate()), e, partial: activeIndex ? 'end' : 'start' });

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

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (nextValue.length === 2 && isFirstValueSelected) {
      onChange(formatDate(nextValue, { format, autoSwap: true }), {
        dayjsValue: nextValue.map((v) => parseToDayjs(v, format)),
        trigger: 'pick',
      });
      setIsFirstValueSelected(false);
    } else {
      // 记录选中一次
      setIsFirstValueSelected(true);
    }
  }

  // 头部快速切换
  function onJumperClick({ trigger, partial }) {
    const partialIndex = partial === 'start' ? 0 : 1;

    const triggerMap = { '-1': 'arrow-previous', 1: 'arrow-next' };
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

    if (year.some((y) => !nextYear.includes(y))) {
      props.onYearChange?.({
        partial,
        year: nextYear[partialIndex],
        date: value.map((v) => parseToDayjs(v, format).toDate()),
        trigger: trigger === 'current' ? 'today' : (`year-${triggerMap[trigger]}` as DatePickerYearChangeTrigger),
      });
    }

    if (month.some((m) => !nextMonth.includes(m))) {
      props.onMonthChange?.({
        partial,
        month: nextMonth[partialIndex],
        date: value.map((v) => parseToDayjs(v, format).toDate()),
        trigger: trigger === 'current' ? 'today' : (`month-${triggerMap[trigger]}` as DatePickerMonthChangeTrigger),
      });
    }

    setYear(nextYear);
    setMonth(nextMonth);
  }

  // time-picker 点击
  function onTimePickerChange(val: string) {
    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(val);

    const nextInputValue = [...cacheValue];
    const changedInputValue = cacheValue[activeIndex];
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
    setCacheValue(formatDate(nextInputValue, { format }));

    props.onTimeChange?.({
      time: val,
      partial: activeIndex ? 'end' : 'start',
      date: value.map((v) => dayjs(v).toDate()),
      trigger: 'time-hour' as DatePickerTimeChangeTrigger,
    });
  }

  // 确定
  function onConfirmClick({ e }) {
    const nextValue = [...cacheValue];

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (nextValue.length === 2 && isFirstValueSelected) {
      onChange(formatDate(nextValue, { format, autoSwap: true }), {
        dayjsValue: nextValue.map((v) => parseToDayjs(v, format)),
        trigger: 'confirm',
      });
      setYear(nextValue.map((v) => dayjs(v, format).year()));
      setMonth(nextValue.map((v) => dayjs(v, format).month()));
      setIsFirstValueSelected(false);
    } else {
      setIsFirstValueSelected(true);
    }

    props.onConfirm?.({ date: value.map((v) => dayjs(v).toDate()), e });
  }

  // 预设
  function onPresetClick(presetValue: any, { e, preset }) {
    const presetVal = typeof presetValue === 'function' ? presetValue() : presetValue;

    if (!Array.isArray(presetVal)) {
      log.error('DateRangePickerPanel', `preset: ${presetValue} 预设值必须是数组!`);
    } else {
      onChange(formatDate(presetVal, { format, autoSwap: true }), {
        dayjsValue: presetVal.map((p) => parseToDayjs(p, format)),
        trigger: 'preset',
      });
    }

    props.onPresetClick?.({ e, preset });
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

    props.onYearChange({
      partial,
      year: nextYear[partialIndex],
      date: value.map((v) => dayjs(v).toDate()),
      trigger: 'year-select',
    });
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

    props.onMonthChange({
      partial,
      month: nextMonth[partialIndex],
      date: value.map((v) => dayjs(v).toDate()),
      trigger: 'month-select',
    });
  }

  const panelProps = {
    hoverValue: isHoverCell ? hoverValue : [],
    value: isSelected ? cacheValue : value,
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
    panelPreselection,
    onCellMouseEnter,
    onCellMouseLeave,
    onCellClick,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
    onPanelClick,
  };

  return <RangePanel ref={ref} className={className} style={style} {...panelProps} />;
});

DateRangePickerPanel.displayName = 'DateRangePickerPanel';
DateRangePickerPanel.defaultProps = {
  mode: 'date',
  defaultValue: [],
  panelPreselection: true,
};

export default DateRangePickerPanel;
