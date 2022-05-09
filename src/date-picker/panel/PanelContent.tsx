import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import TimePickerPanel from '../../time-picker/panel/TimePickerPanel';
import type { DatePickerPanelProps } from './DatePickerPanel';
import type { DateRangePickerPanelProps } from './DateRangePickerPanel';
import useConfig from '../../_util/useConfig';
import { getDefaultFormat } from '../hooks/useFormat';

export interface PanelContentProps {
  partial?: 'start' | 'end';
  year: DatePickerPanelProps['year'];
  month: DatePickerPanelProps['month'];
  mode: DatePickerPanelProps['mode'];
  format: DatePickerPanelProps['format'];
  enableTimePicker: DatePickerPanelProps['enableTimePicker'];
  timePickerProps: DatePickerPanelProps['timePickerProps'];
  firstDayOfWeek: DatePickerPanelProps['firstDayOfWeek'];
  timeValue: DatePickerPanelProps['timeValue'];

  tableData: any[];
  onMonthChange: DatePickerPanelProps['onMonthChange'] | DateRangePickerPanelProps['onMonthChange'];
  onYearChange: DatePickerPanelProps['onYearChange'] | DateRangePickerPanelProps['onYearChange'];
  onJumperClick: DatePickerPanelProps['onJumperClick'] | DateRangePickerPanelProps['onJumperClick'];
  onCellClick: DatePickerPanelProps['onCellClick'] | DateRangePickerPanelProps['onCellClick'];
  onCellMouseEnter: DatePickerPanelProps['onCellMouseEnter'] | DateRangePickerPanelProps['onCellMouseEnter'];
  onCellMouseLeave: DatePickerPanelProps['onCellMouseLeave'] | DateRangePickerPanelProps['onCellMouseLeave'];
  onTimePickerChange: DatePickerPanelProps['onTimePickerChange'] | DateRangePickerPanelProps['onTimePickerChange'];
}

export default function PanelContent(props: PanelContentProps) {
  const { classPrefix } = useConfig();
  const panelName = `${classPrefix}-date-picker__panel`;

  const {
    year,
    month,
    mode,
    format,
    enableTimePicker,
    timePickerProps,
    firstDayOfWeek,

    partial = 'start',
    timeValue,
    tableData,
    onMonthChange,
    onYearChange,
    onJumperClick,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    onTimePickerChange,
  } = props;

  const { timeFormat } = getDefaultFormat({ mode, format, enableTimePicker });

  // eslint-disable-next-line
  const defaultTimeValue = useMemo(() => dayjs().format(timeFormat), [timeValue]);

  return (
    <div className={`${panelName}--content`}>
      <div className={`${panelName}--${mode}`}>
        <DateHeader
          mode={mode}
          year={year}
          month={month}
          onMonthChange={(val: number) => onMonthChange?.(val, { partial })}
          onYearChange={(val: number) => onYearChange?.(val, { partial })}
          onJumperClick={(val: number) => onJumperClick?.(val, { partial })}
        />

        <DateTable
          mode={mode}
          data={tableData}
          timeValue={timeValue}
          firstDayOfWeek={firstDayOfWeek}
          onCellClick={(date: Date, { e }) => onCellClick?.(date, { e, partial })}
          onCellMouseEnter={(date: Date) => onCellMouseEnter?.(date, { partial })}
          onCellMouseLeave={onCellMouseLeave}
        />
      </div>

      {enableTimePicker && (
        <div className={`${panelName}--time`}>
          <div className={`${panelName}--time-viewer`}>{timeValue || defaultTimeValue}</div>
          <TimePickerPanel format={timeFormat} value={timeValue} onChange={onTimePickerChange} {...timePickerProps} />
        </div>
      )}
    </div>
  );
}
