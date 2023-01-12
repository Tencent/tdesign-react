import React from 'react';
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

  // 高亮周区间
  const weekRowClass = (value, format, targetValue) => {
    if (mode !== 'week') return {};

    if (Array.isArray(value)) {
      if (!value.length) return {};
      const [startObj, endObj] = value.map((v) => v && parseToDayjs(v, format));
      const startYear = startObj?.year?.();
      const startWeek = startObj?.week?.();
      const endYear = endObj?.year?.();
      const endWeek = endObj?.week?.();

      const targetObj = parseToDayjs(targetValue, format);
      const targetYear = targetObj.year();
      const targetWeek = targetObj.week();
      const isActive =
        (targetYear === startYear && targetWeek === startWeek) || (targetYear === endYear && targetWeek === endWeek);
      const isRange =
        targetYear >= startYear && targetYear <= endYear && targetWeek > startWeek && targetWeek < endWeek;
      return {
        // 同年同周
        [`${classPrefix}-date-picker__table-${mode}-row--active`]: isActive,
        [`${classPrefix}-date-picker__table-${mode}-row--range`]: isRange,
      };
    }

    return {
      [`${classPrefix}-date-picker__table-${mode}-row--active`]:
        parseToDayjs(value, format).week() === parseToDayjs(targetValue, format).week(),
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
                ...weekRowClass(value, format, row[0].value),
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
