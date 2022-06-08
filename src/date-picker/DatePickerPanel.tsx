import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import { StyledProps } from '../common';
import { TdDatePickerPanelProps, DateValue } from './type';
import SinglePanel from './panel/SinglePanel';
import useSingleValue from './hooks/useSingleValue';
import useFormat from './hooks/useFormat';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils-new';

export interface DatePickerPanelProps extends TdDatePickerPanelProps, StyledProps {}

const DatePickerPanel = forwardRef<HTMLDivElement, DatePickerPanelProps>((props, ref) => {
  const { value, onChange, time, setTime, month, setMonth, year, setYear, cacheValue, setCacheValue } =
    useSingleValue(props);

  const {
    className,
    style,
    mode,
    enableTimePicker,
    disableDate,
    firstDayOfWeek,
    presets,
    timePickerProps,
    onPanelClick,
  } = props;

  const { formatDate, format } = useFormat({
    value,
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  // 日期点击
  function onCellClick(date: Date, { e }) {
    props.onCellClick?.({ date, e });

    if (enableTimePicker) {
      setCacheValue(formatDate(date));
    } else {
      onChange(formatDate(date, { formatType: 'valueType' }), { dayjsValue: dayjs(date), trigger: 'pick' });
    }
  }

  // 头部快速切换
  function onJumperClick(flag: number) {
    const monthCountMap = { date: 1, month: 12, year: 120 };
    const monthCount = monthCountMap[mode] || 0;

    const current = new Date(year, month);

    let next = null;
    if (flag === -1) {
      next = subtractMonth(current, monthCount);
    } else if (flag === 0) {
      next = new Date();
    } else if (flag === 1) {
      next = addMonth(current, monthCount);
    }

    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth();

    setYear(nextYear);
    setMonth(nextMonth);
  }

  // timepicker 点击
  function onTimePickerChange(val: string) {
    setTime(val);

    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(val);
    // am pm 12小时制转化 24小时制
    let nextHours = hours;
    if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
    if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
    const currentDate = !dayjs(cacheValue, format).isValid() ? dayjs() : dayjs(cacheValue, format);
    const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
    setCacheValue(formatDate(nextDate));

    props.onTimeChange?.({
      time: val,
      date: dayjs(value).toDate(),
      trigger: 'time-hour',
    });
  }

  // 确定
  function onConfirmClick() {
    onChange(formatDate(cacheValue, { formatType: 'valueType' }), {
      dayjsValue: dayjs(cacheValue),
      trigger: 'confirm',
    });
  }

  // 预设
  function onPresetClick(presetValue: DateValue | (() => DateValue), { e, preset }) {
    const presetVal = typeof presetValue === 'function' ? presetValue() : presetValue;
    onChange(formatDate(presetVal, { formatType: 'valueType' }), { dayjsValue: dayjs(presetVal), trigger: 'preset' });

    props.onPresetClick?.({ e, preset });
  }

  function onYearChange(year: number) {
    setYear(year);

    props.onYearChange?.({
      year,
      date: dayjs(value).toDate(),
      trigger: 'year-select',
    });
  }

  function onMonthChange(month: number) {
    setMonth(month);

    props.onMonthChange?.({
      month,
      date: dayjs(value).toDate(),
      trigger: 'month-select',
    });
  }

  const panelProps = {
    value: cacheValue,
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
    onCellClick,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
    onPanelClick,
  };

  return <SinglePanel ref={ref} className={className} style={style} {...panelProps} />;
});

DatePickerPanel.displayName = 'DatePickerPanel';
DatePickerPanel.defaultProps = {
  mode: 'date',
  defaultValue: '',
};

export default DatePickerPanel;
