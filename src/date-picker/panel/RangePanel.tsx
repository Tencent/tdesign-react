import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
import { StyledProps } from '../../common';
import PanelContent from './PanelContent';
import ExtraContent from './ExtraContent';
import { TdDateRangePickerProps, DateValue } from '../type';
import type { TdTimePickerProps } from '../../time-picker';
import { getDefaultFormat, parseToDayjs } from '../../_common/js/date-picker/format';
import useTableData from '../hooks/useTableData';
import useDisableDate from '../hooks/useDisableDate';

export interface RangePanelProps extends TdDateRangePickerProps, StyledProps {
  hoverValue?: string[];
  activeIndex?: number;
  isFirstValueSelected?: boolean;
  popupVisible?: boolean;
  panelPreselection?: boolean;
  year?: number[];
  month?: number[];
  time?: string[];
  onClick?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onCellClick?: (date: Date, context: { e: React.MouseEvent<HTMLDivElement>; partial: 'start' | 'end' }) => void;
  onCellMouseEnter?: (date: Date, context: { partial: 'start' | 'end' }) => void;
  onCellMouseLeave?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onJumperClick?: (context: { e?: MouseEvent; trigger: string; partial: 'start' | 'end' }) => void;
  onConfirmClick?: (context: { e: React.MouseEvent<HTMLButtonElement> }) => void;
  onPresetClick?: (
    preset: DateValue | (() => DateValue),
    context: { e: React.MouseEventHandler<HTMLButtonElement> },
  ) => void;
  onYearChange?: (year: number, context: { partial: 'start' | 'end' }) => void;
  onMonthChange?: (month: number, context: { partial: 'start' | 'end' }) => void;
  onTimePickerChange?: TdTimePickerProps['onChange'];
}

const RangePanel = forwardRef<HTMLDivElement, RangePanelProps>((props, ref) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const panelName = `${classPrefix}-date-range-picker__panel`;
  const {
    value = [],
    hoverValue = [],
    mode,
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
    time = [],
    panelPreselection,
    onClick,
    onConfirmClick,
    onPresetClick,
  } = props;

  const { format } = getDefaultFormat({
    mode: props.mode,
    format: props.format,
    enableTimePicker: props.enableTimePicker,
  });

  const disableDateOptions = useDisableDate({
    disableDate: disableDateFromProps,
    mode,
    format,
    start:
      isFirstValueSelected && activeIndex === 1
        ? new Date(parseToDayjs(value[0], format, 'start').toDate().setHours(0, 0, 0))
        : undefined,
    end:
      isFirstValueSelected && activeIndex === 0
        ? new Date(parseToDayjs(value[1], format).toDate().setHours(23, 59, 59))
        : undefined,
  });

  const [startYear, endYear] = year;
  const [startMonth, endMonth] = month;

  // 是否隐藏预选状态,只有 value 有值的时候需要隐藏
  const hidePreselection = !panelPreselection && value.length === 2;

  const startTableData = useTableData({
    isRange: true,
    start: value[0] ? parseToDayjs(value[0], format).toDate() : undefined,
    end: value[1] ? parseToDayjs(value[1], format).toDate() : undefined,
    hoverStart: !hidePreselection && hoverValue[0] ? parseToDayjs(hoverValue[0], format).toDate() : undefined,
    hoverEnd: !hidePreselection && hoverValue[1] ? parseToDayjs(hoverValue[1], format).toDate() : undefined,
    year: startYear,
    month: startMonth,
    mode,
    firstDayOfWeek,
    ...disableDateOptions,
  });
  const endTableData = useTableData({
    isRange: true,
    start: value[0] ? parseToDayjs(value[0], format).toDate() : undefined,
    end: value[1] ? parseToDayjs(value[1], format).toDate() : undefined,
    hoverStart: !hidePreselection && hoverValue[0] ? parseToDayjs(hoverValue[0], format).toDate() : undefined,
    hoverEnd: !hidePreselection && hoverValue[1] ? parseToDayjs(hoverValue[1], format).toDate() : undefined,
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

    popupVisible: props.popupVisible,
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
      ref={ref}
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
      <div className={`${panelName}-content-wrapper`}>
        {!enableTimePicker ? (
          [
            <PanelContent
              key="startPanel"
              partial={'start'}
              year={startYear}
              month={startMonth}
              time={time[0]}
              tableData={startTableData}
              value={value}
              {...panelContentProps}
            />,
            <PanelContent
              key="endPanel"
              partial={'end'}
              year={endYear}
              month={endMonth}
              time={time[1]}
              value={value}
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
            time={activeIndex ? time[1] : time[0]}
            value={value}
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
});

RangePanel.displayName = 'RangePanel';
RangePanel.defaultProps = {
  mode: 'date',
  panelPreselection: true,
  enableTimePicker: false,
  presetsPlacement: 'bottom',
};

export default RangePanel;
