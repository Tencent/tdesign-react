import React from 'react';
import { DataType, TdBaseTableProps } from '../../_type/components/base-table';
import { useTableContext } from './TableContext';
import TableCell from './TableCell';

interface RowProps<D extends DataType> {
  record: D;
  index: number;
  rowClassName?: TdBaseTableProps['rowClassName'];
  rowIndex?: number;
}

const TableRow = <D extends DataType>(props: RowProps<D>) => {
  const { record, rowClassName, rowIndex } = props;
  const { flattenColumns } = useTableContext();

  const baseRow = flattenColumns.map((column, index) => {
    const { colKey, ...restColumnProps } = column;

    return <TableCell key={colKey} rowIndex={index} record={record} colKey={colKey} {...restColumnProps} />;
  });

  let classes = rowClassName as string;
  if (typeof rowClassName === 'function') {
    classes = rowClassName({ row: record, rowIndex });
  }

  return <tr className={classes}>{baseRow}</tr>;
};

export default TableRow;
