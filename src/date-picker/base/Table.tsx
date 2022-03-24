import React from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import DatePickerCell from './Cell';
import { TdDatePickerProps } from '../type';
import { DatePanelProps } from '../panel/DatePanel';

export interface DatePickerTableProps extends Pick<TdDatePickerProps, 'mode' | 'firstDayOfWeek'>, DatePanelProps {
  data: Array<any>;
}

const DatePickerTable = (props: DatePickerTableProps) => {
  const { classPrefix } = useConfig();

  const { mode, data, onCellClick, onCellMouseEnter, onCellMouseLeave, firstDayOfWeek } = props;

  const [local, t] = useLocaleReceiver('datePicker');
  const weekdays = t(local.weekdays);

  const weekArr = [];
  let wi = firstDayOfWeek - 1;
  const len = weekdays.length;
  while (weekArr.length < len) {
    weekArr.push(weekdays[wi]);
    wi = (wi + len + 1) % len;
  }

  const tableClass = `${classPrefix}-date-picker__table`;

  return (
    <div className={tableClass} onMouseLeave={(e) => onCellMouseLeave({ e })}>
      <table>
        {mode === 'date' && (
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
            <tr key={i}>
              {row.map((col: any, j: number) => (
                <DatePickerCell {...col} key={j} onClick={onCellClick} onMouseEnter={onCellMouseEnter} />
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
