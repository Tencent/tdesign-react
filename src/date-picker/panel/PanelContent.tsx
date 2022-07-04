import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import TimePickerPanel from '../../time-picker/panel/TimePickerPanel';
import type { SinglePanelProps } from './SinglePanel';
import type { RangePanelProps } from './RangePanel';
import useConfig from '../../_util/useConfig';
import { getDefaultFormat } from '../hooks/useFormat';

export interface PanelContentProps {
  partial?: 'start' | 'end';
  year: SinglePanelProps['year'];
  month: SinglePanelProps['month'];
  mode: SinglePanelProps['mode'];
  format: SinglePanelProps['format'];
  enableTimePicker: SinglePanelProps['enableTimePicker'];
  timePickerProps: SinglePanelProps['timePickerProps'];
  firstDayOfWeek: SinglePanelProps['firstDayOfWeek'];
  time: SinglePanelProps['time'];

  tableData: any[];
  onMonthChange: SinglePanelProps['onMonthChange'] | RangePanelProps['onMonthChange'];
  onYearChange: SinglePanelProps['onYearChange'] | RangePanelProps['onYearChange'];
  onJumperClick: SinglePanelProps['onJumperClick'] | RangePanelProps['onJumperClick'];
  onCellClick: SinglePanelProps['onCellClick'] | RangePanelProps['onCellClick'];
  onCellMouseEnter: SinglePanelProps['onCellMouseEnter'] | RangePanelProps['onCellMouseEnter'];
  onCellMouseLeave: SinglePanelProps['onCellMouseLeave'] | RangePanelProps['onCellMouseLeave'];
  onTimePickerChange: SinglePanelProps['onTimePickerChange'] | RangePanelProps['onTimePickerChange'];
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
    time = dayjs().format('HH:mm:ss'),
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
  const defaultTime = useMemo(() => dayjs().format(timeFormat), [time]);

  return (
    <div className={`${panelName}--content`}>
      <div className={`${panelName}--${mode}`}>
        <DateHeader
          mode={mode}
          year={year}
          month={month}
          onMonthChange={(val: number) => onMonthChange?.(val, { partial })}
          onYearChange={(val: number) => onYearChange?.(val, { partial })}
          onJumperClick={({ trigger }) => onJumperClick?.({ trigger, partial })}
        />

        <DateTable
          mode={mode}
          data={tableData}
          time={time}
          firstDayOfWeek={firstDayOfWeek}
          onCellClick={(date: Date, { e }) => onCellClick?.(date, { e, partial })}
          onCellMouseEnter={(date: Date) => onCellMouseEnter?.(date, { partial })}
          onCellMouseLeave={onCellMouseLeave}
        />
      </div>

      {enableTimePicker && (
        <div className={`${panelName}--time`}>
          <div className={`${panelName}--time-viewer`}>{time || defaultTime}</div>
          <TimePickerPanel format={timeFormat} value={time} onChange={onTimePickerChange} {...timePickerProps} />
        </div>
      )}
    </div>
  );
}
