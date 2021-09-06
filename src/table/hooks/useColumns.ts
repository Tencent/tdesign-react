import { useMemo } from 'react';
import { BaseTableCol, DataType } from '../../_type/components/table';

function flattenColumns(columns: BaseTableCol[]) {
  return columns;
}

export function useColumns<RowData extends DataType = DataType>(props: { columns?: BaseTableCol<RowData>[] }) {
  const { columns = [] } = props;
  const flattenedColumns = useMemo(() => flattenColumns(columns), [columns]);

  return [columns, flattenedColumns];
}
