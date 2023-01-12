import React from 'react';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import { TimePickerPanel } from '../../time-picker';
import type { SinglePanelProps } from './SinglePanel';
import type { RangePanelProps } from './RangePanel';
import useConfig from '../../hooks/useConfig';
import { getDefaultFormat } from '../../_common/js/date-picker/format';

export interface PanelContentProps {
  partial?: 'start' | 'end';
  value: SinglePanelProps['value'] | RangePanelProps['value'];
  year: SinglePanelProps['year'];
  month: SinglePanelProps['month'];
  mode: SinglePanelProps['mode'];
  format: SinglePanelProps['format'];
  enableTimePicker: SinglePanelProps['enableTimePicker'];
  timePickerProps: SinglePanelProps['timePickerProps'];
  firstDayOfWeek: SinglePanelProps['firstDayOfWeek'];
  time: SinglePanelProps['time'];

  popupVisible?: boolean;
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
    value,
    year,
    month,
    mode,
    format,
    enableTimePicker,
    timePickerProps,
    firstDayOfWeek,

    partial = 'start',
    time,
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

  const showTimePicker = enableTimePicker && mode === 'date';

  const defaultTime = '00:00:00';

  return (
    <div className={`${panelName}-content`}>
      <div className={`${panelName}-${mode}`}>
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
          value={value}
          time={time}
          format={format}
          firstDayOfWeek={firstDayOfWeek}
          onCellClick={(date: Date, { e }) => onCellClick?.(date, { e, partial })}
          onCellMouseEnter={(date: Date) => onCellMouseEnter?.(date, { partial })}
          onCellMouseLeave={onCellMouseLeave}
        />
      </div>

      {showTimePicker && (
        <div className={`${panelName}-time`}>
          <div className={`${panelName}-time-viewer`}>{time || defaultTime}</div>
          <TimePickerPanel
            key={partial}
            format={timeFormat}
            value={time || defaultTime}
            onChange={onTimePickerChange}
            isShowPanel={props.popupVisible}
            {...timePickerProps}
          />
        </div>
      )}
    </div>
  );
}
