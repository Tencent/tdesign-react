import React, { useState, useEffect, useMemo } from 'react';
import useConfig from '../../_util/useConfig';
import noop from '../../_util/noop';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import {
  getWeeks,
  getYears,
  getMonths,
  flagActive,
  subtractMonth,
  addMonth,
  getToday,
} from '../utils';

export type dateType = 'year' | 'month' | 'date';
export interface DatePanelProps {
  value: Date;
  mode: dateType;
  minDate: Date;
  maxDate: Date;
  firstDayOfWeek: number;
  disableDate: Function;
  onChange: Function;
}

const TODAY = getToday();

const DatePanel = (props: DatePanelProps) => {
  const { classPrefix } = useConfig();
  const { value, mode, minDate, maxDate, firstDayOfWeek, disableDate, onChange } = props;

  const [year, setYear] = useState(value.getFullYear());
  const [month, setMonth] = useState(value.getMonth());
  const [type, setType] = useState(mode);

  useEffect(() => {
    setType(mode);
  }, [mode]);

  useEffect(() => {
    setYear(value.getFullYear());
    setMonth(value.getMonth());
  }, [value]);

  function clickHeader(flag: number) {
    let monthCount = 0;
    let next = null;
    switch (type) {
      case 'date':
        monthCount = 1;
        break;
      case 'month':
        monthCount = 12;
        break;
      case 'year':
        monthCount = 120;
    }

    const current = new Date(year, month);

    switch (flag) {
      case 1:
        next = addMonth(current, monthCount);
        break;
      case -1:
        next = subtractMonth(current, monthCount);
        break;
      case 0:
        next = new Date();
        break;
    }

    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  const tableData = useMemo(() => {
    let data: any[];

    const options = {
      disableDate,
      minDate,
      maxDate,
      firstDayOfWeek,
    };

    switch (type) {
      case 'date':
        data = getWeeks({ year, month }, options);
        break;
      case 'month':
        data = getMonths(year, options);
        break;
      case 'year':
        data = getYears(year, options);
        break;
      default:
        break;
    }
    const start = (type === 'date' || type === mode) ? value : new Date(year, month);
    return flagActive(data, { start, type });
  }, [year, month, type, value, mode, disableDate, minDate, maxDate, firstDayOfWeek]);

  function getClickHandler(date) {
    if (type === 'date') {
      onChange?.(date);
    } else if (type === 'month') {
      if (mode === 'month') {
        onChange?.(date);
      } else {
        setType('date');
        setYear(date.getFullYear());
        setMonth(date.getMonth());
      }
    } else if (type === 'year') {
      if (mode === 'year') {
        onChange?.(date);
      } else {
        setType('month');
        setYear(date.getFullYear());
      }
    }
  }

  return (
    <div className={`${classPrefix}-date`}>
      <DateHeader
          year={year}
          month={month}
          type={type}
          onBtnClick={clickHeader}
          onTypeChange={setType}
      />

      <DateTable
        type={type}
        firstDayOfWeek={firstDayOfWeek}
        data={tableData}
        onCellClick={getClickHandler}
        onCellMouseEnter={noop}
      />
    </div>
  );
}

DatePanel.displayName = 'DatePanel';
DatePanel.defaultProps = {
  value: TODAY,
  mode: 'date',
}

export default DatePanel;
