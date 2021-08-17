import React from 'react';
import { TdPrimaryTableProps } from '../../_type/components/table';
import BaseTable from '../base/Table';
import useSorter from './useSorter';

export interface PrimaryTableProps extends TdPrimaryTableProps {}

export default function PrimaryTable(props: PrimaryTableProps) {
  const [transformedColumns, sortData] = useSorter(props);

  // 添加其他附加功能

  const mergedData = sortData;

  return <BaseTable {...props} columns={transformedColumns} data={mergedData} />;
}
