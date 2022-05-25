import React, { forwardRef, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdDatePickerProps } from './type';
import SelectInput from '../select-input';
import DatePickerPanel from './panel/DatePickerPanel';
import useSingle from './hooks/useSingle';
import useFormat from './hooks/useFormat';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils-new';
import { datePickerDefaultProps } from './defaultProps';

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
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
    inputProps,
    popupProps,
    value,
    year,
    month,
    timeValue,
    inputRef,
    onChange,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setTimeValue,
    setYear,
    setMonth,
    cacheValue,
    setCacheValue,
  } = useSingle(props);

  const { formatTime, formatDate, format } = useFormat({
    mode,
    value,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  useEffect(() => {
    if (!enableTimePicker) return;

    // 面板展开重置数据
    if (popupVisible) {
      setCacheValue(formatDate(value || new Date()));
      setTimeValue(formatTime(value || new Date()));
    }
    // eslint-disable-next-line
  }, [value, popupVisible, enableTimePicker]);

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    setIsHoverCell(true);
    setInputValue(formatDate(date));
  }

  // 日期 leave
  function onCellMouseLeave() {
    setIsHoverCell(false);
    setInputValue(formatDate(cacheValue));
  }

  // 日期点击
  function onCellClick(date: Date) {
    setIsHoverCell(false);
    // date 模式自动切换年月
    if (mode === 'date') {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }
    if (enableTimePicker) {
      setCacheValue(formatDate(date));
    } else {
      onChange(formatDate(date, 'valueType'), { dayjsValue: dayjs(date), trigger: 'pick' });
      setPopupVisible(false);
    }

    onPick?.(date);
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
    const nextInputValue = formatDate(
      dayjs(inputValue || new Date())
        .year(nextYear)
        .month(nextMonth)
        .toDate(),
    );

    setYear(nextYear);
    setMonth(nextMonth);
    setInputValue(nextInputValue);
  }

  // timepicker 点击
  function onTimePickerChange(val: string) {
    setTimeValue(val);

    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(val);

    // am pm 12小时制转化 24小时制
    let nextHours = hours;
    if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
    if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
    const currentDate = !dayjs(inputValue, format).isValid() ? dayjs() : dayjs(inputValue, format);
    const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
    setInputValue(formatDate(nextDate));

    onPick?.(nextDate);
  }

  // 确定
  function onConfirmClick() {
    const nextValue = formatDate(inputValue);
    if (nextValue) {
      onChange(formatDate(inputValue, 'valueType'), { dayjsValue: dayjs(inputValue), trigger: 'confirm' });
    } else {
      setInputValue(formatDate(value));
    }
    setPopupVisible(false);
  }

  // 预设
  function onPresetClick(preset: any) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    onChange(formatDate(presetValue, 'valueType'), { dayjsValue: dayjs(presetValue), trigger: 'preset' });
    setPopupVisible(false);
  }

  function onYearChange(year: number) {
    setYear(year);

    let nextDateObj = dayjs(inputValue || new Date(), format);
    if (nextDateObj) nextDateObj = dayjs(inputValue || new Date());
    const nextDate = nextDateObj.year(year).toDate();
    setInputValue(formatDate(nextDate));
    setCacheValue(formatDate(nextDate));
  }

  function onMonthChange(month: number) {
    setMonth(month);

    let nextDateObj = dayjs(inputValue || new Date(), format);
    if (nextDateObj) nextDateObj = dayjs(inputValue || new Date());
    const nextDate = nextDateObj.month(month).toDate();
    setInputValue(formatDate(nextDate));
    setCacheValue(formatDate(nextDate));
  }

  const panelProps = {
    value: cacheValue,
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
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
    onClick: () => inputRef.current?.focus?.(),
  };

  return (
    <div className={classNames(`${classPrefix}-date-picker`, className)} style={style} ref={ref}>
      <SelectInput
        disabled={disabled}
        value={inputValue}
        popupProps={popupProps}
        inputProps={inputProps}
        popupVisible={popupVisible}
        panel={<DatePickerPanel {...panelProps} />}
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
DatePicker.defaultProps = datePickerDefaultProps;

export default DatePicker;
