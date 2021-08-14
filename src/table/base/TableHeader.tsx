import React, { CSSProperties } from 'react';
import isCallable from '../../_util/isCallable';
import { BaseTableCol, DataType } from '../../_type/components/table';
import { useTableContext } from './TableContext';
import TableCell from './TableCell';

interface TableHeaderProps<D extends DataType> {
  columns: BaseTableCol<D>[];
}
const TableHeader = <D extends DataType>(props: TableHeaderProps<D>) => {
  const { stickyHeader } = useTableContext();
  const { columns } = props;

  return (
    <thead>
      <tr>
        {columns.map((column: BaseTableCol, index: number) => {
          const { title, colKey, fixed } = column;
          let content: React.ReactNode = title;

          if (isCallable(title)) {
            content = title({ col: column, colIndex: index });
          }

          const style: CSSProperties = {};
          if (stickyHeader) {
            style.position = 'sticky';
            style.top = 0;
            style.background = '#FFF';
            style.zIndex = 1;
            style.borderBottom = 'solid 1px #e7e7e7';
          }
          if (fixed) {
            style.zIndex = ((style.zIndex as number) || 0) + 1;
          }

          return (
            <TableCell<D>
              type="title"
              key={colKey}
              colKey={colKey}
              colIndex={index}
              render={() => content}
              style={style}
              fixed={fixed}
              columns={columns}
            >
              {content}
            </TableCell>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
