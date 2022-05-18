import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import useConfig from '../../_util/useConfig';
import { StyledProps } from '../../common';
import PanelContent from './PanelContent';
import ExtraContent from './ExtraContent';
import { TdDateRangePickerProps, DateValue } from '../type';
import type { TdTimePickerProps } from '../../time-picker';
import useTableData from './useTableData';
import useDisableDate from '../hooks/useDisableDate';

export interface DateRangePickerPanelProps extends TdDateRangePickerProps, StyledProps {
  hoverValue?: string[];
  activeIndex?: number;
  isFirstValueSelected?: boolean;
  year?: number[];
  month?: number[];
  timeValue?: string[];
  onClick?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onCellClick?: (date: Date, context: { e: React.MouseEvent<HTMLDivElement>; partial: 'start' | 'end' }) => void;
  onCellMouseEnter?: (date: Date, context: { partial: 'start' | 'end' }) => void;
  onCellMouseLeave?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onJumperClick?: (flag: number, context: { partial: 'start' | 'end' }) => void;
  onConfirmClick?: (context: { e: React.MouseEvent<HTMLButtonElement> }) => void;
  onPresetClick?: (
    preset: DateValue | (() => DateValue),
    context: { e: React.MouseEventHandler<HTMLButtonElement> },
  ) => void;
  onYearChange?: (year: number, context: { partial: 'start' | 'end' }) => void;
  onMonthChange?: (month: number, context: { partial: 'start' | 'end' }) => void;
  onTimePickerChange?: TdTimePickerProps['onChange'];
}

const DateRangePickerPanel = (props: DateRangePickerPanelProps) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const panelName = `${classPrefix}-date-range-picker__panel`;
  const {
    value = [],
    hoverValue = [],
    mode,
    format,
    presets,
    enableTimePicker,
    presetsPlacement,
    disableDate: disableDateFromProps,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    isFirstValueSelected,

    style,
    className,
    activeIndex,
    year,
    month,
    timeValue = [],
    onClick,
    onConfirmClick,
    onPresetClick,
  } = props;

  const disableDateOptions = useDisableDate({
    disableDate: disableDateFromProps,
    mode,
    format,
    start: isFirstValueSelected && activeIndex === 1 ? dayjs(value[0]).toDate() : undefined,
    end: isFirstValueSelected && activeIndex === 0 ? dayjs(value[1]).toDate() : undefined,
  });

  const [startYear, endYear] = year;
  const [startMonth, endMonth] = month;

  const startTableData = useTableData({
    isRange: true,
    start: value[0] ? dayjs(value[0]).toDate() : undefined,
    end: value[1] ? dayjs(value[1]).toDate() : undefined,
    hoverStart: hoverValue[0] ? dayjs(hoverValue[0]).toDate() : undefined,
    hoverEnd: hoverValue[1] ? dayjs(hoverValue[1]).toDate() : undefined,
    year: startYear,
    month: startMonth,
    mode,
    firstDayOfWeek,
    ...disableDateOptions,
  });
  const endTableData = useTableData({
    isRange: true,
    start: value[0] ? dayjs(value[0]).toDate() : undefined,
    end: value[1] ? dayjs(value[1]).toDate() : undefined,
    hoverStart: hoverValue[0] ? dayjs(hoverValue[0]).toDate() : undefined,
    hoverEnd: hoverValue[1] ? dayjs(hoverValue[1]).toDate() : undefined,
    year: endYear,
    month: endMonth,
    mode,
    firstDayOfWeek,
    ...disableDateOptions,
  });

  const panelContentProps = {
    mode,
    format,
    firstDayOfWeek,

    enableTimePicker: props.enableTimePicker,
    timePickerProps: props.timePickerProps,
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
      {['top', 'left'].includes(presetsPlacement) ? (
        <ExtraContent
          presets={presets}
          selectedValue={value[activeIndex]}
          enableTimePicker={enableTimePicker}
          onPresetClick={onPresetClick}
          onConfirmClick={onConfirmClick}
          presetsPlacement={presetsPlacement}
        />
      ) : null}
      <div className={`${panelName}--content-wrapper`}>
        {!enableTimePicker ? (
          [
            <PanelContent
              key="startPanel"
              partial="start"
              year={startYear}
              month={startMonth}
              timeValue={timeValue[0]}
              tableData={startTableData}
              {...panelContentProps}
            />,
            <PanelContent
              key="endPanel"
              partial="end"
              year={endYear}
              month={endMonth}
              timeValue={timeValue[1]}
              tableData={endTableData}
              {...panelContentProps}
            />,
          ]
        ) : (
          <PanelContent
            key="start"
            partial={activeIndex ? 'end' : 'start'}
            year={activeIndex ? endYear : startYear}
            month={activeIndex ? endMonth : startMonth}
            timeValue={activeIndex ? timeValue[1] : timeValue[0]}
            tableData={activeIndex ? endTableData : startTableData}
            {...panelContentProps}
          />
        )}
      </div>
      {['bottom', 'right'].includes(presetsPlacement) ? (
        <ExtraContent
          presets={presets}
          selectedValue={value[activeIndex]}
          enableTimePicker={enableTimePicker}
          onPresetClick={onPresetClick}
          onConfirmClick={onConfirmClick}
          presetsPlacement={presetsPlacement}
        />
      ) : null}
    </div>
  );
};

DateRangePickerPanel.displayName = 'DateRangePickerPanel';

DateRangePickerPanel.defaultProps = {
  mode: 'date',
  enableTimePicker: false,
  presetsPlacement: 'bottom',
};

export default DateRangePickerPanel;
