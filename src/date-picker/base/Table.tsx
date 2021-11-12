import React from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import DatePickerCell from './Cell';

export interface DatePickerTableProps {
  data: Array<any>;
  type: string;
  firstDayOfWeek: number;
  onCellClick: Function;
  onCellMouseEnter: Function;
}

const DatePickerTable = (props: DatePickerTableProps) => {
  const { classPrefix } = useConfig();

  const { type, data, onCellClick, onCellMouseEnter, firstDayOfWeek } = props;

  const [local, t] = useLocaleReceiver('datePicker');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const shorthand = t(local.weekdays.shorthand);

  const weekArr = [];
  let wi = firstDayOfWeek;
  const len = shorthand.length;
  while (weekArr.length < len) {
    weekArr.push(shorthand[wi]);
    wi = (wi + len + 1) % len;
  }

  const panelClass = `${classPrefix}-date-picker-${type}`;

  return (
    <div className={panelClass}>
      <table>
        {type === 'date' && (
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

DatePickerTable.defaultProps = {
  type: 'day',
};

export default DatePickerTable;
