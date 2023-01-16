import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import {
  AddRectangleIcon as TdAddRectangleIcon,
  MinusRectangleIcon as TdMinusRectangleIcon,
} from 'tdesign-icons-react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import classNames from 'classnames';
import TableTreeStore, { SwapParams } from '../../_common/js/table/tree-store';
import { TdEnhancedTableProps, PrimaryTableCol, TableRowData, TableRowValue, TableRowState } from '../type';
import useClassName from './useClassName';
import { renderCell } from '../Cell';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useGlobalIcon from '../../hooks/useGlobalIcon';

export interface UseSwapParams<T> extends SwapParams<T> {
  data: T[];
}

export default function useTreeData(props: TdEnhancedTableProps) {
  const { data, columns, tree, rowKey, treeExpandAndFoldIcon } = props;
  const [store] = useState(new TableTreeStore() as InstanceType<typeof TableTreeStore>);
  const [treeNodeCol, setTreeNodeCol] = useState<PrimaryTableCol>(() => getTreeNodeColumnCol());
  const [dataSource, setDataSource] = useState<TdEnhancedTableProps['data']>(data || []);
  const { tableTreeClasses } = useClassName();
  const [locale, t] = useLocaleReceiver('table');
  const { AddRectangleIcon, MinusRectangleIcon } = useGlobalIcon({
    AddRectangleIcon: TdAddRectangleIcon,
    MinusRectangleIcon: TdMinusRectangleIcon,
  });

  const rowDataKeys = useMemo(
    () => ({
      rowKey: rowKey || 'id',
      childrenKey: tree?.childrenKey || 'children',
    }),
    [rowKey, tree?.childrenKey],
  );

  const checkedColumn = useMemo(() => columns.find((col) => col.colKey === 'row-select'), [columns]);

  const uniqueKeys = useMemo(
    () => store?.getAllUniqueKeys(data, rowDataKeys)?.join() || '',
    [data, rowDataKeys, store],
  );

  useEffect(() => {
    if (!store || !checkedColumn) return;
    // 第一次，不需要执行 updateDisabledState
    const rowValue = get(dataSource[0], rowDataKeys.rowKey);
    if (!store.treeDataMap.get(rowValue)) return;
    store.updateDisabledState(dataSource, checkedColumn, rowDataKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedColumn]);

  useEffect(
    () => {
      if (!data || !store) return;
      // 如果没有树形解构，则不需要相关逻辑
      if (!tree || !Object.keys(tree).length) {
        setDataSource(data);
        return;
      }
      resetData(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uniqueKeys],
  );

  useEffect(
    () => {
      const treeNodeColTmp = getTreeNodeColumnCol();
      setTreeNodeCol(treeNodeColTmp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, props.tree?.treeNodeColumnIndex],
  );

  function resetData(data: TableRowData[]) {
    let newVal = cloneDeep(data);
    store.initialTreeStore(newVal, props.columns, rowDataKeys);
    if (props.tree?.defaultExpandAll) {
      newVal = store.expandAll(newVal, rowDataKeys);
    }
    setDataSource(newVal);
  }

  function getTreeNodeStyle(level: number) {
    if (level === undefined) return;
    const indent = props.tree?.indent === undefined ? 24 : props.tree?.indent;
    // 默认 1px 是为了临界省略
    return indent ? { paddingLeft: `${level * indent || 1}px` } : {};
  }

  /**
   * 对外暴露的组件实例方法，展开或收起某一行
   * @param p 行数据
   */
  function toggleExpandData(p: { row: TableRowData; rowIndex: number }, trigger?: 'expand-fold-icon' | 'row-click') {
    const currentData = { ...p };
    // eslint-disable-next-line
    if (p.row.__VIRTUAL_SCROLL_INDEX !== undefined) {
      // eslint-disable-next-line
      currentData.rowIndex = p.row.__VIRTUAL_SCROLL_INDEX;
    }
    const newData = store.toggleExpandData(currentData, dataSource, rowDataKeys);
    setDataSource([...newData]);
    const rowValue = get(p.row, rowDataKeys.rowKey);
    props.onTreeExpandChange?.({
      row: p.row,
      rowIndex: p.rowIndex,
      rowState: store?.treeDataMap?.get(rowValue),
      trigger,
    });
  }

  function getTreeNodeColumnCol() {
    const { columns } = props;
    let treeNodeColumnIndex = props.tree?.treeNodeColumnIndex || 0;
    // type 存在，则表示表格内部渲染的特殊列，比如：展开行按钮、复选框、单选按钮等，不能作为树结点列。因此树结点展开列向后顺移
    while (
      columns[treeNodeColumnIndex]?.type ||
      columns[treeNodeColumnIndex]?.colKey === '__EXPAND_ROW_ICON_COLUMN__'
    ) {
      treeNodeColumnIndex += 1;
    }
    return columns[treeNodeColumnIndex];
  }

  function formatTreeColumn(col: PrimaryTableCol): PrimaryTableCol {
    if (!col || !treeNodeCol || !store) return {};
    if (!props.tree || !Object.keys(props.tree).length || col.colKey !== treeNodeCol.colKey) return col;
    const newCol = { ...treeNodeCol };
    newCol.cell = (p) => {
      const cellInfo = renderCell(
        { ...p, col: { ...treeNodeCol } },
        {
          cellEmptyContent: props.cellEmptyContent,
        },
      );
      const currentState = store.treeDataMap.get(get(p.row, rowDataKeys.rowKey));
      const colStyle = getTreeNodeStyle(currentState?.level);
      const classes = { [tableTreeClasses.inlineCol]: !!col.ellipsis };
      const childrenNodes = get(p.row, rowDataKeys.childrenKey);
      if ((childrenNodes && childrenNodes instanceof Array) || childrenNodes === true) {
        const expanded = store.treeDataMap.get(get(p.row, rowDataKeys.rowKey))?.expanded;
        const type = expanded ? 'fold' : 'expand';
        const defaultIconNode =
          t(locale.treeExpandAndFoldIcon, { type }) || (expanded ? <MinusRectangleIcon /> : <AddRectangleIcon />);
        const iconNode = treeExpandAndFoldIcon ? treeExpandAndFoldIcon({ type, ...p }) : defaultIconNode;
        return (
          <div className={classNames([tableTreeClasses.col, classes])} style={colStyle}>
            {!!(childrenNodes.length || childrenNodes === true) && (
              <span
                className={tableTreeClasses.icon}
                onClick={(e: MouseEvent<HTMLSpanElement>) => {
                  toggleExpandData({ ...p }, 'expand-fold-icon');
                  e.stopPropagation();
                }}
              >
                {iconNode}
              </span>
            )}
            {cellInfo}
          </div>
        );
      }
      return (
        <div style={colStyle} className={classNames([classes, tableTreeClasses.leafNode])}>
          <span className={tableTreeClasses.icon}></span>
          {cellInfo}
        </div>
      );
    };
    // 树形节点会显示操作符号 [+] 和 [-]，但省略显示的浮层中不需要操作符
    if (newCol.ellipsis === true) {
      newCol.ellipsis = (p) => renderCell({ ...p, col: { ...treeNodeCol } });
    }
    return newCol;
  }

  /**
   * 对外暴露的组件实例方法，设置行数据，自动刷新界面
   * @param key 当前行唯一标识值
   * @param newRowData 新行数据
   */
  function setData<T>(key: TableRowValue, newRowData: T) {
    const rowIndex = store.updateData(key, newRowData, dataSource, rowDataKeys);
    const newData = [...dataSource];
    newData[rowIndex] = newRowData;
    setDataSource([...newData]);
  }

  /**
   * 对外暴露的组件实例方法，获取当前行全部数据
   * @param key 行唯一标识
   * @returns {TableRowState} 当前行数据
   */
  function getData(key: TableRowValue): TableRowState {
    return store.getData(key);
  }

  /**
   * 对外暴露的组件实例方法，对外暴露的组件实例方法，移除指定节点
   * @param key 行唯一标识
   */
  function remove(key: TableRowValue) {
    // 引用传值，可自动更新 dataSource。（dataSource 本是内部变量，可以在任何地方进行任何改变）
    const newData = store.remove(key, dataSource, rowDataKeys);
    setDataSource([...newData]);
  }

  /**
   * 对外暴露的组件实例方法，为当前节点添加子节点，默认添加到最后一个节点
   * @param key 当前节点唯一标识
   * @param newData 待添加的新节点
   */
  function appendTo<T>(key: TableRowValue, newData: T | T[]) {
    if (!key) {
      setDataSource([...store.appendToRoot(newData, dataSource, rowDataKeys)]);
      return;
    }
    // 引用传值，可自动更新 dataSource。（dataSource 本是内部变量，可以在任何地方进行任何改变）
    setDataSource([...store.appendTo(key, newData, dataSource, rowDataKeys)]);
  }

  /**
   * 对外暴露的组件实例方法，当前节点之后，插入节点
   */
  function insertAfter<T>(rowValue: TableRowValue, newData: T) {
    setDataSource([...store.insertAfter(rowValue, newData, dataSource, rowDataKeys)]);
  }

  /**
   * 对外暴露的组件实例方法，当前节点之后，插入节点
   */
  function insertBefore<T>(rowValue: TableRowValue, newData: T) {
    setDataSource([...store.insertBefore(rowValue, newData, dataSource, rowDataKeys)]);
  }

  /**
   * 对外暴露的组件实例方法，展开所有节点
   */
  function expandAll() {
    setDataSource([...store.expandAll(dataSource, rowDataKeys)]);
  }

  /**
   * 对外暴露的组件实例方法，收起所有节点
   */
  function foldAll() {
    setDataSource([...store.foldAll(dataSource, rowDataKeys)]);
  }

  /**
   * 对外暴露的组件实例方法，交换行数据，React 在回掉函数函数中无法获取最新的 state 信息，因此需要参数 params.data
   */
  function swapData(params: UseSwapParams<TableRowData>) {
    const r = store.swapData(params.data, params, rowDataKeys);
    if (r.result) {
      setDataSource([...r.dataSource]);
    } else {
      const params = {
        code: r.code,
        reason: r.reason,
      };
      props.onAbnormalDragSort?.(params);
    }
  }

  /**
   * 对外暴露的组件实例方法，获取全部数据的树形结构
   * @param key 节点唯一标识
   */
  function getTreeNode() {
    return store.getTreeNode(dataSource, rowDataKeys);
  }

  /**
   * 对外暴露的组件实例方法，获取树形结构展开的节点
   */
  function getTreeExpandedRow(type: 'unique' | 'data' | 'all' = 'data') {
    return store.getTreeExpandedRow(dataSource, rowDataKeys, type);
  }

  return {
    store,
    rowDataKeys,
    dataSource,
    swapData,
    setData,
    getData,
    remove,
    appendTo,
    insertAfter,
    insertBefore,
    formatTreeColumn,
    toggleExpandData,
    expandAll,
    foldAll,
    getTreeNode,
    resetData,
    getTreeExpandedRow,
  };
}

export type UseTreeDataReturnType = ReturnType<typeof useTreeData>;
