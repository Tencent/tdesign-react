import React from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
import { extractTimeObj } from '../../_common/js/date-picker/utils';

export interface DatePickerCellProps {
  time?: string;
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
  weekOfYear: boolean;
  now: boolean;
  firstDayOfMonth: boolean;
  lastDayOfMonth: boolean;
  onClick: Function;
  onMouseEnter: Function;
}

const DatePickerCell = (props: DatePickerCellProps) => {
  const { classPrefix } = useConfig();

  const cellClass = classNames(`${classPrefix}-date-picker__cell`, {
    [`${classPrefix}-date-picker__cell--now`]: props.now,
    [`${classPrefix}-date-picker__cell--active`]: props.active,
    [`${classPrefix}-date-picker__cell--disabled`]: props.disabled,
    [`${classPrefix}-date-picker__cell--highlight`]: props.highlight,
    [`${classPrefix}-date-picker__cell--hover-highlight`]: props.hoverHighlight,
    [`${classPrefix}-date-picker__cell--active-start`]: props.startOfRange,
    [`${classPrefix}-date-picker__cell--active-end`]: props.endOfRange,
    [`${classPrefix}-date-picker__cell--hover-start`]: props.hoverStartOfRange,
    [`${classPrefix}-date-picker__cell--hover-end`]: props.hoverEndOfRange,
    [`${classPrefix}-date-picker__cell--additional`]: props.additional,
    [`${classPrefix}-date-picker__cell--first-day-of-month`]: props.firstDayOfMonth,
    [`${classPrefix}-date-picker__cell--last-day-of-month`]: props.lastDayOfMonth,
    [`${classPrefix}-date-picker__cell--week-of-year`]: props.weekOfYear,
  });

  function handleClick(e: React.MouseEvent) {
    if (props.disabled) return;
    if (props.time) {
      const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(props.time);
      // am pm 12小时制转化 24小时制
      let nextHours = hours;
      if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
      if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
      props.value.setHours(nextHours);
      props.value.setMinutes(minutes);
      props.value.setSeconds(seconds);
      props.value.setMilliseconds(milliseconds);
    }
    props.onClick?.(props.value, { e });
  }

  function handleMouseEnter() {
    if (props.disabled) return;
    if (props.time) {
      const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(props.time);
      // am pm 12小时制转化 24小时制
      let nextHours = hours;
      if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
      if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
      props.value.setHours(nextHours);
      props.value.setMinutes(minutes);
      props.value.setSeconds(seconds);
      props.value.setMilliseconds(milliseconds);
    }
    props.onMouseEnter?.(props.value);
  }

  return (
    <td className={cellClass} onClick={handleClick} onMouseEnter={handleMouseEnter}>
      <div className={`${classPrefix}-date-picker__cell-inner`}>{props.text}</div>
    </td>
  );
};

DatePickerCell.displayName = 'DatePickerCell';

export default DatePickerCell;
