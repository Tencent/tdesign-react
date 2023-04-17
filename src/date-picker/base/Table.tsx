import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../hooks/useConfig';
import DatePickerCell from './Cell';
import { TdDatePickerProps } from '../type';
import { SinglePanelProps } from '../panel/SinglePanel';
import { PanelContentProps } from '../panel/PanelContent';
import { parseToDayjs } from '../../_common/js/date-picker/format';

export interface DatePickerTableProps
  extends Pick<TdDatePickerProps, 'mode' | 'firstDayOfWeek' | 'format'>,
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
  const weekRowClass = (value, targetDayjs) => {
    if (mode !== 'week' || !value) return {};

    if (Array.isArray(value)) {
      if (!value.length) return {};

      const targetYear = targetDayjs.year();
      const targetWeek = targetDayjs.week();
      const isActive =
        (targetYear === valueYearWeek.startYear && targetWeek === valueYearWeek.startWeek) ||
        (targetYear === valueYearWeek.endYear && targetWeek === valueYearWeek.endWeek);
      const isRange =
        targetYear >= valueYearWeek.startYear &&
        targetYear <= valueYearWeek.endYear &&
        targetWeek > valueYearWeek.startWeek &&
        targetWeek < valueYearWeek.endWeek;
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
                ...weekRowClass(value, row[0].dayjsObj),
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
