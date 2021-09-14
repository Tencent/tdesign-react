import React from 'react';
import { TdPrimaryTableProps } from '../../_type/components/table';
import BaseTable from '../base/Table';
import useSorter from './useSorter';
import useFilter from './useFilter';
import useSelect from './useSelect';

export type PrimaryTableProps = TdPrimaryTableProps;

export default function PrimaryTable(props: PrimaryTableProps) {
  const [sorterColumns, sortData] = useSorter(props);
  const [filterColumns, filterData] = useFilter({ ...props, columns: sorterColumns, data: sortData });
  const [selectColumns] = useSelect({ ...props, columns: filterColumns, data: filterData });

  // 添加其他附加功能
  const mergeColumns = selectColumns;
  const mergedData = filterData;
  // const mergeColumns = filterColumns;
  // const mergedData = filterData;

  return <BaseTable {...props} columns={mergeColumns} data={mergedData} />;
}
