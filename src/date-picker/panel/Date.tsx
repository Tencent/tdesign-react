import React, { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import isObject from 'lodash/isObject';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import DateFooter from '../base/Footer';
import {
  getWeeks,
  getYears,
  getMonths,
  flagActive,
  subtractMonth,
  addMonth,
  isEnabledDate,
} from '../../_common/js/date-picker/utils-new';
import { TdDatePickerProps } from '../type';
import TimePickerPanel from '../../time-picker/panel/TimePickerPanel';

export interface DatePanelProps extends TdDatePickerProps {
  formatDate: Function;
  inputValue: string;
  timeValue: string;
  setInputValue: Function;
  setPopupVisible: Function;
  setTimeValue: Function;
  setIsHoverCell: Function;
}

const DatePanel = (props: DatePanelProps) => {
  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('datePicker');
  const monthAriaLabel: string[] = t(local.months);

  const { classPrefix } = useConfig();
  const {
    value,
    mode,
    firstDayOfWeek,
    disableDate: disableDateFromProps,
    onChange,
    format,
    presets,
    enableTimePicker,
    setPopupVisible,
    inputValue,
    setInputValue,
    formatDate,
    timePickerProps,
    timeValue,
    setTimeValue,
    setIsHoverCell,
  } = props;

  const [year, setYear] = useState(dayjs(value).year());
  const [month, setMonth] = useState(dayjs(value).month());

  const disableDate = useCallback(
    (date: Date) => !isEnabledDate({ value: date, disableDate: disableDateFromProps, mode, format }),
    [disableDateFromProps, mode, format],
  );
  const minDate = useMemo(
    () =>
      isObject(disableDateFromProps) && 'before' in disableDateFromProps ? new Date(disableDateFromProps.before) : null,
    [disableDateFromProps],
  );
  const maxDate = useMemo(
    () =>
      isObject(disableDateFromProps) && 'after' in disableDateFromProps ? new Date(disableDateFromProps.after) : null,
    [disableDateFromProps],
  );

  // 头部快速切换
  function onClickJumper(flag: number) {
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

    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  // 列表数据
  const tableData = useMemo(() => {
    let data: any[];

    const options = {
      minDate,
      maxDate,
      disableDate,
      firstDayOfWeek,
      monthLocal: monthAriaLabel,
    };

    if (mode === 'date') {
      data = getWeeks({ year, month }, options);
    } else if (mode === 'month') {
      data = getMonths(year, options);
    } else if (mode === 'year') {
      data = getYears(year, options);
    }

    const start = dayjs(value).toDate();
    return flagActive(data, { start, type: mode });
  }, [year, month, mode, value, minDate, maxDate, disableDate, firstDayOfWeek, monthAriaLabel]);

  // 日期点击
  function onCellClick(date: Date) {
    onChange(formatDate(date, 'valueType'), dayjs(date));
    setYear(date.getFullYear());
    setMonth(date.getMonth());

    !enableTimePicker && setPopupVisible(false);
  }

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    setIsHoverCell(true);
    setInputValue(formatDate(date));
  }

  // 日期 leave
  function onCellMouseLeave() {
    setIsHoverCell(false);
    setInputValue(formatDate(value));
  }

  // 确定
  function onConfirmClick() {
    setPopupVisible(false);

    const isValidDate = dayjs(inputValue, format, true).isValid();
    if (isValidDate) {
      onChange(formatDate(inputValue, 'valueType'), dayjs(inputValue));
    } else {
      setInputValue(formatDate(value));
    }
  }

  // 预设
  function onPresetClick(preset: any) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    setPopupVisible(false);
    onChange(formatDate(presetValue, 'valueType'), dayjs(presetValue));
  }

  // timepicker 点击
  function handleTimePick(value: string) {
    const [hour, minute, second] = value.split(':');
    const currentDate = dayjs(inputValue).toDate();
    currentDate.setHours(Number(hour));
    currentDate.setMinutes(Number(minute));
    currentDate.setSeconds(Number(second));
    setTimeValue(value);
    setInputValue(dayjs(currentDate).format(format));
  }

  const showPanelFooter = enableTimePicker || presets;

  return (
    <div className={`${classPrefix}-date-picker__panel`}>
      <div className={`${classPrefix}-date-picker__panel--top`}>
        <div className={`${classPrefix}-date-picker__panel--date`}>
          <DateHeader
            mode={mode}
            year={year}
            month={month}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onClickJumper={onClickJumper}
          />

          <DateTable
            mode={mode}
            data={tableData}
            firstDayOfWeek={firstDayOfWeek}
            onCellClick={onCellClick}
            onCellMouseEnter={onCellMouseEnter}
            onCellMouseLeave={onCellMouseLeave}
          />
        </div>

        {enableTimePicker && (
          <div className={`${classPrefix}-date-picker__panel--time`}>
            <TimePickerPanel value={timeValue} onChange={handleTimePick} {...timePickerProps} />
          </div>
        )}
      </div>

      {showPanelFooter && (
        <DateFooter
          enableTimePicker={enableTimePicker}
          onConfirmClick={onConfirmClick}
          presets={presets}
          onPresetClick={onPresetClick}
        />
      )}
    </div>
  );
};

DatePanel.displayName = 'DatePanel';

export default DatePanel;
