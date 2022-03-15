import React from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import DatePickerCell from './Cell';

export interface DatePickerTableProps {
  data: Array<any>;
  panelType: 'year' | 'month' | 'date' | 'time';
  firstDayOfWeek: number;
  onCellClick: Function;
  onCellMouseEnter: Function;
  onCellMouseLeave: React.MouseEventHandler<HTMLDivElement>;
}

const DatePickerTable = (props: DatePickerTableProps) => {
  const { classPrefix } = useConfig();

  const { panelType = 'date', data, onCellClick, onCellMouseEnter, onCellMouseLeave, firstDayOfWeek } = props;

  const [local, t] = useLocaleReceiver('datePicker');
  const weekdays = t(local.weekdays);

  const weekArr = [];
  let wi = firstDayOfWeek - 1;
  const len = weekdays.length;
  while (weekArr.length < len) {
    weekArr.push(weekdays[wi]);
    wi = (wi + len + 1) % len;
  }

  const panelClass = `${classPrefix}-date-picker__panel--${panelType}`;

  return (
    <div className={panelClass} onMouseLeave={onCellMouseLeave}>
      <table>
        {panelType === 'date' && (
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
