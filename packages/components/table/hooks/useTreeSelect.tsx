import { useEffect, useMemo, useState } from 'react';
import { get, intersection } from 'lodash-es';

import type { KeysType, TableTreeDataMap, TreeDataMapType } from '@tdesign/common-js/table/tree-store';
import useControlled from '../../hooks/useControlled';

import type { PrimaryTableCol, TableRowData, TdEnhancedTableProps, TdPrimaryTableProps } from '../type';

export interface GetChildrenDataReturnValue {
  allChildren: Array<any>;
  allChildrenKeys: Array<string | number>;
  leafNodeKeys: Array<string | number>;
}

// 保存子节点信息，避免重复计算
export const childrenMap = new Map();

export function getChildrenData(
  treeDataMap: TreeDataMapType,
  data: TableRowData,
  keys: { childrenKey: string; rowKey: string },
  r?: GetChildrenDataReturnValue,
): GetChildrenDataReturnValue {
  if (childrenMap.get(data)) return childrenMap.get(data);
  const result = r || { allChildren: [], allChildrenKeys: [], leafNodeKeys: [] };
  const children = get(data, keys.childrenKey);
  if (!children || !children.length) return result;
  const selectableChildren = children.filter(
    (item: TableRowData) => !treeDataMap.get(get(item, keys.rowKey))?.disabled,
  );
  result.allChildren = [...new Set(result.allChildren.concat(selectableChildren))];
  for (let i = 0, len = children.length; i < len; i++) {
    const tItem = children[i];
    const c = get(tItem, keys.childrenKey);
    if (c?.length) {
      const nextLevelData = getChildrenData(treeDataMap, tItem, keys, result);
      result.allChildren = [...new Set(result.allChildren.concat(nextLevelData.allChildren))];
    }
  }
  // 避免使用 forEach，减少上下文消耗
  for (let i = 0, len = result.allChildren.length; i < len; i++) {
    const item = result.allChildren[i];
    const children = get(item, keys.childrenKey);
    const rowValue = get(item, keys.rowKey);
    result.allChildrenKeys.push(rowValue);
    if (!children || !children.length) {
      result.leafNodeKeys.push(rowValue);
    }
  }
  result.allChildrenKeys = [...new Set(result.allChildrenKeys)];
  result.leafNodeKeys = [...new Set(result.leafNodeKeys)];
  return result;
}

export interface RemoveParams {
  // 当前选中的数据
  selectedRowKeys: Array<string | number>;
  // 需要移除的数据
  removeKeys: Array<string | number>;
}

export interface RemainData {
  data: Array<any>;
  keys: Array<string | number>;
}

export function removeChildrenKeys(p: RemoveParams, r?: RemainData): RemainData {
  const { selectedRowKeys, removeKeys } = p;
  const result = r || { data: [], keys: [] };
  for (let i = 0, len = selectedRowKeys.length; i < len; i++) {
    const key = selectedRowKeys[i];
    if (!removeKeys.includes(key)) {
      result.keys.push(key);
    }
  }
  return result;
}

export interface GetKeyDataParams {
  treeDataMap: TreeDataMapType;
  data: Array<any>;
  column: PrimaryTableCol;
  keys: KeysType;
}

export interface GetRowDataParams {
  treeDataMap: TreeDataMapType;
  selectedRowKeys: Array<string | number>;
}

export function getRowDataByKeys(p: GetRowDataParams) {
  const { treeDataMap, selectedRowKeys } = p;
  const result = [];
  for (let i = 0, len = selectedRowKeys.length; i < len; i++) {
    const key = selectedRowKeys[i];
    result.push(treeDataMap.get(key));
  }
  return result;
}

type SelectChangeParams = Parameters<TdPrimaryTableProps['onSelectChange']>;

export default function useTreeSelect(props: TdEnhancedTableProps, treeDataMap: TableTreeDataMap) {
  const { tree, rowKey, data, indeterminateSelectedRowKeys } = props;
  // 半选状态的节点：子节点选中至少一个，且没有全部选中
  const [tIndeterminateSelectedRowKeys, setTIndeterminateSelectedRowKeys] = useState([]);
  // eslint-disable-next-line
  const [tSelectedRowKeys, setTSelectedRowKeys] = useControlled(props, 'selectedRowKeys', props.onSelectChange, {
    defaultSelectedRowKeys: props.defaultSelectedRowKeys || [],
  });

  const rowDataKeys = useMemo(
    () => ({
      rowKey: rowKey || 'id',
      childrenKey: tree?.childrenKey || 'children',
    }),
    [rowKey, tree?.childrenKey],
  );

  useEffect(() => {
    if (!tree || !treeDataMap.size) return;
    updateIndeterminateState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tSelectedRowKeys, data, tree, treeDataMap]);

  function updateIndeterminateState() {
    if (!tree) return;
    if (!tSelectedRowKeys.length || tree.checkStrictly) {
      setTIndeterminateSelectedRowKeys([]);
      return;
    }

    const indeterminateKeys = new Set<string | number>();

    const checkNodeIndeterminate = (nodeId: string | number) => {
      const nodeState = treeDataMap.get(nodeId);
      if (!nodeState) return false;

      if (tSelectedRowKeys.includes(nodeId)) return false;
      if (indeterminateKeys.has(nodeId)) return true;

      const allChildren = get(nodeState.row, rowDataKeys.childrenKey) || [];
      if (!allChildren.length) return false;

      const enabledChildrenKeys: (string | number)[] = [];
      const disabledChildrenKeys: (string | number)[] = [];

      allChildren.forEach((child) => {
        const childKey = get(child, rowDataKeys.rowKey);
        const childState = treeDataMap.get(childKey);

        if (childState?.disabled) {
          disabledChildrenKeys.push(childKey);
        } else {
          enabledChildrenKeys.push(childKey);
        }
      });

      const allChildrenKeys = [...enabledChildrenKeys, ...disabledChildrenKeys];

      const indeterminateChildren = allChildrenKeys.filter((key) => checkNodeIndeterminate(key));
      const selectedSelectableChildren = enabledChildrenKeys.filter((key) => tSelectedRowKeys.includes(key));
      const selectedDisabledChildren = disabledChildrenKeys.filter((key) => tSelectedRowKeys.includes(key));

      const shouldBeIndeterminate =
        // 部分可选子节点被选中
        (selectedSelectableChildren.length > 0 && selectedSelectableChildren.length < enabledChildrenKeys.length) ||
        // 部分可选子节点被选中
        selectedDisabledChildren.length > 0 ||
        // 所有可选子节点都被选中，但存在未选中的禁用子节点
        (selectedSelectableChildren.length === enabledChildrenKeys.length &&
          enabledChildrenKeys.length > 0 &&
          disabledChildrenKeys.length > selectedDisabledChildren.length) ||
        // 任意子项处于半选状态
        indeterminateChildren.length > 0;

      if (shouldBeIndeterminate) {
        indeterminateKeys.add(nodeId);
        return true;
      }

      return false;
    };

    treeDataMap.forEach((nodeState, nodeId) => {
      const children = get(nodeState.row, rowDataKeys.childrenKey);
      if (children?.length) {
        checkNodeIndeterminate(nodeId);
      }
    });

    setTIndeterminateSelectedRowKeys([...indeterminateKeys]);
  }

  function updateParentCheckedState(
    selectedKeys: (string | number)[],
    currentRowKey: string | number,
    type: 'check' | 'uncheck',
  ) {
    if (!tree || tree.checkStrictly) return;
    const keys = [...selectedKeys];
    const state = treeDataMap.get(currentRowKey);
    let parentTmp = state.parent;
    while (parentTmp) {
      const { leafNodeKeys } = getChildrenData(treeDataMap, parentTmp.row, rowDataKeys);
      const checkedChildrenKeys = intersection(leafNodeKeys, selectedKeys);

      const allChildren = get(parentTmp.row, rowDataKeys.childrenKey) || [];

      const allLeafNodeKeys: (string | number)[] = [];
      const collectAllLeafNodes = (nodes: TableRowData[]) => {
        nodes.forEach((node) => {
          const children = get(node, rowDataKeys.childrenKey);
          if (!children || !children.length) {
            allLeafNodeKeys.push(get(node, rowDataKeys.rowKey));
          } else {
            collectAllLeafNodes(children);
          }
        });
      };
      collectAllLeafNodes(allChildren);

      const disabledSelectedChildren = allLeafNodeKeys.filter((key) => {
        const nodeState = treeDataMap.get(key);
        return nodeState?.disabled && selectedKeys.includes(key);
      });

      const selectedIndex = keys.indexOf(parentTmp.id);
      if (type === 'uncheck') {
        // disabled 的子节点被选中，父节点也保持半选状态
        if (disabledSelectedChildren.length === 0) {
          selectedIndex !== -1 && keys.splice(selectedIndex, 1);
        }
      } else if (checkedChildrenKeys.length === leafNodeKeys.length && disabledSelectedChildren.length === 0) {
        // 只有当所有可选子节点都选中，且没有 disabled 子节点被选中时，才选中父节点
        selectedIndex === -1 && keys.push(parentTmp.id);
      }
      parentTmp = parentTmp.parent;
    }
    return keys;
  }

  function onInnerSelectChange(rowKeys: SelectChangeParams[0], extraData: SelectChangeParams[1]) {
    if (!tree || tree.checkStrictly) {
      setTSelectedRowKeys(rowKeys, extraData);
      return;
    }
    if (extraData.currentRowKey === 'CHECK_ALL_BOX') {
      handleSelectAll(extraData);
    } else {
      handleSelect(rowKeys, extraData);
    }
  }

  function handleSelectAll(extraData: SelectChangeParams[1]) {
    const selectableRowKeys: Array<string | number> = [];
    const selectableRowData: TableRowData[] = [];
    const arr = [...treeDataMap.values()];
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      if (!item?.disabled) {
        selectableRowData.push(item.row);
        selectableRowKeys.push(get(item.row, rowDataKeys.rowKey));
      }
    }

    const selectedNotInCurrentData = tSelectedRowKeys?.filter((key) => !selectableRowKeys.includes(key)) || [];

    const newRowKeys =
      extraData?.type === 'check' ? [...selectedNotInCurrentData, ...selectableRowKeys] : selectedNotInCurrentData;

    const newExtraData = {
      ...extraData,
      selectedRowData: extraData?.type === 'check' ? selectableRowData : [],
    };
    setTSelectedRowKeys(newRowKeys, newExtraData);
  }

  function handleSelect(rowKeys: SelectChangeParams[0], extraData: SelectChangeParams[1]) {
    let newRowKeys = [...rowKeys];
    if (tree.checkStrictly === false) {
      if (extraData.type === 'check') {
        const result = getChildrenData(treeDataMap, extraData.currentRowData, rowDataKeys);
        const { allChildrenKeys } = result;
        childrenMap.set(extraData.currentRowData, result);
        newRowKeys = [...new Set(newRowKeys.concat(allChildrenKeys))];
      } else if (extraData.type === 'uncheck') {
        const children = getChildrenData(treeDataMap, extraData.currentRowData, rowDataKeys);
        const result = removeChildrenKeys({
          selectedRowKeys: rowKeys,
          removeKeys: children.allChildrenKeys,
        });
        newRowKeys = result.keys;
      }
    }
    newRowKeys = updateParentCheckedState(newRowKeys, extraData.currentRowKey, extraData.type);
    const newRowData = getRowDataByKeys({ treeDataMap, selectedRowKeys: newRowKeys });
    const newExtraData = {
      ...extraData,
      selectedRowData: newRowData,
    };
    setTSelectedRowKeys(newRowKeys, newExtraData);
  }

  return {
    // 如果存在受控属性 indeterminateSelectedRowKeys 则优先使用；否则使用内部状态：tIndeterminateSelectedRowKeys
    tIndeterminateSelectedRowKeys: indeterminateSelectedRowKeys || tIndeterminateSelectedRowKeys,
    onInnerSelectChange,
  };
}
