import React, { forwardRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import useConfig from '../../hooks/useConfig';
import { StyledProps } from '../../common';
import PanelContent from './PanelContent';
import ExtraContent from './ExtraContent';
import type { DateValue, TdDatePickerProps } from '../type';
import type { TdTimePickerProps } from '../../time-picker';
import { getDefaultFormat, parseToDayjs } from '../../_common/js/date-picker/format';
import useTableData from '../hooks/useTableData';
import useDisableDate from '../hooks/useDisableDate';
import useDefaultProps from '../../hooks/useDefaultProps';
import { parseToDateTime } from '../utils';

export interface SinglePanelProps extends TdDatePickerProps, StyledProps {
  year?: number;
  month?: number;
  time?: string;
  popupVisible?: boolean;
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
    format,
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
