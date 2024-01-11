import { useEffect, useRef, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useUpdateEffect from '../../_util/useUpdateEffect';
import usePrevious from '../../hooks/usePrevious';
import TreeStore from '../../_common/js/tree-v1/tree-store';
import { usePersistFn } from '../../_util/usePersistFn';

import type { TdTreeProps } from '../type';
import type { TypeEventState } from '../interface';
import type { TypeTreeNodeData } from '../../_common/js/tree-v1/types';

export function useStore(props: TdTreeProps, refresh: () => void): TreeStore {
  const storeRef = useRef<TreeStore>();
  const [filterChanged, toggleFilterChanged] = useState(false);
  const [prevExpanded, changePrevExpanded] = useState(null);
  const {
    data,
    keys,
    expandAll,
    expandParent,
    expanded,
    expandLevel,
    expandMutex,
    activable,
    activeMultiple,
    actived,
    disabled,
    draggable,
    checkable,
    value,
    checkStrictly,
    load,
    lazy,
    valueMode,
    filter,
    onLoad,
    allowFoldNodeOnFilter = false,
  } = props;

  const preFilter = usePrevious(filter);

  useEffect(() => {
    if (!allowFoldNodeOnFilter) return;
    toggleFilterChanged(JSON.stringify(preFilter) !== JSON.stringify(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, allowFoldNodeOnFilter]);

  // 在 update 之后检查，如果之前 filter 有变更，则检查路径节点是否需要展开
  // 如果 filter 属性被清空，则重置为开启搜索之前的结果
  const expandFilterPath = () => {
    if (!allowFoldNodeOnFilter || !filterChanged) return;
    // 确保 filter 属性未变更时，不会重复检查展开状态
    toggleFilterChanged(false);
    const store = storeRef.current;
    if (props.filter) {
      if (!prevExpanded) changePrevExpanded(store.getExpanded()); // 缓存之前的展开状态

      // 展开搜索命中节点的路径节点
      const pathValues = [];
      const allNodes = store.getNodes();
      allNodes.forEach((node) => {
        if (node.vmIsLocked) {
          pathValues.push(node.value);
        }
      });
      store.setExpanded(pathValues);
    } else if (prevExpanded) {
      // filter 属性置空，还原最开始的展开状态
      store.replaceExpanded(prevExpanded);
      changePrevExpanded(null);
    }
  };

  // 传入 TreeStore 中调用的，但是每次都需要使用最新的值，所以使用 usePersistFn
  const handleUpdate = usePersistFn(() => {
    expandFilterPath();
    refresh();
  });

  const getExpandedArr = (arr: TdTreeProps['expanded'], store: TreeStore) => {
    const expandedMap = new Map();
    arr.forEach((val) => {
      expandedMap.set(val, true);
      if (expandParent) {
        const node = store.getNode(val);
        node.getParents().forEach((tn) => {
          expandedMap.set(tn.value, true);
        });
      }
    });
    return Array.from(expandedMap.keys());
  };

  const createStore = () => {
    const store = new TreeStore({
      keys,
      activable,
      activeMultiple,
      checkable,
      checkStrictly,
      expandAll,
      expandLevel,
      expandMutex,
      expandParent,
      disabled,
      draggable,
      load,
      lazy,
      valueMode,
      filter,
      onLoad: (info: TypeEventState) => {
        const { node } = info;
        onLoad?.({
          node: node.getModel(),
        });
      },
      onUpdate: handleUpdate,
      allowFoldNodeOnFilter,
    });

    // 初始化 store 的节点排列 + 状态
    let list = cloneDeep(data);
    if (!Array.isArray(list)) {
      list = [];
    }

    store.append(list as Array<TypeTreeNodeData>);

    // 刷新节点，必须在配置选中之前执行
    // 这样选中态联动判断才能找到父节点
    store.refreshNodes();

    // 初始化选中状态
    if (Array.isArray(value)) {
      store.setChecked(value);
    }

    // 初始化展开状态
    if (Array.isArray(expanded)) {
      const expandedArr = getExpandedArr(expanded, store);
      store.setExpanded(expandedArr);
    }

    // 初始化激活状态
    if (Array.isArray(actived)) {
      store.setActived(actived);
    }

    store.refreshNodes();
    return store;
  };

  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  /* ======== 由 props 引发的 store 更新 ======= */
  const store = storeRef.current;

  useUpdateEffect(() => {
    if (data && Array.isArray(data)) {
      const expanded = store.getExpanded();
      const checked = store.getChecked();
      const actived = store.getActived();
      store.removeAll();
      store.append(data as Array<TypeTreeNodeData>);
      store.setChecked(checked);
      store.setActived(actived);
      store.setExpanded(expanded);
    }
  }, [data, store]);

  useUpdateEffect(() => {
    store.setConfig({
      keys,
      expandAll,
      expandLevel,
      expandMutex,
      expandParent,
      activable,
      activeMultiple,
      disabled,
      checkable,
      checkStrictly,
      load,
      lazy,
      valueMode,
    });

    store.refreshState();
  }, [
    activable,
    activeMultiple,
    checkStrictly,
    checkable,
    disabled,
    expandAll,
    expandLevel,
    expandMutex,
    expandParent,
    keys,
    lazy,
    load,
    store,
    valueMode,
  ]);

  useUpdateEffect(() => {
    if (Array.isArray(value)) {
      store.replaceChecked(value);
    }
  }, [store, value, data]);

  useUpdateEffect(() => {
    if (Array.isArray(expanded)) {
      const expandedArr = getExpandedArr(expanded, store);
      store.replaceExpanded(expandedArr);
    }
  }, [expanded, store]);

  useUpdateEffect(() => {
    if (Array.isArray(actived)) {
      store.replaceActived(actived);
    }
  }, [actived, store]);

  useUpdateEffect(() => {
    store.setConfig({
      filter,
    });
    store.updateAll();
  }, [filter, store]);

  return storeRef.current;
}
