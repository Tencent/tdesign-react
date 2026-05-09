import React, { forwardRef } from 'react';

import { getDefaultFormat, parseToDayjs } from '@tdesign/common-js/date-picker/format';
import classNames from 'classnames';
import { isFunction } from 'lodash-es';

import ExtraContent from './ExtraContent';
import PanelContent from './PanelContent';
import useConfig from '../../hooks/useConfig';
import useDefaultProps from '../../hooks/useDefaultProps';
import useDisableDate from '../hooks/useDisableDate';
import useTableData from '../hooks/useTableData';
import { parseToDateTime } from '../utils';

import type { StyledProps } from '../../common';
import type { TdTimePickerProps } from '../../time-picker';
import type { DateValue, TdDatePickerProps, TdDateRangePickerProps } from '../type';

export interface SinglePanelProps
  extends Omit<TdDatePickerProps, 'enableTimePicker' | 'onYearChange' | 'onMonthChange'>,
    StyledProps {
  year?: number;
  month?: number;
  time?: string;
  popupVisible?: boolean;
  enableTimePicker?: TdDateRangePickerProps['enableTimePicker'] | TdDatePickerProps['enableTimePicker'];
  onPanelClick?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onCellClick?: (date: Date, context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onCellMouseEnter?: (date: Date) => void;
  onCellMouseLeave?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onJumperClick?: (context: { e?: MouseEvent; trigger: string }) => void;
  onConfirmClick?: (context: { e: React.MouseEvent<HTMLButtonElement> }) => void;
  onPresetClick?: any;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onTimePickerChange?: TdTimePickerProps['onChange'];
}

const SinglePanel = forwardRef<HTMLDivElement, SinglePanelProps>((originalProps, ref) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const panelName = `${classPrefix}-date-picker__panel`;
  const props = useDefaultProps<SinglePanelProps>(originalProps, {
    mode: 'date',
    enableTimePicker: false,
    presetsPlacement: 'bottom',
  });
  const {
    value,
    mode,
    presetsPlacement,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    needConfirm,
    style,
    className,
    year,
    month,
    range,
    cell,
    onPanelClick,
    disableTime,
  } = props;

  const { format } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    enableTimePicker: props.enableTimePicker,
  });

  const disableDateOptions = useDisableDate({ disableDate: props.disableDate, mode: props.mode, format });

  const disableTimeOptions: TdTimePickerProps['disableTime'] = (h: number, m: number, s: number, ms: number) => {
    if (!isFunction(disableTime) || !value) {
      return {};
    }

    return disableTime(parseToDateTime(value as DateValue, format, [h, m, s, ms]));
  };

  const tableData = useTableData({
    value,
    year,
    month,
    range,
    mode,
    start: value ? parseToDayjs(props.multiple ? value[0] : value, format).toDate() : undefined,
    firstDayOfWeek,
    multiple: props.multiple,
    ...disableDateOptions,
  });

  const panelContentProps = {
    mode,
    value,
    year,
    month,
    range,
    format,
    cell,
    firstDayOfWeek,
    tableData,
    popupVisible: props.popupVisible,
    multiple: props.multiple,
    time: props.time,
    timePickerProps: {
      disableTime: disableTimeOptions,
      ...props.timePickerProps,
    },
    enableTimePicker: props.enableTimePicker,
    onMonthChange: props.onMonthChange,
    onYearChange: props.onYearChange,
    onJumperClick: props.onJumperClick,
    onCellClick: props.onCellClick,
    onCellMouseEnter: props.onCellMouseEnter,
    onCellMouseLeave: props.onCellMouseLeave,
    onTimePickerChange: props.onTimePickerChange,
  };

  const extraProps = {
    presets: props.presets,
    enableTimePicker: props.enableTimePicker,
    presetsPlacement: props.presetsPlacement,
    onPresetClick: props.onPresetClick,
    onConfirmClick: props.onConfirmClick,
    selectedValue: props.value,
    needConfirm,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(panelName, className, {
        [`${panelName}--direction-row`]: ['left', 'right'].includes(presetsPlacement),
      })}
      onClick={(e) => onPanelClick?.({ e })}
    >
      {['top', 'left'].includes(presetsPlacement) ? <ExtraContent {...extraProps} /> : null}
      <PanelContent {...panelContentProps} />
      {['bottom', 'right'].includes(presetsPlacement) ? <ExtraContent {...extraProps} /> : null}
    </div>
  );
});

SinglePanel.displayName = 'SinglePanel';

export default SinglePanel;
