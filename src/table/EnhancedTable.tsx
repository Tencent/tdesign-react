import React, { forwardRef, useImperativeHandle } from 'react';
import PrimaryTable from './PrimaryTable';
import { PrimaryTableCol, TableRowData, DragSortContext } from './type';
import useTreeData from './hooks/useTreeData';
import useTreeSelect from './hooks/useTreeSelect';
import { EnhancedTableProps, PrimaryTableProps } from './interface';

import { StyledProps } from '../common';

export interface TEnhancedTableProps extends EnhancedTableProps, StyledProps {}

const EnhancedTable = forwardRef((props: TEnhancedTableProps, ref) => {
  const { tree, columns, style, className } = props;

  // treeInstanceFunctions 属于对外暴露的 Ref 方法
  const { store, dataSource, formatTreeColumn, swapData, ...treeInstanceFunctions } = useTreeData(props);

  const treeDataMap = store?.treeDataMap;

  const { tIndeterminateSelectedRowKeys, onInnerSelectChange } = useTreeSelect(props, treeDataMap);

  // 影响列和单元格内容的因素有：树形节点需要添加操作符 [+] [-]
  const getColumns = (columns: PrimaryTableCol<TableRowData>[]) => {
    const arr: PrimaryTableCol<TableRowData>[] = [];
    for (let i = 0, len = columns.length; i < len; i++) {
      let item = { ...columns[i] };
      item = formatTreeColumn(item);
      if (item.children?.length) {
        item.children = getColumns(item.children);
      }
      // 多级表头和自定义列配置特殊逻辑：要么子节点不存在，要么子节点长度大于 1，方便做自定义列配置
      if (!item.children || item.children?.length) {
        arr.push(item);
      }
    }
    return arr;
  };

  const tColumns = (() => {
    // 暂时只有树形结构需要处理 column.cell
    const isTreeData = !tree || !Object.keys(tree).length;
    return isTreeData ? columns : getColumns(columns);
  })();

  useImperativeHandle(ref, () => ({ treeDataMap, ...treeInstanceFunctions }));

  const onDragSortChange = (params: DragSortContext<TableRowData>) => {
    if (props.beforeDragSort && !props.beforeDragSort(params)) return;
    swapData({
      data: params.data,
      current: params.current,
      target: params.target,
      currentIndex: params.currentIndex,
      targetIndex: params.targetIndex,
    });
    props.onDragSort?.(params);
  };

  const primaryTableProps: PrimaryTableProps = {
    ...props,
    data: dataSource,
    columns: tColumns,
    // 半选状态节点
    indeterminateSelectedRowKeys: tIndeterminateSelectedRowKeys,
    // 树形结构不允许本地数据分页
    disableDataPage: Boolean(tree && Object.keys(tree).length),
    onSelectChange: onInnerSelectChange,
    onDragSort: onDragSortChange,
    style,
    className,
  };
  return <PrimaryTable {...primaryTableProps} />;
});

EnhancedTable.displayName = 'EnhancedTable';

export default EnhancedTable;
