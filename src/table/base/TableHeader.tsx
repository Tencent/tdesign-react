import React, { forwardRef, useContext } from 'react';
import { TableProps, TableColumn } from '../TableProps';
import isCallable from '../../_util/isCallable';
import useConfig from '../../_util/useConfig';
import classNames from 'classnames';
import { TableBox } from './TableBox';
import { TableContext } from './TableContext';

export const TableHeader = forwardRef(
  (props: TableProps, ref: React.Ref<HTMLDivElement>) => {
    const { classPrefix } = useConfig();
    const { columns } = props;
    const { separate } = useContext(TableContext);

    // 表头每一项的渲染
    const renderHeadCell = (column: TableColumn, index: number) => {
      const { title, key, align = 'left' } = column;
      let content: React.ReactNode = title;

      // @pre header is render function
      if (isCallable(title)) {
        content = title(column);
      }

      return (
        <th
          key={key || index}
          className={classNames({
            [`${classPrefix}-text-${align}`]: align,
          })}
        >
          {content}
        </th>
      );
    };

    // 表头渲染的最终内容
    let headContent: any;
    // 表头渲染的基础内容
    const baseHeadContent: React.ReactChild = (
      <thead>
        <tr>{columns.map((column, index) => renderHeadCell(column, index))}</tr>
      </thead>
    );

    if (separate) {
      headContent = (
        <div className={`${classPrefix}-table__header`} ref={ref}>
          <TableBox columns={columns} classPrefix={classPrefix}>
            {baseHeadContent}
          </TableBox>
        </div>
      );
    } else {
      headContent = baseHeadContent;
    }

    return headContent;
  }
);
