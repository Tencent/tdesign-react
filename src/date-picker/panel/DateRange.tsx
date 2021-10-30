import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import useConfig from '../../_util/useConfig';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import { DatePanelProps } from './Date';

import {
  getWeeks,
  getYears,
  getMonths,
  flagActive,
  subtractMonth,
  addMonth,
  isSame,
  getToday,
  setDateTime,
  OptionsType,
} from '../utils';

const TODAY = getToday();
const LEFT = 'left';
const RIGHT = 'right';

export interface DateRangePanelProps extends Omit<DatePanelProps, 'value'> {
  value: Array<Date>;
}

const DateRangePanel = (props: DateRangePanelProps) => {
  const { classPrefix } = useConfig();
  const { value, mode, minDate, maxDate, firstDayOfWeek, disableDate, onChange } = props;

  const data = getLeftAndRightDataFromValue(value);

  const [leftYear, setLeftYear] = useState(data.leftYear);
  const [leftMonth, setLeftMonth] = useState(data.leftMonth);
  const [rightYear, setRightYear] = useState(data.rightYear);
  const [rightMonth, setRightMonth] = useState(data.rightMonth);
  const [leftType, setLeftType] = useState(mode);
  const [rightType, setRightType] = useState(mode);
  const [startValue, setStartValue] = useState(data.startValue);
  const [endValue, setEndValue] = useState(data.endValue);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [firstClickValue, setFirstClickValue] = useState(TODAY);

  useEffect(() => {
    const panelData = getLeftAndRightDataFromValue(value);
    const { leftYear, leftMonth, rightMonth, rightYear, startValue, endValue } = panelData;

    setStartValue(startValue);
    setEndValue(endValue);
    setLeftYear(leftYear);
    setLeftMonth(leftMonth);
    setRightYear(rightYear);
    setRightMonth(rightMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    setLeftType(mode);
    setRightType(mode);
  }, [mode]);

  function getLeftAndRightDataFromValue(value: any) {
    const [startValue = TODAY, endValue = TODAY] = value;
    const leftYear = startValue.getFullYear();
    const leftMonth = startValue.getMonth();
    let rightMonth = endValue.getMonth();
    let rightYear = endValue.getFullYear();

    if (mode === 'date' && isSame(startValue, endValue, 'month')) {
      const next = addMonth(endValue, 1);
      rightMonth = new Date(endValue).getMonth() + 1;
      rightYear = next.getFullYear();
    }

    if (mode === 'month' && isSame(startValue, endValue, 'year')) {
      rightYear = leftYear + 1;
    }

    if (mode === 'year' && isSame(startValue, endValue, 'year')) {
      rightYear = leftYear + 10;
    }

    return { leftYear, leftMonth, rightMonth, rightYear, startValue, endValue };
  }

  function clickHeader(flag: number, direction: string) {
    const year = direction === LEFT ? leftYear : rightYear;
    const month = direction === LEFT ? leftMonth : rightMonth;
    const type = direction === LEFT ? leftType : rightType;

    let monthCount: number;
    let next: Date;

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

    if (flag === 1) {
      next = addMonth(current, monthCount);
    } else if (flag === -1) {
      next = subtractMonth(current, monthCount);
    } else {
      next = new Date();
    }

    direction === LEFT ? setLeftYear(next.getFullYear()) : setRightYear(next.getFullYear());
    direction === LEFT ? setLeftMonth(next.getMonth()) : setRightMonth(next.getMonth());
  }

  function getClickHandler(direction: string) {
    const type = direction === LEFT ? leftType : rightType;

    if (type === 'date') return (date: Date) => clickDate(date);

    if (type === 'month') return (date: Date) => clickMonth(date, direction);

    if (type === 'year') return (date: Date) => clickYear(date, direction);
  }

  function clickDate(date: Date) {
    if (isFirstClick) {
      setStartValue(date);
      setEndValue(date);
      setIsFirstClick(false);
      setFirstClickValue(date);
    } else {
      if (dayjs(firstClickValue).isBefore(dayjs(date), 'day')) {
        setEndValue(date);
      } else {
        setEndValue(firstClickValue);
        setStartValue(date);
      }
      onChange?.([setDateTime(startValue, 0, 0, 0), setDateTime(endValue, 23, 59, 59)]);
      setIsFirstClick(true);
    }
  }

  function clickYear(date: Date, direction: string) {
    if (mode === 'year') {
      if (isFirstClick) {
        setStartValue(date);
        setIsFirstClick(false);
        setFirstClickValue(date);
      } else {
        onChange?.([startValue, endValue]);
        setIsFirstClick(true);
      }
    } else {
      direction === LEFT ? setLeftType('month') : setRightType('month');
      direction === LEFT ? setLeftYear(date.getFullYear()) : setRightYear(date.getFullYear());
    }
  }

  function clickMonth(date: Date, direction: string) {
    if (mode === 'month') {
      if (isFirstClick) {
        setStartValue(date);
        setIsFirstClick(false);
        setFirstClickValue(date);
      } else {
        if (endValue < startValue) {
          setEndValue(startValue);
        }
        onChange?.([startValue, endValue]);
        setIsFirstClick(true);
      }
    } else {
      direction === LEFT ? setLeftType('date') : setRightType('date');
      direction === LEFT ? setLeftYear(date.getFullYear()) : setRightYear(date.getFullYear());
      direction === LEFT ? setLeftMonth(date.getMonth()) : setRightMonth(date.getMonth());
    }
  }

  function onMouseEnter(date: Date) {
    if (isFirstClick) return;

    if (firstClickValue.getTime() > date.getTime()) {
      setStartValue(date);
      setEndValue(firstClickValue);
    } else {
      setStartValue(firstClickValue);
      setEndValue(date);
    }
  }

  const getData = useCallback(
    ({ year, month, type, start, end }) => {
      let data: any[];

      const options: OptionsType = {
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

      return flagActive(data, { start, end, type });
    },
    [disableDate, minDate, maxDate, firstDayOfWeek],
  );

  const leftData = useMemo(
    () =>
      getData({
        year: leftYear,
        month: leftMonth,
        type: leftType,
        start: startValue,
        end: endValue,
      }),
    [leftYear, leftMonth, leftType, startValue, endValue, getData],
  );

  const rightData = useMemo(
    () =>
      getData({
        year: rightYear,
        month: rightMonth,
        type: rightType,
        start: startValue,
        end: endValue,
      }),
    [rightYear, rightMonth, rightType, startValue, endValue, getData],
  );

  return (
    <div className={`${classPrefix}-date-range`}>
      <div className={`${classPrefix}-date`}>
        <DateHeader
          year={leftYear}
          month={leftMonth}
          type={leftType}
          onBtnClick={(flag: number) => clickHeader(flag, LEFT)}
          onTypeChange={setLeftType}
        />

        <DateTable
          type={leftType}
          firstDayOfWeek={firstDayOfWeek}
          data={leftData}
          onCellClick={getClickHandler(LEFT)}
          onCellMouseEnter={onMouseEnter}
        />
      </div>
      <div className={`${classPrefix}-date`}>
        <DateHeader
          year={rightYear}
          month={rightMonth}
          type={rightType}
          onBtnClick={(flag: number) => clickHeader(flag, RIGHT)}
          onTypeChange={setRightType}
        />

        <DateTable
          type={rightType}
          firstDayOfWeek={firstDayOfWeek}
          data={rightData}
          onCellClick={getClickHandler(RIGHT)}
          onCellMouseEnter={onMouseEnter}
        />
      </div>
    </div>
  );
};

DateRangePanel.displayName = 'DateRangePanel';
DateRangePanel.defaultProps = {
  value: [TODAY, TODAY],
  mode: 'date',
};

export default DateRangePanel;
