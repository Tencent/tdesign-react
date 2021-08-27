import React from 'react';
import { TdPrimaryTableProps } from '../../_type/components/table';
import BaseTable from '../base/Table';
import useSorter from './useSorter';
import useFilter from './useFilter';

export interface PrimaryTableProps extends TdPrimaryTableProps {}

export default function PrimaryTable(props: PrimaryTableProps) {
  const [transformedColumns, sortData] = useSorter(props);
  const [transformedFilterColumns, filterData] = useFilter({ ...props, columns: transformedColumns, data: sortData });

  // 添加其他附加功能
  const mergeTransformedColumns = transformedFilterColumns;
  const mergedData = filterData;

  return <BaseTable {...props} columns={mergeTransformedColumns} data={mergedData} />;
}
