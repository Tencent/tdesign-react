import React, { useEffect, useMemo, useState } from 'react';
import { AddRectangleIcon, MinusRectangleIcon } from 'tdesign-icons-react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import classNames from 'classnames';
import TableTreeStore from './tree-store';
import { TdEnhancedTableProps, PrimaryTableCol, TableRowData, TableRowValue, TableRowState } from '../type';
import useClassName from './useClassName';
import { renderCell } from '../TR';

export default function useTreeData(props: TdEnhancedTableProps) {
  const { data, columns, tree, rowKey } = props;
  const [store] = useState(new TableTreeStore() as InstanceType<typeof TableTreeStore>);
  const [treeNodeCol, setTreeNodeCol] = useState<PrimaryTableCol>();
  const [dataSource, setDataSource] = useState<TdEnhancedTableProps['data']>(data || []);
  const { tableTreeClasses } = useClassName();

  const rowDataKeys = useMemo(() => ({
    rowKey: rowKey || 'id',
    childrenKey: tree?.childrenKey || 'children',
  }), [rowKey, tree?.childrenKey]);

  // TODO：行选中会触发 tree 的变化。按理说，不应该
  useEffect(
    () => {
      if (!data || !store) return;
      // 如果没有树形解构，则不需要相关逻辑
      if (!tree || !Object.keys(tree).length) {
        setDataSource(data);
        return;
      }
      const newVal = cloneDeep(data);
      setDataSource(newVal);
      store.initialTreeStore(newVal, columns, rowDataKeys);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  useEffect(() => {
    // 如果没有树形解构，则不需要相关逻辑
    if (!tree || !Object.keys(tree).length) return;
    store.initialTreeStore(data, columns, rowDataKeys);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, rowDataKeys]);

  useEffect(
    () => {
      const treeNodeColTmp = getTreeNodeColumnCol();
      setTreeNodeCol(treeNodeColTmp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns]
  );

  function getTreeNodeStyle(level: number) {
    if (level === undefined) return;
    const indent = props.tree?.indent || 24;
    // 默认 1px 是为了临界省略
    return {
      paddingLeft: `${level * indent || 1}px`,
    };
  }

  /**
   * 组件实例方法，展开或收起某一行
   * @param p 行数据
   */
  function toggleExpandData(p: { row: TableRowData; rowIndex: number; trigger?: 'inner' }) {
    const newData = store.toggleExpandData(p, dataSource, rowDataKeys);
    setDataSource([...newData]);
    if (p.trigger === 'inner') {
      const rowValue = get(p.row, rowDataKeys.rowKey);
      props.onTreeExpandChange?.({
        row: p.row,
        rowIndex: p.rowIndex,
        rowState: store?.treeDataMap?.get(rowValue),
      });
    }
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

  function formatTreeColum(col: PrimaryTableCol): PrimaryTableCol {
    if (!col || !treeNodeCol || !store) return {};
    if (!props.tree || !Object.keys(props.tree).length || col.colKey !== treeNodeCol.colKey) return col;
    const newCol = { ...treeNodeCol };
    newCol.cell = (p) => {
      const cellInfo = renderCell({ ...p, col: { ...treeNodeCol } });
      const currentState = store.treeDataMap.get(get(p.row, rowDataKeys.rowKey));
      const colStyle = getTreeNodeStyle(currentState?.level);
      const classes = { [tableTreeClasses.inlineCol]: !!col.ellipsis };
      const childrenNodes = get(p.row, rowDataKeys.childrenKey);
      if (childrenNodes && childrenNodes instanceof Array) {
        const IconNode = store.treeDataMap.get(get(p.row, rowDataKeys.rowKey))?.expanded
          ? MinusRectangleIcon
          : AddRectangleIcon;
        return (
          <div className={classNames([tableTreeClasses.col, classes])} style={colStyle}>
            {!!childrenNodes.length && (
              <IconNode className={tableTreeClasses.icon} onClick={() => toggleExpandData({ ...p, trigger: 'inner' })} />
            )}
            {cellInfo}
          </div>
        );
      }
      return (
        <div style={colStyle} className={classNames(classes)}>
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
   * 组件实例方法，设置行数据，自动刷新界面
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
   * 组件实例方法，获取当前行全部数据
   * @param key 行唯一标识
   * @returns {TableRowState} 当前行数据
   */
  function getData(key: TableRowValue): TableRowState {
    return store.getData(key);
  }

  /**
   * 组件实例方法，移除指定节点
   * @param key 行唯一标识
   */
  function remove(key: TableRowValue) {
    // 引用传值，可自动更新 dataSource。（dataSource 本是内部变量，可以在任何地方进行任何改变）
    const newData = store.remove(key, dataSource, rowDataKeys);
    setDataSource([...newData]);
  }

  /**
   * 为当前节点添加子节点，默认添加到最后一个节点
   * @param key 当前节点唯一标识
   * @param newData 待添加的新节点
   */
  function appendTo<T>(key: TableRowValue, newData: T) {
    // 引用传值，可自动更新 dataSource。（dataSource 本是内部变量，可以在任何地方进行任何改变）
    const dataTmp = store.appendTo(key, newData, dataSource, rowDataKeys);
    setDataSource([...dataTmp]);
  }

  return {
    store,
    rowDataKeys,
    dataSource,
    setData,
    getData,
    remove,
    appendTo,
    formatTreeColum,
    toggleExpandData,
  };
}
