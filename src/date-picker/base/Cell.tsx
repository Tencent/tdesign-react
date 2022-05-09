import React from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import { extractTimeObj } from '../../_common/js/date-picker/utils-new';

export interface DatePickerCellProps {
  timeValue?: string;
  text: [string, number];
  value: Date;
  active: boolean;
  highlight: boolean;
  disabled: boolean;
  startOfRange: boolean;
  endOfRange: boolean;
  hoverHighlight: boolean;
  hoverStartOfRange: boolean;
  hoverEndOfRange: boolean;
  additional: boolean;
  now: boolean;
  firstDayOfMonth: boolean;
  lastDayOfMonth: boolean;
  onClick: Function;
  onMouseEnter: Function;
}

const DatePickerCell = (props: DatePickerCellProps) => {
  const { classPrefix } = useConfig();

  const {
    text,
    value,
    timeValue,
    active,
    highlight,
    disabled,
    startOfRange,
    endOfRange,
    hoverHighlight,
    hoverStartOfRange,
    hoverEndOfRange,
    additional,
    now,
    firstDayOfMonth,
    lastDayOfMonth,
    onClick,
    onMouseEnter,
  } = props;

  const cellClass = classNames(`${classPrefix}-date-picker__cell`, {
    [`${classPrefix}-date-picker__cell--now`]: now,
    [`${classPrefix}-date-picker__cell--active`]: active,
    [`${classPrefix}-date-picker__cell--disabled`]: disabled,
    [`${classPrefix}-date-picker__cell--highlight`]: highlight,
    [`${classPrefix}-date-picker__cell--hover-highlight`]: hoverHighlight,
    [`${classPrefix}-date-picker__cell--active-start`]: startOfRange,
    [`${classPrefix}-date-picker__cell--active-end`]: endOfRange,
    [`${classPrefix}-date-picker__cell--hover-start`]: hoverStartOfRange,
    [`${classPrefix}-date-picker__cell--hover-end`]: hoverEndOfRange,
    [`${classPrefix}-date-picker__cell--additional`]: additional,
    [`${classPrefix}-date-picker__cell--first-day-of-month`]: firstDayOfMonth,
    [`${classPrefix}-date-picker__cell--last-day-of-month`]: lastDayOfMonth,
  });

  function handleClick(e: React.MouseEvent) {
    if (disabled) return;
    if (timeValue) {
      const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(timeValue);
      // am pm 12小时制转化 24小时制
      let nextHours = hours;
      if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
      if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
      value.setHours(nextHours);
      value.setMinutes(minutes);
      value.setSeconds(seconds);
      value.setMilliseconds(milliseconds);
    }
    onClick?.(value, { e });
  }

  function handleMouseEnter() {
    if (disabled) return;
    if (timeValue) {
      const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(timeValue);
      // am pm 12小时制转化 24小时制
      let nextHours = hours;
      if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
      if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
      value.setHours(nextHours);
      value.setMinutes(minutes);
      value.setSeconds(seconds);
      value.setMilliseconds(milliseconds);
    }
    onMouseEnter?.(value);
  }

  return (
    <td className={cellClass} onClick={handleClick} onMouseEnter={handleMouseEnter}>
      <div className={`${classPrefix}-date-picker__cell-inner`}>{text}</div>
    </td>
  );
};

DatePickerCell.displayName = 'DatePickerCell';

export default DatePickerCell;
