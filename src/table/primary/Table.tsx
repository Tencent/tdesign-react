import React from 'react';
import useDragSorter from '../../_util/useDragSorter';
import { TdPrimaryTableProps } from '../type';
import { StyledProps } from '../../common';
import BaseTable from '../base/Table';
import useSorter from './useSorter';
import useFilter from './useFilter';
import useSelect from './useSelect';
import useExpand from './useExpand';
import useChange, { UseChangeResult } from './useChange';

export interface PrimaryTableProps extends TdPrimaryTableProps, StyledProps {}
export interface InnerPrimaryTableProps extends TdPrimaryTableProps, UseChangeResult {}

export default function PrimaryTable(props: PrimaryTableProps) {
  const { triggerOnChange, setTableChangeData } = useChange(props);
  const [sorterColumns, sortData] = useSorter({ ...props, triggerOnChange, setTableChangeData });
  const [filterColumns, filterData] = useFilter({
    ...props,
    columns: sorterColumns,
    data: sortData,
    triggerOnChange,
    setTableChangeData,
  });
  const [selectColumns] = useSelect({ ...props, columns: filterColumns, data: filterData });
  const [expandColumns, handleExpandChange, renderExpandRow, innerExpandRowKeys] = useExpand({
    ...props,
    columns: selectColumns,
    data: filterData,
  });
  const { dragging, onDragStart, onDragOver, onDrop, onDragEnd } = useDragSorter({
    sortOnDraggable: props.sortOnRowDraggable,
    onDragSort: props.onDragSort,
  });

  // 添加其他附加功能
  const mergeColumns = expandColumns;
  const mergedData = filterData;

  return (
    <BaseTable
      {...props}
      columns={mergeColumns}
      data={mergedData}
      innerExpandRowKeys={innerExpandRowKeys}
      handleExpandChange={handleExpandChange}
      renderExpandRow={renderExpandRow}
      dragging={dragging}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      triggerOnChange={triggerOnChange}
      setTableChangeData={setTableChangeData}
    />
  );
}
