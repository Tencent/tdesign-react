import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import TimePickerPanel from '../../time-picker/panel/TimePickerPanel';
import type { DatePanelProps } from './DatePanel';
import type { DateRangePanelProps } from './DateRangePanel';
import useConfig from '../../_util/useConfig';
import { getDefaultFormat } from '../hooks/useFormat';

export interface PanelContentProps {
  partial?: 'start' | 'end';
  year: DatePanelProps['year'];
  month: DatePanelProps['month'];
  mode: DatePanelProps['mode'];
  format: DatePanelProps['format'];
  enableTimePicker: DatePanelProps['enableTimePicker'];
  timePickerProps: DatePanelProps['timePickerProps'];
  firstDayOfWeek: DatePanelProps['firstDayOfWeek'];
  timeValue: DatePanelProps['timeValue'];

  tableData: any[];
  onMonthChange: DatePanelProps['onMonthChange'] | DateRangePanelProps['onMonthChange'];
  onYearChange: DatePanelProps['onYearChange'] | DateRangePanelProps['onYearChange'];
  onJumperClick: DatePanelProps['onJumperClick'] | DateRangePanelProps['onJumperClick'];
  onCellClick: DatePanelProps['onCellClick'] | DateRangePanelProps['onCellClick'];
  onCellMouseEnter: DatePanelProps['onCellMouseEnter'] | DateRangePanelProps['onCellMouseEnter'];
  onCellMouseLeave: DatePanelProps['onCellMouseLeave'] | DateRangePanelProps['onCellMouseLeave'];
  onTimePickerChange: DatePanelProps['onTimePickerChange'] | DateRangePanelProps['onTimePickerChange'];
}

export default function PanelContent(props: PanelContentProps) {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const panelName = `${classPrefix}-date-picker__panel`;

  const {
    year,
    month,
    mode,
    format,
    enableTimePicker,
    timePickerProps,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,

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
