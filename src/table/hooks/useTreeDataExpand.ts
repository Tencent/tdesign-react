import { useEffect, useState } from 'react';
import usePrevious from '../../hooks/usePrevious';
import { TdEnhancedTableProps, TableRowData } from '../type';
import useControlled from '../../hooks/useControlled';
import TableTreeStore, { diffExpandedTreeNode, getUniqueRowValue } from '../../_common/js/table/tree-store';
import { TableTreeExpandType } from '../interface';

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
    setDataSource(store.expandAll(newData, rowDataKeys));
    const expandedNode = dataSource.map((t) => getUniqueRowValue(t, rowDataKeys.rowKey));
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
    const { addedList, removedList } = diffExpandedTreeNode(tExpandedTreeNode, oldExpandedTreeNode);
    store.expandTreeNode(addedList, data, rowDataKeys);
    store.foldTreeNode(removedList, data, rowDataKeys);
    return data;
  }

  useEffect(() => {
    if (!store.treeDataMap.size) return;
    if (changedExpandTreeNode.type === 'user-reaction-change') {
      const { row, rowIndex } = changedExpandTreeNode || {};
      const newData = store.toggleExpandData({ row, rowIndex }, dataSource, rowDataKeys);
      setDataSource(newData);
    } else if (changedExpandTreeNode.type === 'props-change') {
      updateExpandState(dataSource, tExpandedTreeNode, oldExpandedTreeNode);
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
    } else if (tExpandedTreeNode?.length) {
      setTimeout(() => {
        const newData = updateExpandState([...data], tExpandedTreeNode, []);
        setDataSource(newData);
      });
    }
  };

  return {
    tExpandedTreeNode,
    expandAll,
    foldAll,
    onExpandFoldIconClick,
    updateExpandOnDataChange,
  };
}

export default useTreeDataExpand;
