import React, { forwardRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { isFunction } from 'lodash-es';
import { getDefaultFormat, parseToDayjs } from '@tdesign/common-js/date-picker/format';
import useConfig from '../../hooks/useConfig';
import { StyledProps } from '../../common';
import PanelContent from './PanelContent';
import ExtraContent from './ExtraContent';
import useTableData from '../hooks/useTableData';
import useDisableDate from '../hooks/useDisableDate';
import useDefaultProps from '../../hooks/useDefaultProps';

import { parseToDateTime } from '../utils';
import { TimePickerPanel } from '../../time-picker';

import type { TdDateRangePickerProps } from '../type';
import type { TdTimePickerProps } from '../../time-picker';

export interface RangePanelProps extends Omit<TdDateRangePickerProps, 'onYearChange' | 'onMonthChange'>, StyledProps {
  hoverValue?: string[];
  activeIndex?: number;
  isFirstValueSelected?: boolean;
  popupVisible?: boolean;
  panelPreselection?: boolean;
  year?: number[];
  month?: number[];
  time?: string[];
  cancelRangeSelectLimit?: boolean;
  isSwitchTimeMode?: boolean;
  onClick?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onCellClick?: (date: Date, context: { e: React.MouseEvent<HTMLDivElement>; partial: 'start' | 'end' }) => void;
  onCellMouseEnter?: (date: Date, context: { partial: 'start' | 'end' }) => void;
  onCellMouseLeave?: (context: { e: React.MouseEvent<HTMLDivElement> }) => void;
  onJumperClick?: (context: { e?: MouseEvent; trigger: string; partial: 'start' | 'end' }) => void;
  onConfirmClick?: (context: { e: React.MouseEvent<HTMLButtonElement> }) => void;
  onPresetClick?: any;
  onYearChange?: (year: number, context: { partial: 'start' | 'end' }) => void;
  onMonthChange?: (month: number, context: { partial: 'start' | 'end' }) => void;
  onTimePickerChange?: (value: string, context?: { activeIndex: 0 | 1 }) => void;
}

const RangePanel = forwardRef<HTMLDivElement, RangePanelProps>((originalProps, ref) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const panelName = `${classPrefix}-date-range-picker__panel`;

  const [isDateRangeContent, toggleDateRangeContent] = useState(true);

  const props = useDefaultProps<RangePanelProps>(originalProps, {
    mode: 'date',
    panelPreselection: true,
    enableTimePicker: false,
    presetsPlacement: 'bottom',
    needConfirm: true,
  });

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
    needConfirm,
    style,
    className,
    activeIndex,
    year,
    month,
    time = [],
    panelPreselection,
    onPresetClick,
    cancelRangeSelectLimit,
    onClick,
    onConfirmClick,
    disableTime,
    onTimePickerChange,
    popupVisible,
    isSwitchTimeMode,
  } = props;

  const { format, timeFormat } = getDefaultFormat({
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

  useEffect(() => {
    if (popupVisible && isSwitchTimeMode) {
      toggleDateRangeContent(true);
    }
  }, [popupVisible, isSwitchTimeMode]);

  const disableTimeOptions: TdTimePickerProps['disableTime'] = (h, m, s, ms) => {
    if (!isFunction(disableTime)) {
      return {};
    }

    const [startTime, endTime] = value || [];

    return disableTime([parseToDateTime(startTime, format), parseToDateTime(endTime, format, [h, m, s, ms])], {
      partial: activeIndex === 0 ? 'start' : 'end',
    });
  };

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
    cancelRangeSelectLimit,
    ...disableDateOptions,
  });
  const endTableData = useTableData({
    isRange: true,
    start: value[0] ? parseToDayjs(value[0], format).toDate() : undefined,
    end: value[1] ? parseToDayjs(value[1], format).toDate() : undefined,
    hoverStart: !hidePreselection && hoverValue[0] ? parseToDayjs(hoverValue[0], format).toDate() : undefined,
    hoverEnd: !hidePreselection && hoverValue[1] ? parseToDayjs(hoverValue[1], format).toDate() : undefined,
    year: mode === 'year' && endYear - startYear <= 9 ? endYear + 9 : endYear,
    month: endMonth,
    mode,
    firstDayOfWeek,
    cancelRangeSelectLimit,
    ...disableDateOptions,
  });

  const panelContentProps = {
    mode,
    format,
    firstDayOfWeek,
    popupVisible,
    enableTimePicker: props.enableTimePicker,
    timePickerProps: {
      disableTime: disableTimeOptions,
      ...props.timePickerProps,
    },
    onMonthChange: props.onMonthChange,
    onYearChange: props.onYearChange,
    onJumperClick: props.onJumperClick,
    onCellClick: props.onCellClick,
    onCellMouseEnter: props.onCellMouseEnter,
    onCellMouseLeave: props.onCellMouseLeave,
    onTimePickerChange: props.onTimePickerChange,
  };

  const onTimeModeChange = () => {
    toggleDateRangeContent((prev) => !prev);
  };

  const renderPanelContent = () => {
    // 没有开启时间选择，或者开启时间选择但模式是切换（switch），则日期面板和时间面板分开展示
    if (!enableTimePicker || isSwitchTimeMode) {
      if (isDateRangeContent)
        return (
          <>
            <PanelContent
              key="startPanel"
              partial={'start'}
              year={startYear}
              month={startMonth}
              time={time[activeIndex]}
              tableData={startTableData}
              value={value}
              {...panelContentProps}
            />
            <PanelContent
              key="endPanel"
              partial={'end'}
              year={endYear}
              month={endMonth}
              time={time[activeIndex]}
              value={value}
              tableData={endTableData}
              internalYear={year}
              {...panelContentProps}
            />
          </>
        );

      return (
        <>
          <TimePickerPanel
            key="startPanel"
            position={'start'}
            format={timeFormat}
            value={time[0]}
            onChange={(val) => onTimePickerChange(val, { activeIndex: 0 })}
          />
          <TimePickerPanel
            key="endPanel"
            position={'end'}
            format={timeFormat}
            value={time[1]}
            onChange={(val) => onTimePickerChange(val, { activeIndex: 1 })}
          />
        </>
      );
    }
    return (
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
    );
  };

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(panelName, className, {
        [`${panelName}--direction-row`]: ['left', 'right'].includes(presetsPlacement),
        [`${panelName}--switch-mode`]: isSwitchTimeMode,
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
          needConfirm={needConfirm}
          onTimeModeChange={onTimeModeChange}
          isDateRangeContent={isDateRangeContent}
        />
      ) : null}
      <div className={`${panelName}-content-wrapper`}>{renderPanelContent()}</div>
      {['bottom', 'right'].includes(presetsPlacement) ? (
        <ExtraContent
          presets={presets}
          selectedValue={value[activeIndex]}
          enableTimePicker={enableTimePicker}
          onPresetClick={onPresetClick}
          onConfirmClick={onConfirmClick}
          onTimeModeChange={onTimeModeChange}
          isDateRangeContent={isDateRangeContent}
          presetsPlacement={presetsPlacement}
          needConfirm={needConfirm}
        />
      ) : null}
    </div>
  );
});

RangePanel.displayName = 'RangePanel';

export default RangePanel;
