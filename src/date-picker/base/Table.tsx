import React, { useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import type { Dayjs } from 'dayjs';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../hooks/useConfig';
import DatePickerCell from './Cell';

import { SinglePanelProps } from '../panel/SinglePanel';
import { PanelContentProps } from '../panel/PanelContent';
import { parseToDayjs } from '../../_common/js/date-picker/format';

import type { DateMultipleValue, DateRangeValue, DateValue, TdDatePickerProps } from '../type';

dayjs.extend(isoWeek);

export interface DatePickerTableProps
  extends Pick<TdDatePickerProps, 'mode' | 'firstDayOfWeek' | 'format' | 'multiple'>,
    Pick<SinglePanelProps, 'onCellClick' | 'onCellMouseEnter' | 'onCellMouseLeave'>,
    Pick<PanelContentProps, 'value'> {
  data?: Array<any>;
  time?: string;
}

const DatePickerTable = (props: DatePickerTableProps) => {
  const { classPrefix } = useConfig();

  const { value, format, mode, data, time, onCellClick, onCellMouseEnter, onCellMouseLeave, firstDayOfWeek } = props;

  const [local, t] = useLocaleReceiver('datePicker');
  const weekdays = t(local.weekdays);
  const weekAbbreviation = t(local.weekAbbreviation);

  const weekArr = [];
  let wi = firstDayOfWeek - 1;
  const len = weekdays.length;
  while (weekArr.length < len) {
    weekArr.push(weekdays[wi]);
    wi = (wi + len + 1) % len;
  }
  if (mode === 'week') weekArr.unshift(weekAbbreviation);

  const showThead = mode === 'date' || mode === 'week';

  const valueYearWeek = useMemo(() => {
    if (mode !== 'week' || !value) return {};

    if (Array.isArray(value)) {
      if (!value.length) return {};
      const [startObj, endObj] = value.map((v) => v && parseToDayjs(v, format));
      const startYear = startObj?.year?.();
      const startWeek = startObj?.locale?.(local.dayjsLocale)?.week?.();
      const endYear = endObj?.year?.();
      const endWeek = endObj?.locale?.(local.dayjsLocale)?.week?.();

      return { startYear, startWeek, endYear, endWeek };
    }

    const valueObj = parseToDayjs(value, format).locale(local.dayjsLocale);
    return { year: valueObj.year(), week: valueObj.week() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, value, format]);

  // 高亮周区间
  const weekRowClass = (value: DateValue | DateRangeValue, targetDayjs: Dayjs) => {
    if (mode !== 'week' || !value) return {};

    if (Array.isArray(value)) {
      if (!value.length) return {};

      const targetYear = targetDayjs.isoWeekYear();
      const targetWeek = targetDayjs.isoWeek();
      const isActive =
        (targetYear === valueYearWeek.startYear && targetWeek === valueYearWeek.startWeek) ||
        (targetYear === valueYearWeek.endYear && targetWeek === valueYearWeek.endWeek);
      const isRange =
        (targetYear > valueYearWeek.startYear ||
          (targetYear === valueYearWeek.startYear && targetWeek > valueYearWeek.startWeek)) &&
        (targetYear < valueYearWeek.endYear ||
          (targetYear === valueYearWeek.endYear && targetWeek < valueYearWeek.endWeek));

      return {
        // 同年同周
        [`${classPrefix}-date-picker__table-${mode}-row--active`]: isActive,
        [`${classPrefix}-date-picker__table-${mode}-row--range`]: isRange,
      };
    }

    return {
      [`${classPrefix}-date-picker__table-${mode}-row--active`]:
        valueYearWeek.year === targetDayjs.year() && valueYearWeek.week === targetDayjs.week(),
    };
  };

  // multiple
  const multipleWeekRowClass = (value: DateMultipleValue, targetDayjs: Dayjs) => {
    if (mode !== 'week' || (Array.isArray(value) && !value.length)) return {};
    const isSomeYearWeek = value
      .map((v) => parseToDayjs(v, format))
      .some((item) => item.isoWeek() === targetDayjs.isoWeek() && item.isoWeekYear() === targetDayjs.isoWeekYear());

    return {
      [`${classPrefix}-date-picker__table-${mode}-row--active`]: isSomeYearWeek,
    };
  };

  const activeRowCss = props.multiple ? multipleWeekRowClass : weekRowClass;

  return (
    <div className={`${classPrefix}-date-picker__table`} onMouseLeave={(e) => onCellMouseLeave?.({ e })}>
      <table>
        {showThead && (
          <thead>
            <tr>
              {weekArr.map((value: string, i: number) => (
                <th key={i}>{value}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, i: number) => (
            <tr
              key={i}
              className={classNames(`${classPrefix}-date-picker__table-${mode}-row`, {
                ...activeRowCss(value, row[0].dayjsObj),
              })}
            >
              {row.map((col: any, j: number) => (
                <DatePickerCell {...col} key={j} time={time} onClick={onCellClick} onMouseEnter={onCellMouseEnter} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DatePickerTable.displayName = 'DatePickerTable';

export default DatePickerTable;
