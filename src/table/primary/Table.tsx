import React from 'react';
import { TdPrimaryTableProps } from '../type';
import BaseTable from '../base/Table';
import useSorter from './useSorter';
import useFilter from './useFilter';
import useSelect from './useSelect';
import useExpand from './useExpand';

export type PrimaryTableProps = TdPrimaryTableProps;

export default function PrimaryTable(props: PrimaryTableProps) {
  const [sorterColumns, sortData] = useSorter(props);
  const [filterColumns, filterData] = useFilter({ ...props, columns: sorterColumns, data: sortData });
  const [selectColumns] = useSelect({ ...props, columns: filterColumns, data: filterData });
  const [expandColumns, handleExpandChange, renderExpandRow] = useExpand({
    ...props,
    columns: selectColumns,
    data: filterData,
  });

  // 添加其他附加功能
  const mergeColumns = expandColumns;
  const mergedData = filterData;

  return (
    <BaseTable
      {...props}
      columns={mergeColumns}
      data={mergedData}
      handleExpandChange={handleExpandChange}
      renderExpandRow={renderExpandRow}
    />
  );
}
