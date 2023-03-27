import React, { forwardRef, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdDatePickerProps } from './type';
import SelectInput from '../select-input';
import SinglePanel from './panel/SinglePanel';
import useSingle from './hooks/useSingle';
import { parseToDayjs, getDefaultFormat, formatTime, formatDate } from '../_common/js/date-picker/format';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils';
import { datePickerDefaultProps } from './defaultProps';

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const { classPrefix } = useConfig();

  const {
    className,
    style,
    disabled,
    mode,
    enableTimePicker,
    disableDate,
    firstDayOfWeek,
    presets,
    defaultTime,
    timePickerProps,
    presetsPlacement,
    onPick,
  } = props;

  const {
    inputValue,
    popupVisible,
    inputProps,
    popupProps,
    value,
    year,
    month,
    time,
    inputRef,
    onChange,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setTime,
    setYear,
    setMonth,
    cacheValue,
    setCacheValue,
  } = useSingle(props);

  const { format, timeFormat, valueType } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  useEffect(() => {
    // 面板展开重置数据
    setCacheValue(formatDate(value, { format }));
    setInputValue(formatDate(value, { format }));

    if (popupVisible) {
      setYear(parseToDayjs(value, format).year());
      setMonth(parseToDayjs(value, format).month());
      setTime(formatTime(value, timeFormat, defaultTime));
    } else {
      setIsHoverCell(false);
    }
    // eslint-disable-next-line
  }, [popupVisible]);

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    setIsHoverCell(true);
    setInputValue(formatDate(date, { format }));
  }

  // 日期 leave
  function onCellMouseLeave() {
    setIsHoverCell(false);
    setInputValue(formatDate(cacheValue, { format }));
  }

  // 日期点击
  function onCellClick(date: Date) {
    onPick?.(date);
    setIsHoverCell(false);
    // date 模式自动切换年月
    if (mode === 'date') {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }
    if (enableTimePicker) {
      setCacheValue(formatDate(date, { format }));
    } else {
      onChange(formatDate(date, { format, targetFormat: valueType }), {
        dayjsValue: parseToDayjs(date, format),
        trigger: 'pick',
      });
      setPopupVisible(false);
    }
  }

  // 头部快速切换
  function onJumperClick({ trigger }) {
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
    const currentDate = !dayjs(inputValue, format).isValid() ? dayjs() : dayjs(inputValue, format);
    const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
    setInputValue(formatDate(nextDate, { format }));
    setCacheValue(formatDate(nextDate, { format }));

    onPick?.(nextDate);
  }

  // 确定
  function onConfirmClick() {
    const nextValue = formatDate(inputValue, { format });
    if (nextValue) {
      onChange(formatDate(inputValue, { format, targetFormat: valueType }), {
        dayjsValue: parseToDayjs(inputValue, format),
        trigger: 'confirm',
      });
    } else {
      setInputValue(formatDate(value, { format }));
    }
    setPopupVisible(false);
  }

  // 预设
  function onPresetClick(preset: any) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    onChange(formatDate(presetValue, { format, targetFormat: valueType }), {
      dayjsValue: parseToDayjs(presetValue, format),
      trigger: 'preset',
    });
    setPopupVisible(false);
  }

  function onYearChange(year: number) {
    setYear(year);
  }

  function onMonthChange(month: number) {
    setMonth(month);
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
    onPanelClick: () => inputRef.current?.focus?.(),
  };

  return (
    <div className={classNames(`${classPrefix}-date-picker`, className)} style={style} ref={ref}>
      <SelectInput
        disabled={disabled}
        value={inputValue}
        status={props.status}
        tips={props.tips}
        popupProps={popupProps}
        inputProps={inputProps}
        popupVisible={popupVisible}
        panel={<SinglePanel {...panelProps} />}
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
DatePicker.defaultProps = datePickerDefaultProps;

export default DatePicker;
