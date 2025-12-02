import React, { RefAttributes, forwardRef, useImperativeHandle, useRef } from 'react';

import { get } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import useClassName from './hooks/useClassName';
import useTreeData from './hooks/useTreeData';
import useTreeSelect from './hooks/useTreeSelect';
import PrimaryTable from './PrimaryTable';
import { enableRowDrag } from './utils';

import type { HTMLElementAttributes, StyledProps } from '../common';
import type { EnhancedTableProps, EnhancedTableRef, PrimaryTableProps } from './interface';
import type { DragSortContext, PrimaryTableCol, TableRowData, TdPrimaryTableProps } from './type';

export interface TEnhancedTableProps extends EnhancedTableProps, StyledProps {}

const EnhancedTable = forwardRef<EnhancedTableRef, TEnhancedTableProps>((props, ref) => {
  const { tree, columns, style, className } = props;

  const { classPrefix } = useConfig();
  const { tableExpandClasses } = useClassName();

  // treeInstanceFunctions 属于对外暴露的 Ref 方法
  const { store, dataSource, formatTreeColumn, swapData, onExpandFoldIconClick, ...treeInstanceFunctions } =
    useTreeData(props);
  const treeDataMap = store?.treeDataMap;

  const { tIndeterminateSelectedRowKeys, onInnerSelectChange } = useTreeSelect(props, treeDataMap);

  const primaryTableRef = useRef<EnhancedTableRef>(null);

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

  const onEnhancedTableRowClick: TdPrimaryTableProps['onRowClick'] = (p) => {
    if (props.tree?.expandTreeNodeOnClick) {
      onExpandFoldIconClick(
        {
          row: p.row,
          rowIndex: p.index,
        },
        'row-click',
      );
    }
    props.onRowClick?.(p);
  };

  useImperativeHandle(ref, () => ({
    treeDataMap,
    ...treeInstanceFunctions,
    ...primaryTableRef.current,
  }));

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
    rowClassName: ({ row }) => {
      const rowValue = get(row, props.rowKey || 'id');
      const rowState = treeDataMap.get(rowValue);
      if (!rowState) return [props.rowClassName];
      const classNames = [props.rowClassName, `${classPrefix}-table-tr--level-${rowState.level}`];
      if (rowState.expanded) {
        classNames.push(tableExpandClasses.expanded);
      } else {
        classNames.push(tableExpandClasses.collapsed);
      }
      return classNames;
    },
    ...(enableRowDrag(props.dragSort) && {
      rowAttributes: (params) => {
        const { row } = params;
        const rowValue = get(row, props.rowKey);
        const rowState = treeDataMap.get(rowValue);
        const originalAttrs =
          typeof props.rowAttributes === 'function' ? props.rowAttributes(params) : props.rowAttributes || {};
        const formatAttrs: HTMLElementAttributes = !Array.isArray(originalAttrs) ? { ...originalAttrs } : {};
        if (rowState?.parent) {
          // 启用行拖拽时，如果有父节点，补充属性
          formatAttrs['data-parent-id'] = String(rowState.parent.id);
        }
        return formatAttrs;
      },
    }),

    style,
    className,
  };
  if (props.tree?.expandTreeNodeOnClick) {
    primaryTableProps.onRowClick = onEnhancedTableRowClick;
  }
  return <PrimaryTable {...primaryTableProps} ref={primaryTableRef} />;
});

EnhancedTable.displayName = 'EnhancedTable';

export default EnhancedTable as <T extends TableRowData = TableRowData>(
  props: EnhancedTableProps<T> & RefAttributes<EnhancedTableRef>,
) => React.ReactElement;
