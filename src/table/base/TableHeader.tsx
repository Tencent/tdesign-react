import React, { forwardRef } from 'react';
import { TableProps, TableColumn } from '../TableProps';
import { TableBox } from './TableBox';
import isCallable from '../../_util/isCallable';
import useConfig from '../../_util/useConfig';
import classNames from 'classnames';

export const TableHeader = forwardRef(
  (props: TableProps, ref: React.Ref<HTMLDivElement>) => {
    const { classPrefix } = useConfig();
    const { columns } = props;

    // 表头每一项的渲染
    const renderHeadCell = (column: TableColumn, index: number) => {
      const { title, key } = column;
      let content: React.ReactNode = title;

      // @pre header is render function
      if (isCallable(title)) {
        content = title(column);
      }

      // plain values
      if (typeof title === 'string' || typeof title === 'number') {
        content = <span>{title || key}</span>;
      }

      return (
        <th
          key={column.key || index}
          className={classNames({
            [`${classPrefix}-text-${column.align}`]: column.align,
          })}
        >
          {content}
        </th>
      );
    };

    return (
      <div className={`${classPrefix}-table__header`} ref={ref}>
        <TableBox columns={columns} classPrefix={classPrefix}>
          <thead>
            <tr>
              {columns.map((column, index) => renderHeadCell(column, index))}
            </tr>
          </thead>
        </TableBox>
      </div>
    );
  }
);
