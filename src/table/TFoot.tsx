import React, { useRef } from 'react';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import get from 'lodash/get';
import { BaseTableCellParams, TableRowData, TdBaseTableProps } from './type';
import { formatRowAttributes, formatRowClassNames } from './utils';
import { getColumnFixedStyles, RowAndColFixedPosition } from './hooks/useFixed';
import useClassName from './hooks/useClassName';

export interface TFootProps {
  rowKey: string;
  // 是否固定表头
  isFixedHeader: boolean;
  // 固定列 left/right 具体值
  rowAndColFixedPosition: RowAndColFixedPosition;
  footData: TdBaseTableProps['footData'];
  columns: TdBaseTableProps['columns'];
  rowAttributes: TdBaseTableProps['rowAttributes'];
  rowClassName: TdBaseTableProps['rowClassName'];
}

export default function TFoot(props: TFootProps) {
  const { footData, columns } = props;
  const tfooterRef = useRef();
  const classnames = useClassName();
  const renderTFootCell = (p: BaseTableCellParams<TableRowData>) => {
    const { col, row } = p;
    if (isFunction(col.foot)) {
      return col.foot(p);
    }
    return col.foot || get(row, col.colKey);
  };

  if (!footData || !footData.length || !columns) return null;
  const theadClasses = [
    classnames.tableFooterClasses.footer,
    { [classnames.tableFooterClasses.fixed]: props.isFixedHeader },
  ];
  return (
    <tfoot ref={tfooterRef} className={classNames(theadClasses)}>
      {footData.map((row, rowIndex) => {
        const trAttributes = formatRowAttributes(props.rowAttributes, { row, rowIndex, type: 'foot' });
        // 自定义行类名
        const customClasses = formatRowClassNames(
          props.rowClassName,
          { row, rowIndex, type: 'foot' },
          props.rowKey || 'id',
        );
        return (
          <tr key={rowIndex} {...trAttributes} className={classNames(customClasses)}>
            {columns.map((col, colIndex) => {
              const tdStyles = getColumnFixedStyles(
                col,
                colIndex,
                props.rowAndColFixedPosition,
                classnames.tableColFixedClasses,
              );
              return (
                <td key={col.colKey} className={classNames(tdStyles.classes)} style={tdStyles.style}>
                  {renderTFootCell({
                    row,
                    rowIndex,
                    col,
                    colIndex,
                  })}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tfoot>
  );
}
