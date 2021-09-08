import React from 'react';
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

  const shorthand = ['日', '一', '二', '三', '四', '五', '六'];

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
