import React, { CSSProperties } from 'react';
import isCallable from '../../_util/isCallable';
import { BaseTableCol, DataType } from '../../_type/components/table';
import { useTableContext } from './TableContext';
import TableCell from './TableCell';
import { Styles } from '../../_type/common';

interface TableHeaderProps<D extends DataType> {
  columns: (BaseTableCol<D> & { style?: Styles })[];
}
const TableHeader = <D extends DataType>(props: TableHeaderProps<D>) => {
  const { stickyHeader } = useTableContext();
  const { columns } = props;

  return (
    <thead>
      <tr>
        {columns.map((column: BaseTableCol & { style?: Styles }, index: number) => {
          const { title, colKey, fixed, className, style = {} } = column;
          let content: React.ReactNode | JSX.Element[] = title;

          if (isCallable(title)) {
            content = title({ col: column, colIndex: index });
          }

          const styleNew: CSSProperties = {};
          if (stickyHeader) {
            styleNew.position = 'sticky';
            styleNew.top = 0;
            styleNew.background = '#FFF';
            styleNew.zIndex = 1;
            styleNew.borderBottom = 'solid 1px #e7e7e7';
          }
          if (fixed) {
            styleNew.zIndex = ((styleNew.zIndex as number) || 0) + 1;
          }

          return (
            <TableCell
              type="title"
              key={colKey}
              colKey={colKey}
              colIndex={index}
              render={() => content}
              style={{ ...styleNew, ...style }}
              fixed={fixed}
              columns={columns}
              className={className}
            >
              {content as JSX.Element[]}
            </TableCell>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
