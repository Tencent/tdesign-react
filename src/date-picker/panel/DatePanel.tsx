import React, { useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import isObject from 'lodash/isObject';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import DateFooter from '../base/Footer';
import { getWeeks, getYears, getMonths, flagActive, isEnabledDate } from '../../_common/js/date-picker/utils-new';
import { TdDatePickerProps, DateValue } from '../type';
import TimePickerPanel from '../../time-picker/panel/TimePickerPanel';
import type { TdTimePickerProps } from '../../time-picker';

export interface DatePanelProps extends TdDatePickerProps {
  year?: number;
  month?: number;
  timeValue?: string;
  onClick?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onCellClick?: (date: Date) => void;
  onCellMouseEnter?: (date: Date) => void;
  onCellMouseLeave?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onJumperClick?: (flag: number) => void;
  onConfirmClick?: (context: { e: React.MouseEvent<HTMLButtonElement> }) => void;
  onPresetClick?: (
    preset: DateValue | (() => DateValue),
    context: { e: React.MouseEventHandler<HTMLButtonElement> },
  ) => void;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onTimePickerChange?: TdTimePickerProps['onChange'];
}

const DatePanel = (props: DatePanelProps) => {
  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('datePicker');
  const monthAriaLabel: string[] = t(local.months);

  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const {
    value,
    mode = 'month',
    format,
    presets,
    enableTimePicker,
    timePickerProps,
    presetsPlacement = 'bottom',
    disableDate: disableDateFromProps,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,

    year,
    month,
    timeValue,
    onClick,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
  } = props;

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

  // 列表数据
  const tableData = useMemo(() => {
    let data = [];

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

  const showPanelFooter = enableTimePicker || presets;
  const extraContent = showPanelFooter && (
    <DateFooter
      enableTimePicker={enableTimePicker}
      onConfirmClick={onConfirmClick}
      presets={presets}
      onPresetClick={onPresetClick}
    />
  );

  const panelContent = (
    <div className={`${classPrefix}-date-picker__panel--top`} onClick={(e) => onClick({ e })}>
      {presetsPlacement === 'left' && extraContent}

      <div className={`${classPrefix}-date-picker__panel--${mode}`}>
        <DateHeader
          mode={mode}
          year={year}
          month={month}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          onJumperClick={onJumperClick}
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
          <TimePickerPanel value={timeValue} onChange={onTimePickerChange} {...timePickerProps} />
        </div>
      )}

      {presetsPlacement === 'right' && extraContent}
    </div>
  );

  return (
    <div className={`${classPrefix}-date-picker__panel`}>
      {presetsPlacement === 'top' && extraContent}
      {panelContent}
      {presetsPlacement === 'bottom' && extraContent}
    </div>
  );
};

DatePanel.displayName = 'DatePanel';

export default DatePanel;
