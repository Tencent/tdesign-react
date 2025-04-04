import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import { formatDate, getDefaultFormat, parseToDayjs } from '@tdesign/common-js/date-picker/format';
import { subtractMonth, addMonth, extractTimeObj } from '@tdesign/common-js/date-picker/utils';
import { StyledProps } from '../common';
import {
  TdDatePickerPanelProps,
  DateValue,
  DatePickerYearChangeTrigger,
  DatePickerMonthChangeTrigger,
  PresetDate,
} from './type';
import SinglePanel from './panel/SinglePanel';
import useSingleValue from './hooks/useSingleValue';
import useDefaultProps from '../hooks/useDefaultProps';

export interface DatePickerPanelProps extends TdDatePickerPanelProps, StyledProps {}

const DatePickerPanel = forwardRef<HTMLDivElement, DatePickerPanelProps>((originalProps, ref) => {
  const props = useDefaultProps<DatePickerPanelProps>(originalProps, {
    mode: 'date',
    defaultValue: '',
    needConfirm: true,
  });
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
    presetsPlacement,
    needConfirm,
    onPanelClick,
    disableTime,
  } = props;

  const { format } = getDefaultFormat({
    mode,
    format: props.format,
    enableTimePicker,
  });

  // 日期点击
  function onCellClick(date: Date, { e }) {
    props.onCellClick?.({ date, e });

    // date 模式自动切换年月
    if (mode === 'date') {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }

    if (enableTimePicker) {
      setCacheValue(formatDate(date, { format }));
    } else {
      onChange(formatDate(date, { format }), { dayjsValue: parseToDayjs(date, format), trigger: 'pick' });
    }
  }

  // 头部快速切换
  function onJumperClick({ trigger }) {
    const triggerMap = { prev: 'arrow-previous', next: 'arrow-next' };
    const monthCountMap = { date: 1, week: 1, month: 12, quarter: 12, year: 120 };
    const monthCount = monthCountMap[mode] || 0;

    const current = new Date(year, month);

    let next = null;
    if (trigger === 'prev') {
      next = subtractMonth(current, monthCount);
    } else if (trigger === 'current') {
      next = new Date();
    } else if (trigger === 'next') {
      next = addMonth(current, monthCount);
    }

    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth();

    if (year !== nextYear) {
      props.onYearChange?.({
        year: nextYear,
        date: parseToDayjs(value as DateValue, format).toDate(),
        trigger: trigger === 'current' ? 'today' : (`year-${triggerMap[trigger]}` as DatePickerYearChangeTrigger),
      });
    }

    if (month !== nextMonth) {
      props.onMonthChange?.({
        month: nextMonth,
        date: parseToDayjs(value as DateValue, format).toDate(),
        trigger: trigger === 'current' ? 'today' : (`month-${triggerMap[trigger]}` as DatePickerMonthChangeTrigger),
      });
    }

    setYear(nextYear);
    setMonth(nextMonth);
  }

  // timePicker 点击
  function onTimePickerChange(val: string) {
    setTime(val);

    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(val);
    // am pm 12小时制转化 24小时制
    let nextHours = hours;
    if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
    if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
    const currentDate = !dayjs(cacheValue, format).isValid() ? dayjs() : dayjs(cacheValue, format);
    const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
    setCacheValue(formatDate(nextDate, { format }));

    props.onTimeChange?.({
      time: val,
      date: parseToDayjs(value as DateValue, format).toDate(),
      trigger: 'time-hour',
    });
  }

  // 确定
  function onConfirmClick({ e }) {
    onChange(formatDate(cacheValue, { format }), {
      dayjsValue: parseToDayjs(cacheValue, format),
      trigger: 'confirm',
    });

    props.onConfirm?.({ date: dayjs(value as DateValue).toDate(), e });
  }

  // 预设
  function onPresetClick(
    presetValue: DateValue | (() => DateValue),
    context: { preset: PresetDate; e: React.MouseEvent<HTMLDivElement> },
  ) {
    const presetVal = typeof presetValue === 'function' ? presetValue() : presetValue;
    onChange(formatDate(presetVal, { format }), {
      dayjsValue: parseToDayjs(presetVal, format),
      trigger: 'preset',
    });

    props.onPresetClick?.(context);
  }

  function onYearChange(year: number) {
    setYear(year);

    props.onYearChange?.({
      year,
      date: parseToDayjs(value as DateValue, format).toDate(),
      trigger: 'year-select',
    });
  }

  function onMonthChange(month: number) {
    setMonth(month);

    props.onMonthChange?.({
      month,
      date: parseToDayjs(value as DateValue, format).toDate(),
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
    presetsPlacement,
    needConfirm,
    onCellClick,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
    onPanelClick,
    disableTime,
  };

  return <SinglePanel ref={ref} className={className} style={style} {...panelProps} />;
});

DatePickerPanel.displayName = 'DatePickerPanel';

export default DatePickerPanel;
