import React from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';

export interface DatePickerCellProps {
  text: [String, Number];
  value: Date;
  active: Boolean;
  highlight: Boolean;
  disabled: Boolean;
  startOfRange: Boolean;
  endOfRange: Boolean;
  additional: Boolean;
  now: Boolean;
  firstDayOfMonth: Boolean;
  lastDayOfMonth: Boolean;
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

  const cellClass = classNames(`${classPrefix}-date-picker-cell`, {
    [`${classPrefix}-date-cell--now`]: now,
    [`${classPrefix}-date-cell--active`]: active,
    [`${classPrefix}-date-cell--disabled`]: disabled,
    [`${classPrefix}-date-cell--highlight`]: highlight,
    [`${classPrefix}-date-cell--active-start`]: startOfRange,
    [`${classPrefix}-date-cell--active-end`]: endOfRange,
    [`${classPrefix}-date-cell--additional`]: additional,
    [`${classPrefix}-date-cell--first-day-of-month`]: firstDayOfMonth,
    [`${classPrefix}-date-cell--last-day-of-month`]: lastDayOfMonth,
  });

  function handleClick() {
    !disabled && onClick(value);
  }

  function handleMouseEnter() {
    onMouseEnter?.(value);
  }

  return (
    <td className={cellClass}>
      <div
        className={`${classPrefix}-date-cell__wrapper`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <span className={`${classPrefix}-date-cell__text`}>{ text }</span>
      </div>
    </td>
  );
}

DatePickerCell.displayName = 'DatePickerCell';

export default DatePickerCell;
