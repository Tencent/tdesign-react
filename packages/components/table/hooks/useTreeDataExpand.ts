import { useEffect, useState } from 'react';
import { diffExpandedTreeNode, getUniqueRowValue } from '@tdesign/common-js/table/tree-store';

import useControlled from '../../hooks/useControlled';
import usePrevious from '../../hooks/usePrevious';

import type TableTreeStore from '@tdesign/common-js/table/tree-store';
import type { TableTreeExpandType } from '../interface';
import type { TableRowData, TdEnhancedTableProps } from '../type';

export function useTreeDataExpand(
  props: TdEnhancedTableProps,
  params: {
    store: InstanceType<typeof TableTreeStore>;
    dataSource: TdEnhancedTableProps['data'];
    setDataSource: React.Dispatch<React.SetStateAction<TableRowData[]>>;
    rowDataKeys: { rowKey: string; childrenKey: string };
  },
) {
  const { store, dataSource, rowDataKeys, setDataSource } = params;
  const { data, tree } = props;

  const [isDefaultExpandAllExecute, setIsDefaultExpandAllExecute] = useState(false);
  const [tExpandedTreeNode, setTExpandedTreeNode] = useControlled(
    props,
    'expandedTreeNodes',
    props.onExpandedTreeNodesChange,
    {
      defaultExpandedTreeNodes: props.defaultSelectedRowKeys || [],
    },
  );

  const oldExpandedTreeNode = usePrevious(tExpandedTreeNode);

  const [changedExpandTreeNode, setChangedExpandTreeNode] = useState<{
    type?: TableTreeExpandType;
    row?: TableRowData;
    rowIndex?: number;
  }>({ type: 'props-change' });

  /**
   * 对外暴露的组件实例方法，展开所有节点
   */
  function expandAll(type: 'expand-all' | 'default-expand-all' = 'expand-all', list?: TableRowData[]) {
    const newData = list || data;
    const expandedData = store.expandAll(newData, rowDataKeys);
    setDataSource(expandedData);
    const expandedNode = expandedData.map((t) => getUniqueRowValue(t, rowDataKeys.rowKey));
    setTExpandedTreeNode(expandedNode, {
      row: undefined,
      rowState: undefined,
      rowIndex: undefined,
      type: 'expand',
      trigger: type,
    });
    setChangedExpandTreeNode({ type: 'expand-all' });
  }

  /**
   * 对外暴露的组件实例方法，收起所有节点
   */
  function foldAll() {
    setDataSource([...store.foldAll(dataSource, rowDataKeys)]);
    setTExpandedTreeNode([], {
      row: undefined,
      rowState: undefined,
      rowIndex: undefined,
      type: 'fold',
      trigger: 'fold-all',
    });
  }

  function onExpandFoldIconClick(
    p: { row: TableRowData; rowIndex: number },
    trigger?: 'expand-fold-icon' | 'row-click',
  ) {
    const { row, rowIndex } = p;
    setChangedExpandTreeNode({
      type: 'user-reaction-change',
      ...p,
    });
    const rowValue = getUniqueRowValue(row, rowDataKeys.rowKey);
    const rowState = store.treeDataMap.get(rowValue);
    let expandedNodes = [...tExpandedTreeNode];
    if (rowState.expanded) {
      const expandedChildrenKeys = store.getExpandedChildrenKeys([row], rowDataKeys);
      for (let i = 0, len = expandedNodes.length; i < len; i++) {
        const nodeValue = expandedNodes[i];
        if (expandedChildrenKeys.includes(nodeValue)) {
          expandedNodes[i] = undefined;
        }
      }
      expandedNodes = expandedNodes.filter(Boolean);
    } else {
      expandedNodes.push(rowValue);
    }
    const params = {
      row,
      rowIndex,
      rowState,
      trigger,
    };
    setTExpandedTreeNode(expandedNodes, {
      ...params,
      type: rowState.expanded ? 'fold' : 'expand',
    });
    props.onTreeExpandChange?.(params);
  }

  function updateExpandState(
    data: TableRowData[],
    tExpandedTreeNode: (string | number)[],
    oldExpandedTreeNode: (string | number)[] = [],
  ) {
    const { addedList, removedList } = diffExpandedTreeNode(tExpandedTreeNode, oldExpandedTreeNode || []);
    store.expandTreeNode(addedList, data, rowDataKeys);
    store.foldTreeNode(removedList, data, rowDataKeys);
    return data;
  }

  useEffect(() => {
    if (!store.treeDataMap.size) return;
    if (changedExpandTreeNode.type === 'user-reaction-change') {
      const { row, rowIndex } = changedExpandTreeNode || {};
      // 受控模式下，`tExpandedTreeNode` 此时已经是父组件回传的最新展开节点列表，
      // 以它作为唯一事实来源显式计算目标展开状态，而不是无条件做布尔反转。
      const rowValue = getUniqueRowValue(row, rowDataKeys.rowKey);
      const willExpand = tExpandedTreeNode.includes(rowValue);
      const currentRowState = store.treeDataMap.get(rowValue);
      // store 内部状态已经与受控目标状态一致时，
      // 无需再次切换，避免多余的重渲染。
      if (currentRowState && currentRowState.expanded !== willExpand) {
        const newData = store.toggleExpandData(
          { row, rowIndex },
          dataSource,
          rowDataKeys,
          willExpand ? 'expand' : 'fold',
        );
        setDataSource([...newData]);
      }
    } else if (changedExpandTreeNode.type === 'props-change') {
      updateExpandState([...dataSource], tExpandedTreeNode, oldExpandedTreeNode);
    }
    if (changedExpandTreeNode.type !== 'props-change') {
      setChangedExpandTreeNode({ type: 'props-change' });
    }
    // eslint-disable-next-line
  }, [tExpandedTreeNode]);

  const updateExpandOnDataChange = (data: TableRowData[]) => {
    if (tree?.defaultExpandAll && !isDefaultExpandAllExecute) {
      expandAll('default-expand-all', [...data]);
      setIsDefaultExpandAllExecute(true);
      return;
    }

    const newData = updateExpandState([...data], tExpandedTreeNode, []);
    setDataSource([...newData]);
  };

  return {
    expandAll,
    foldAll,
    onExpandFoldIconClick,
    updateExpandOnDataChange,
  };
}

export default useTreeDataExpand;
