import React, { useMemo, useState, useEffect } from 'react';
import type { FC, MouseEvent } from 'react';
import dayjs, { Dayjs, UnitType } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import objectSupport from 'dayjs/plugin/objectSupport';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { getMeaningColumn } from './shared';
import { usePrefixClass } from '../hooks/useClass';
import useDefault from '../_util/useDefault';
import Picker from '../picker';

import { TdDateTimePickerProps, TimeModeValues } from './type';
import { PickerColumn, PickerColumnItem, PickerValue, PickerContext } from '../picker/type';
import { StyledProps } from '../common';

dayjs.extend(weekday);
dayjs.extend(customParseFormat);
dayjs.extend(objectSupport);

export interface DateTimePickerProps extends TdDateTimePickerProps, StyledProps {}

const normalize = (val: string | number, defaultDay: Dayjs) => (val && dayjs(val).isValid() ? dayjs(val) : defaultDay);

const DateTimePicker: FC<DateTimePickerProps> = (props) => {
  const [locale, t] = useLocaleReceiver('dateTimePicker');

  const dateTimePickerClass = usePrefixClass('date-time-picker');

  const [innerValue, setDateTimePickerValue] = useDefault(props.value, props.defaultValue, props.onChange);

  // title 优先级：props.title 显式传入（包括空字符串）即生效，未传时回退到 globalConfig.title
  const titleText = props.title ?? (t(locale.title) as string);
  const confirmButtonText = props.confirmBtn || (t(locale.confirm) as string);
  const cancelButtonText = props.cancelBtn || (t(locale.cancel) as string);

  // format 优先级：props.format > globalConfig.format > 兜底 'YYYY-MM-DD HH:mm:ss'
  const format = props.format || (t(locale.format) as string) || 'YYYY-MM-DD HH:mm:ss';

  const start = normalize(props.start, dayjs().subtract(10, 'year'));
  const end = normalize(props.end, dayjs().add(10, 'year'));

  const meaningColumn = useMemo(() => getMeaningColumn(props.mode), [props.mode]);
  const isTimeMode = useMemo(
    () => Array.isArray(props.mode) && props.mode[0] == null && ['hour', 'minute', 'second'].includes(props.mode[1]),
    [props.mode],
  );

  const rationalize = (val: Dayjs) => {
    if (isTimeMode) return val;
    if (val.isBefore(start)) return start;
    if (val.isAfter(end)) return end;
    return val;
  };

  const calcDate = (currentValue: string | number) => {
    let innerValue = currentValue;
    if (isTimeMode) {
      const dateStr = dayjs(start).format('YYYY-MM-DD');
      innerValue = `${dateStr} ${innerValue}`;
    }
    return innerValue && dayjs(innerValue).isValid() ? rationalize(dayjs(innerValue)) : start;
  };
  const [curDate, setCurDate] = useState(calcDate(innerValue));

  useEffect(() => {
    const newCurDate = calcDate(innerValue);
    if (!newCurDate.isSame(curDate)) {
      setCurDate(newCurDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerValue]);

  const valueOfPicker = useMemo(
    () => meaningColumn.map((item) => curDate[item]().toString()),
    [curDate, meaningColumn],
  );

  // 每次pick后，根据start,end生成最新的columns
  const getColumns = () => {
    const ret: PickerColumn[] = [];
    const getDate = (date: Dayjs) => [
      date.year(),
      date.month() + 1,
      date.date(),
      date.hour(),
      date.minute(),
      date.second(),
    ];
    const [curYear, curMonth, curDay, curHour, curMinute] = getDate(curDate);
    const [minYear, minMonth, minDay, minHour, minMinute, minSecond] = getDate(start);
    const [maxYear, maxMonth, maxDay, maxHour, maxMinute, maxSecond] = getDate(end);

    const isInMinYear = curYear === minYear;
    const isInMaxYear = curYear === maxYear;
    const isInMinMonth = isInMinYear && curMonth === minMonth;
    const isInMaxMonth = isInMaxYear && curMonth === maxMonth;
    const isInMinDay = isInMinMonth && curDay === minDay;
    const isInMaxDay = isInMaxMonth && curDay === maxDay;
    const isInMinHour = isInMinDay && curHour === minHour;
    const isInMaxHour = isInMaxDay && curHour === maxHour;
    const isInMinMinute = isInMinHour && curMinute === minMinute;
    const isInMaxMinute = isInMaxHour && curMinute === maxMinute;

    const typeUnit = {
      year: t(locale.yearLabel),
      month: t(locale.monthLabel),
      date: t(locale.dateLabel),
      hour: t(locale.hourLabel),
      minute: t(locale.minuteLabel),
      second: t(locale.secondLabel),
    };

    const generateDayWithWeekColumn = (date: Dayjs) => {
      const startOfMonth = date.startOf('month');
      const endOfMonth = date.endOf('month');
      const daysOfWeek = [];
      const type = 'date';

      for (let i = 0; i <= endOfMonth.diff(startOfMonth, 'days'); i += 1) {
        const currentDate = startOfMonth.add(i, 'days');
        const dayName = currentDate.format('ddd');

        daysOfWeek.push({
          value: `${i + 1}`,
          label: props.renderLabel ? props.renderLabel(type, i) : `${i + 1}${typeUnit[type] || ''} ${dayName}`,
        });
      }

      if (typeof props.filter === 'function') {
        ret.push(props.filter(type, daysOfWeek));
      } else {
        ret.push(daysOfWeek);
      }
    };

    const generateColumn = (start: number, end: number, type: TimeModeValues) => {
      const arr: PickerColumnItem[] = [];
      const step = (props.steps as TdDateTimePickerProps['steps'])?.[type] || 1;
      for (let i = start; i <= end; i += step) {
        const value = i.toString();
        arr.push({
          label: props.renderLabel ? props.renderLabel(type, i) : `${value} ${typeUnit[type]}`,
          value: type === 'month' ? `${+value - 1}` : value,
        });
      }
      if (typeof props.filter === 'function') {
        ret.push(props.filter(type, arr));
      } else {
        ret.push(arr);
      }
    };

    if (meaningColumn.includes('year')) {
      generateColumn(minYear, maxYear, 'year');
    }

    if (meaningColumn.includes('month')) {
      const lower = isInMinYear ? minMonth : 1;
      const upper = isInMaxYear ? maxMonth : 12;
      generateColumn(lower, upper, 'month');
    }

    if (meaningColumn.includes('date')) {
      const lower = isInMinMonth ? minDay : 1;
      const upper = isInMaxMonth ? maxDay : dayjs(`${curYear}-${curMonth}`).daysInMonth();
      if (props.showWeek) {
        generateDayWithWeekColumn(curDate);
      } else {
        generateColumn(lower, upper, 'date');
      }
    }

    if (meaningColumn.includes('hour')) {
      const lower = isInMinDay && !isTimeMode ? minHour : 0;
      const upper = isInMaxDay && !isTimeMode ? maxHour : 23;
      generateColumn(lower, upper, 'hour');
    }

    if (meaningColumn.includes('minute')) {
      const lower = isInMinHour && !isTimeMode ? minMinute : 0;
      const upper = isInMaxHour && !isTimeMode ? maxMinute : 59;
      generateColumn(lower, upper, 'minute');
    }

    if (meaningColumn.includes('second')) {
      const lower = isInMinMinute && !isTimeMode ? minSecond : 0;
      const upper = isInMaxMinute && !isTimeMode ? maxSecond : 59;
      generateColumn(lower, upper, 'second');
    }
    return ret;
  };

  const columns = getColumns();

  const formatValue = (date: Dayjs) => {
    if (format === 'time-stamp') {
      return date.valueOf();
    }
    return date.format(format);
  };

  const onConfirm = (value: string[]) => {
    const dayObject = value.reduce((map, cur, index) => {
      const type = meaningColumn[index];
      return {
        ...map,
        [type]: cur,
      };
    }, {});
    const cur = dayjs(dayObject);
    const formatted = formatValue(cur || curDate);
    props.onConfirm?.(formatted);
    setDateTimePickerValue(formatted);
  };

  const onCancel = (context: { e: MouseEvent<HTMLButtonElement> }) => {
    props.onCancel?.({ e: context.e });
  };

  const onPick = (value: Array<PickerValue>, { column, index }: PickerContext) => {
    const type = meaningColumn[column];
    const val = curDate.set(type as UnitType, parseInt(columns[column][index]?.value, 10));
    const next = rationalize(val);
    setCurDate(next);
    props.onPick?.(formatValue(next));
  };

  return (
    <Picker
      className={`${dateTimePickerClass} ${props.className || ''}`.trim()}
      style={props.style}
      value={valueOfPicker}
      title={titleText}
      confirmBtn={confirmButtonText}
      cancelBtn={cancelButtonText}
      columns={columns}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onPick={onPick}
      header={props.header}
      footer={props.footer}
    />
  );
};

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;
