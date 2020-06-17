import React, { forwardRef, Fragment } from 'react';
import { TableProps, TableColumn } from '../TableProps';
import { TableBox } from './TableBox';
import useConfig from '../../_util/useConfig';
import getRowKeyFromRowKey from '../util/getRowKeyFromRowKey';
import classNames from 'classnames';
import isCallable from '../../_util/isCallable';

export const TableBody = forwardRef(
  (props: TableProps, ref: React.Ref<HTMLDivElement>) => {
    const { classPrefix } = useConfig();
    const { columns, records, rowKey, rowClassName } = props;

    // 键值的获取方式
    const getRowKey = getRowKeyFromRowKey(rowKey);

    // 行内每一个元素的渲染
    const renderBodyCell = (
      record,
      rowKey: string,
      recordIndex: number,
      column: TableColumn,
      columnIndex: number
    ) => {
      let content: React.ReactNode = null;
      if (isCallable(column.render)) {
        content = column.render(
          record,
          rowKey,
          recordIndex,
          column,
          columnIndex
        );
      } else if (record && typeof record === 'object') {
        content = record[column.key];
      }

      if (typeof content === 'undefined') {
        content = null;
      }

      // typeof null => 'object'
      if (typeof content !== 'object') {
        content = <span>{content}</span>;
      }

      return content;
    };

    // 行渲染
    const renderRow = (
      record: any,
      rowKey: string,
      recordIndex: number,
      columns: TableColumn[]
    ) => {
      const className = classNames(
        isCallable(rowClassName) ? rowClassName(record, recordIndex) : null
      );
      return (
        <tr key={rowKey} className={className || null}>
          {columns.map((column, index) => {
            // computed className for ellipsis
            let ellipsisClassName = null;
            if (typeof column.ellipsis === 'boolean') {
              ellipsisClassName = `${classPrefix}-table--ellipsis`;
            } else if (typeof column.ellipsis === 'number') {
              ellipsisClassName = `${classPrefix}-table--line-clamp-${column.ellipsis}`;
            }

            // reduce column className, userDefined className is high priority
            const columnClassName = classNames(
              ellipsisClassName,
              column.className || null,
              {
                [`${classPrefix}-text-${column.align}`]: column.align,
              }
            );

            const children = renderBodyCell(
              record,
              rowKey,
              recordIndex,
              column,
              index
            );
            return (
              <td key={column.key || index} className={columnClassName || null}>
                {children}
              </td>
            );
          })}
        </tr>
      );
    };

    // 渲染每一行的 Record
    const renderRecord = (record: any, recordIndex: number): any => {
      const rowKey = getRowKey(record, recordIndex);
      return renderRow(record, rowKey, recordIndex, columns);
    };

    return (
      <div className={`${classPrefix}-table__body`} ref={ref}>
        <TableBox columns={columns} classPrefix={classPrefix}>
          <tbody>
            {(records || []).map((record, index) => (
              <Fragment key={getRowKey(record, index)}>
                {renderRecord(record, index)}
              </Fragment>
            ))}
          </tbody>
        </TableBox>
      </div>
    );
  }
);
