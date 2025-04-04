import React, { useCallback } from 'react';
import { getDefaultFormat } from '@tdesign/common-js/date-picker/format';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import { TimePickerPanel } from '../../time-picker';
import type { SinglePanelProps } from './SinglePanel';
import type { RangePanelProps } from './RangePanel';
import useConfig from '../../hooks/useConfig';
import useEventCallback from '../../hooks/useEventCallback';

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
  multiple?: SinglePanelProps['multiple'];
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
    onJumperClick,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    onTimePickerChange,
  } = props;

  const onMonthChange = useEventCallback(props.onMonthChange);
  const onYearChange = useEventCallback(props.onYearChange);

  const { timeFormat } = getDefaultFormat({ mode, format, enableTimePicker });

  const showTimePicker = enableTimePicker && mode === 'date';

  const defaultTime = '00:00:00';

  const onMonthChangeInner = useCallback(
    (val: number) => {
      onMonthChange?.(val, { partial });
    },
    [partial, onMonthChange],
  );

  const onYearChangeInner = useCallback(
    (val: number) => {
      onYearChange?.(val, { partial });
    },
    [partial, onYearChange],
  );

  const onJumperClickInner = useCallback(
    ({ trigger }) => {
      onJumperClick?.({ trigger, partial });
    },
    [partial, onJumperClick],
  );

  return (
    <div className={`${panelName}-content`}>
      <div className={`${panelName}-${mode}`}>
        <DateHeader
          mode={mode}
          year={year}
          month={month}
          onMonthChange={onMonthChangeInner}
          onYearChange={onYearChangeInner}
          onJumperClick={onJumperClickInner}
        />

        <DateTable
          mode={mode}
          data={tableData}
          value={value}
          time={time}
          format={format}
          firstDayOfWeek={firstDayOfWeek}
          multiple={props.multiple}
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
            position={partial}
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
