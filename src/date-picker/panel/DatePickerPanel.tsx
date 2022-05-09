import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import useConfig from '../../_util/useConfig';
import { StyledProps } from '../../common';
import PanelContent from './PanelContent';
import ExtraContent from './ExtraContent';
import { TdDatePickerProps, DateValue } from '../type';
import type { TdTimePickerProps } from '../../time-picker';
import useTableData from './useTableData';
import useDisableDate from '../hooks/useDisableDate';

export interface DatePickerPanelProps extends TdDatePickerProps, StyledProps {
  year?: number;
  month?: number;
  timeValue?: string;
  onClick?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onCellClick?: (date: Date, context: { e: React.MouseEvent<HTMLDivElement> }) => void;
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

const DatePickerPanel = (props: DatePickerPanelProps) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const panelName = `${classPrefix}-date-picker__panel`;
  const {
    value,
    mode,
    format = 'YYYY-MM-DD',
    presetsPlacement,
    disableDate: disableDateFromProps,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,

    style,
    className,
    year,
    month,
    onClick,
  } = props;

  const disableDateOptions = useDisableDate({ disableDate: disableDateFromProps, mode, format });

  const tableData = useTableData({
    year,
    month,
    mode,
    start: value ? dayjs(value, format).toDate() : undefined,
    firstDayOfWeek,
    ...disableDateOptions,
  });

  const panelContentProps = {
    mode,
    year,
    month,
    format,
    firstDayOfWeek,
    tableData,

    enableTimePicker: props.enableTimePicker,
    timePickerProps: props.timePickerProps,
    timeValue: props.timeValue,
    onMonthChange: props.onMonthChange,
    onYearChange: props.onYearChange,
    onJumperClick: props.onJumperClick,
    onCellClick: props.onCellClick,
    onCellMouseEnter: props.onCellMouseEnter,
    onCellMouseLeave: props.onCellMouseLeave,
    onTimePickerChange: props.onTimePickerChange,
  };

  return (
    <div
      style={style}
      className={classNames(panelName, className, {
        [`${panelName}--direction-row`]: ['left', 'right'].includes(presetsPlacement),
      })}
      onClick={(e) => onClick?.({ e })}
    >
      {['top', 'left'].includes(presetsPlacement) ? <ExtraContent {...props} selectedValue={value} /> : null}
      <PanelContent tableData={tableData} {...panelContentProps} />
      {['bottom', 'right'].includes(presetsPlacement) ? <ExtraContent {...props} selectedValue={value} /> : null}
    </div>
  );
};

DatePickerPanel.displayName = 'DatePickerPanel';

DatePickerPanel.defaultProps = {
  mode: 'date',
  enableTimePicker: false,
  presetsPlacement: 'bottom',
};

export default DatePickerPanel;
