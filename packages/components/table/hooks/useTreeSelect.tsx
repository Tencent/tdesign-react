import { useEffect, useMemo, useState } from 'react';
import { get } from 'lodash-es';

import type { KeysType, TableTreeDataMap, TreeDataMapType } from '@tdesign/common-js/table/tree-store';
import type { PrimaryTableCol, TableRowData, TdEnhancedTableProps, TdPrimaryTableProps } from '../type';

import useControlled from '../../hooks/useControlled';

export interface GetChildrenDataReturnValue {
  allChildren: Array<any>;
  allChildrenKeys: Array<string | number>;
  leafNodeKeys: Array<string | number>;
}

export function getChildrenData(
  treeDataMap: TreeDataMapType,
  data: TableRowData,
  keys: { childrenKey: string; rowKey: string },
  r?: GetChildrenDataReturnValue,
): GetChildrenDataReturnValue {
  const result = r || { allChildren: [], allChildrenKeys: [], leafNodeKeys: [] };
  const children = get(data, keys.childrenKey);

  if (!children || !children.length) return result;

  const selectableChildren = children.filter((item: TableRowData) => {
    const itemKey = get(item, keys.rowKey);
    const mapValue = treeDataMap.get(itemKey);
    return !mapValue?.disabled;
  });

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
    const nodeState = treeDataMap.get(key);
    if (nodeState?.row) {
      result.push(nodeState.row);
    }
  }
  return result;
}

type SelectChangeParams = Parameters<TdPrimaryTableProps['onSelectChange']>;

export interface UseTreeSelectOptions {
  treeDataMap: TableTreeDataMap;
}

export default function useTreeSelect(props: TdEnhancedTableProps, options: UseTreeSelectOptions) {
  const { tree, rowKey, data, indeterminateSelectedRowKeys } = props;
  const { treeDataMap } = options;

  const [innerSelectedRowKeys, setInnerSelectedRowKeys] = useControlled(
    props,
    'selectedRowKeys',
    props.onSelectChange,
    {
      defaultSelectedRowKeys: props.defaultSelectedRowKeys || [],
    },
  );

  const [innerIndeterminateSelectedRowKeys, setInnerIndeterminateSelectedRowKeys] = useState([]);

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
  }, [innerSelectedRowKeys, data, tree, treeDataMap]);

  function updateIndeterminateState() {
    if (!innerSelectedRowKeys.length || tree.checkStrictly) {
      setInnerIndeterminateSelectedRowKeys([]);
      return;
    }

    const indeterminateKeys = new Set<string | number>();

    const checkNodeIndeterminate = (nodeId: string | number) => {
      const nodeState = treeDataMap.get(nodeId);
      if (!nodeState) return false;

      if (innerSelectedRowKeys.includes(nodeId)) return false;
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
      const selectedEnabledChildren = enabledChildrenKeys.filter((key) => innerSelectedRowKeys.includes(key));
      const selectedDisabledChildren = disabledChildrenKeys.filter((key) => innerSelectedRowKeys.includes(key));

      const isIndeterminate =
        // 部分可选子节点被选中
        (selectedEnabledChildren.length > 0 && selectedEnabledChildren.length < enabledChildrenKeys.length) ||
        // 部分禁用子节点被选中
        selectedDisabledChildren.length > 0 ||
        // 所有可选子节点都被选中，但存在未选中的禁用子节点
        (selectedEnabledChildren.length === enabledChildrenKeys.length &&
          enabledChildrenKeys.length > 0 &&
          disabledChildrenKeys.length > selectedDisabledChildren.length) ||
        // 任意子项处于半选状态
        indeterminateChildren.length > 0;

      if (isIndeterminate) {
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

    setInnerIndeterminateSelectedRowKeys([...indeterminateKeys]);
  }

  function updateParentCheckedState(
    selectedKeys: (string | number)[],
    currentRowKey: string | number,
    type: 'check' | 'uncheck',
  ) {
    if (!tree || tree.checkStrictly) return selectedKeys;
    const keys = [...selectedKeys];
    const state = treeDataMap.get(currentRowKey);
    let parentTmp = state.parent;

    while (parentTmp) {
      const allChildren = get(parentTmp.row, rowDataKeys.childrenKey) || [];

      const directChildrenKeys: (string | number)[] = [];
      const enabledDirectChildrenKeys: (string | number)[] = [];
      const disabledDirectChildrenKeys: (string | number)[] = [];

      allChildren.forEach((child) => {
        const childKey = get(child, rowDataKeys.rowKey);
        const childState = treeDataMap.get(childKey);
        directChildrenKeys.push(childKey);
        if (childState?.disabled) {
          disabledDirectChildrenKeys.push(childKey);
        } else {
          enabledDirectChildrenKeys.push(childKey);
        }
      });

      const selectedEnabledChildren = enabledDirectChildrenKeys.filter((key) => selectedKeys.includes(key));
      const selectedDisabledChildren = disabledDirectChildrenKeys.filter((key) => selectedKeys.includes(key));

      const selectedIndex = keys.indexOf(parentTmp.id);

      if (type === 'uncheck') {
        // 取消选择时，如果没有禁用的子节点被选中，则取消选择父节点
        if (selectedDisabledChildren.length === 0) {
          selectedIndex !== -1 && keys.splice(selectedIndex, 1);
        }
      } else {
        // 当所有直接子节点都被选中时，才选中父节点
        const allEnabledChildrenSelected =
          enabledDirectChildrenKeys.length > 0 && selectedEnabledChildren.length === enabledDirectChildrenKeys.length;
        const allDisabledChildrenSelected =
          disabledDirectChildrenKeys.length === 0 ||
          selectedDisabledChildren.length === disabledDirectChildrenKeys.length;

        const shouldSelectParent = allEnabledChildrenSelected && allDisabledChildrenSelected;

        if (shouldSelectParent) {
          selectedIndex === -1 && keys.push(parentTmp.id);
        } else {
          // 如果不满足选中条件，确保父节点不被选中
          selectedIndex !== -1 && keys.splice(selectedIndex, 1);
        }
      }

      parentTmp = parentTmp.parent;
    }
    return keys;
  }

  function onInnerSelectChange(rowKeys: SelectChangeParams[0], extraData: SelectChangeParams[1]) {
    if (!tree || tree.checkStrictly) {
      setInnerSelectedRowKeys?.(rowKeys, extraData);
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

    const selectedNotInCurrentData = innerSelectedRowKeys?.filter((key) => !selectableRowKeys.includes(key)) || [];

    const newRowKeys =
      extraData?.type === 'check' ? [...selectedNotInCurrentData, ...selectableRowKeys] : selectedNotInCurrentData;

    const newExtraData = {
      ...extraData,
      selectedRowData: extraData?.type === 'check' ? selectableRowData : [],
    };
    setInnerSelectedRowKeys?.(newRowKeys, newExtraData);
  }

  // 检查节点是否存在未选中的禁用后代节点
  const hasUnselectedDisabledDescendant = (row: TableRowData, selectedKeys: (string | number)[]): boolean => {
    const children = get(row, rowDataKeys.childrenKey) || [];
    for (const child of children) {
      const childKey = get(child, rowDataKeys.rowKey);
      const childState = treeDataMap.get(childKey);
      // 子节点是 disabled 且未被选中
      if (childState?.disabled && !selectedKeys.includes(childKey)) {
        return true;
      }
      // 递归检查后代
      if (hasUnselectedDisabledDescendant(child, selectedKeys)) {
        return true;
      }
    }
    return false;
  };

  function handleSelect(rowKeys: SelectChangeParams[0], extraData: SelectChangeParams[1]) {
    let newRowKeys = [...rowKeys];
    let newType = extraData.type;

    const isIndeterminate = innerIndeterminateSelectedRowKeys.includes(extraData.currentRowKey);

    if (extraData.type === 'check' && isIndeterminate) {
      // 点击「半选」节点时，需要判断：
      // 1) 所有可选（未禁用）项都被选中 → 「取消选中」所有可选项 -> uncheck
      // 2) 仍存在可选项 → 「选中」所有可选项 -> check
      const children = getChildrenData(treeDataMap, extraData.currentRowData, rowDataKeys);

      const enabledChildrenKeys = children.allChildrenKeys.filter((key) => {
        const state = treeDataMap.get(key);
        return !state?.disabled;
      });

      const enabledLeafKeys = children.leafNodeKeys.filter((key) => {
        const state = treeDataMap.get(key);
        return !state?.disabled;
      });

      const selectedEnabledLeaves = enabledLeafKeys.filter((key) => innerSelectedRowKeys.includes(key));
      const allEnabledSelected = enabledLeafKeys.length > 0 && selectedEnabledLeaves.length === enabledLeafKeys.length;

      if (allEnabledSelected) {
        // 所有可选子节点都已选中 → 取消选中它们
        const result = removeChildrenKeys({
          selectedRowKeys: rowKeys,
          removeKeys: enabledChildrenKeys, // 只移除可选子节点，保留 disabled 的
        });
        newRowKeys = result.keys;

        // 同时移除当前行 key（check 行为自动加进来的）
        const currentRowKeyIndex = newRowKeys.indexOf(extraData.currentRowKey);
        if (currentRowKeyIndex !== -1) {
          newRowKeys.splice(currentRowKeyIndex, 1);
        }

        // 将有效操作类型改为 uncheck，用于后续父节点状态更新
        newType = 'uncheck';
      } else {
        // 仍有部分可选子节点未选中 → 选中所有可选子节点
        newRowKeys = [...new Set(newRowKeys.concat(enabledChildrenKeys))];

        // 收集需要移除的 key（这些父节点只能是半选态，不能是全选态）
        const keysToRemove: (string | number)[] = [];

        // 检查当前节点
        if (hasUnselectedDisabledDescendant(extraData.currentRowData, newRowKeys)) {
          keysToRemove.push(extraData.currentRowKey);
        }

        // 检查子树中所有"非叶子节点"
        for (const childKey of enabledChildrenKeys) {
          const childState = treeDataMap.get(childKey);
          if (childState?.row) {
            const grandChildren = get(childState.row, rowDataKeys.childrenKey);
            if (grandChildren?.length && hasUnselectedDisabledDescendant(childState.row, newRowKeys)) {
              keysToRemove.push(childKey);
            }
          }
        }

        // 移除这些只能处于半选态的节点
        newRowKeys = newRowKeys.filter((key) => !keysToRemove.includes(key));
      }
    } else if (extraData.type === 'check') {
      const result = getChildrenData(treeDataMap, extraData.currentRowData, rowDataKeys);
      const { allChildrenKeys } = result;
      newRowKeys = [...new Set(newRowKeys.concat(allChildrenKeys))];

      // 判断节点是否存在「未选中的 disabled 后代」
      // 如果存在，该节点不能是选中态，只能是半选态
      // 收集需要移除的节点
      const keysToRemove: (string | number)[] = [];

      // 检查当前节点
      if (hasUnselectedDisabledDescendant(extraData.currentRowData, newRowKeys)) {
        keysToRemove.push(extraData.currentRowKey);
      }

      // 检查子树中的父节点
      for (const childKey of allChildrenKeys) {
        const childState = treeDataMap.get(childKey);
        if (childState?.row) {
          const grandChildren = get(childState.row, rowDataKeys.childrenKey);
          if (grandChildren?.length && hasUnselectedDisabledDescendant(childState.row, newRowKeys)) {
            keysToRemove.push(childKey);
          }
        }
      }

      // 移除这些节点
      newRowKeys = newRowKeys.filter((key) => !keysToRemove.includes(key));
    } else if (extraData.type === 'uncheck') {
      const children = getChildrenData(treeDataMap, extraData.currentRowData, rowDataKeys);
      const result = removeChildrenKeys({
        selectedRowKeys: rowKeys,
        removeKeys: children.allChildrenKeys,
      });
      newRowKeys = result.keys;
    }

    // 更新父节点的选中状态
    newRowKeys = updateParentCheckedState(newRowKeys, extraData.currentRowKey, newType);

    const newRowData = getRowDataByKeys({ treeDataMap, selectedRowKeys: newRowKeys });
    const newExtraData = {
      ...extraData,
      selectedRowData: newRowData,
    };

    setInnerSelectedRowKeys?.(newRowKeys, newExtraData);
  }

  return {
    innerIndeterminateSelectedRowKeys: indeterminateSelectedRowKeys || innerIndeterminateSelectedRowKeys,
    innerSelectedRowKeys,
    onInnerSelectChange,
  };
}
