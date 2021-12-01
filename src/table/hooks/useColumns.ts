import { useMemo } from 'react';
import { BaseTableCol, DataType } from '../type';

function flattenColumns(columns: BaseTableCol[]): BaseTableCol[] {
  const result: Array<BaseTableCol> = [];
  columns.forEach((column: BaseTableCol) => {
    const { children } = column;
    if (children?.length) {
      result.push(...flattenColumns(children));
    } else {
      result.push({
        ...column,
      });
    }
  });
  return result;
}

export function useColumns<RowData extends DataType = DataType>(props: { columns?: BaseTableCol<RowData>[] }) {
  const { columns = [] } = props;
  const flattenedColumns = useMemo(() => flattenColumns(columns), [columns]);

  return [columns, flattenedColumns];
}
