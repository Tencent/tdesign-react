import React, { forwardRef, Fragment, useContext } from 'react';
import classNames from 'classnames';
import { TableProps, TableColumn } from '../TableProps';
import useConfig from '../../_util/useConfig';
import getRowKeyFromRowKey from '../util/getRowKeyFromRowKey';
import isCallable from '../../_util/isCallable';
import TableBox from './TableBox';
import { TableContext } from './TableContext';

const TableBody = forwardRef((props: TableProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const {
    columns,
    records = [],
    rowKey,
    rowClassName,
    height,
    loading = false,
    empty = '暂无数据',
  } = props;
  const { separate } = useContext(TableContext);

  // 键值的获取方式
  const getRowKey = getRowKeyFromRowKey(rowKey);

  // 行内每一个元素的渲染
  const renderBodyCell = (
    record,
    rowKey: string,
    recordIndex: number,
    column: TableColumn,
    columnIndex: number,
  ) => {
    let content: React.ReactNode = null;
    if (isCallable(column.render)) {
      content = column.render(record, rowKey, recordIndex, column, columnIndex);
    } else if (record && typeof record === 'object') {
      content = record[column.key];
    }

    if (typeof content === 'undefined') {
      content = null;
    }

    // typeof null => 'object'
    if (typeof content !== 'object') {
      content = content;
    }

    return content;
  };

  // 行渲染
  const renderRow = (record: any, rowKey: string, recordIndex: number, columns: TableColumn[]) => {
    const className = classNames(
      isCallable(rowClassName) ? rowClassName(record, recordIndex) : null,
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
          const columnClassName = classNames(ellipsisClassName, column.className || null, {
            [`${classPrefix}-text-${column.align}`]: column.align,
          });

          const children = renderBodyCell(record, rowKey, recordIndex, column, index);
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

  // 表体渲染的最终元素
  let bodyContent: any = null;

  // priority: 1 加载状态时，不展示body的内容
  if (loading) {
    bodyContent = <noscript />;
  }

  // priority: 2 展示空白数据
  if (records.length === 0 && !bodyContent) {
    bodyContent = (
      <tbody>
        <p>{empty}</p>
      </tbody>
    );
  }

  // priority: 3 表体渲染的基础元素
  const baseBodyContent: React.ReactChild = (
    <tbody>
      {(records || []).map((record, index) => (
        <Fragment key={getRowKey(record, index)}>{renderRecord(record, index)}</Fragment>
      ))}
    </tbody>
  );

  // 当bodyContetn为null时，才展示baseBodyContent
  if (!bodyContent) {
    if (separate) {
      bodyContent = (
        <div
          className={`${classPrefix}-table__body`}
          style={height ? { maxHeight: height } : {}}
          ref={ref}
        >
          <TableBox columns={columns} classPrefix={classPrefix}>
            {baseBodyContent}
          </TableBox>
        </div>
      );
    } else {
      bodyContent = baseBodyContent;
    }
  }

  return bodyContent;
});

export default TableBody;
