import React, { useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import isObject from 'lodash/isObject';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import DateFooter from '../base/Footer';
import { getWeeks, getYears, getMonths, flagActive, isEnabledDate } from '../../_common/js/date-picker/utils-new';
import { TdDatePickerProps } from '../type';
import TimePickerPanel from '../../time-picker/panel/TimePickerPanel';
import type { TdTimePickerProps } from '../../time-picker';

export interface DatePanelProps extends TdDatePickerProps {
  year?: number;
  month?: number;
  timeValue?: string;
  onCellClick?: Function;
  onCellMouseEnter?: Function;
  onCellMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onJumperClick?: Function;
  onConfirmClick?: Function;
  onPresetClick?: Function;
  onYearChange?: Function;
  onMonthChange?: Function;
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
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    disableDate: disableDateFromProps,
    format,
    presets,
    enableTimePicker,
    timePickerProps,

    year,
    month,
    timeValue,
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

  return (
    <div className={`${classPrefix}-date-picker__panel`}>
      <div className={`${classPrefix}-date-picker__panel--top`}>
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
