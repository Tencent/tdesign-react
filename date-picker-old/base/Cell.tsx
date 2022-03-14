import React from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';

export interface DatePickerCellProps {
  text: [string, number];
  value: Date;
  active: boolean;
  highlight: boolean;
  disabled: boolean;
  startOfRange: boolean;
  endOfRange: boolean;
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
    active,
    highlight,
    disabled,
    startOfRange,
    endOfRange,
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
    [`${classPrefix}-date-picker__cell--active-start`]: startOfRange,
    [`${classPrefix}-date-picker__cell--active-end`]: endOfRange,
    [`${classPrefix}-date-picker__cell--additional`]: additional,
    [`${classPrefix}-date-picker__cell--first-day-of-month`]: firstDayOfMonth,
    [`${classPrefix}-date-picker__cell--last-day-of-month`]: lastDayOfMonth,
  });

  function handleClick(e: React.MouseEvent) {
    !disabled && onClick(value, { e });
  }

  function handleMouseEnter() {
    onMouseEnter?.(value);
  }

  return (
    <td className={cellClass}>
      <div className={`${classPrefix}-date-picker__cell-wrapper`} onClick={handleClick} onMouseEnter={handleMouseEnter}>
        <span className={`${classPrefix}-date-picker__cell-text`}>{text}</span>
      </div>
    </td>
  );
};

DatePickerCell.displayName = 'DatePickerCell';

export default DatePickerCell;
