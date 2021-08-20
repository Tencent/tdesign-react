import { DataOption } from '@TdTypes/components/transfer';
import { usePersistFn } from '@tencent/tdesign-react/tree/usePersistFn';
import { useEffect, useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import TreeStore from '../_common/js/tree/tree-store';
import TreeNode from '../_common/js/tree/tree-node';
import { TypeEventState } from './interface';
import { TreeProps } from './interface/TreeProps';

export function useStore(props: TreeProps, refresh: () => void): TreeStore {
  const storeRef = useRef<TreeStore>();

  const {
    data,
    keys,
    expandAll,
    expandParent,
    // defaultExpanded,
    expanded,
    expandLevel,
    expandMutex,
    activable,
    activeMultiple,
    actived,
    disabled,
    checkable,
    // defaultValue,
    value,
    checkStrictly,
    load,
    lazy,
    valueMode,
    filter,
    onDataChange,
    onLoad,
  } = props;

  // 传入 TreeStore 中调用的，但是每次都需要使用最新的值，所以使用 usePersistFn
  const handleUpdate = usePersistFn(() => {
    refresh();
  });

  const handleReflow = usePersistFn(() => {
    if (!onDataChange) {
      return;
    }

    const nodes = storeRef.current.getNodes();

    const rootNodes = nodes.filter((v) => !v.parent);

    const getChild = (list: TreeNode[] | boolean) => {
      if (Array.isArray(list) && list.length > 0) {
        return list.map((v) => {
          const nodeData: DataOption = v.data;
          if (Array.isArray(v.children) && v.children.length > 0) {
            nodeData.children = getChild(v.children);
          }
          return nodeData;
        });
      }
    };

    const newData = getChild(rootNodes);

    if (!isEqual(newData, data)) {
      onDataChange?.(newData);
    }
  });

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
      load,
      lazy,
      valueMode,
      filter,
      onLoad: (info: TypeEventState) => {
        const e = new MouseEvent('load');
        const { node } = info;
        onLoad?.({
          node: node.getModel(),
          e,
        });
      },
      onUpdate: handleUpdate,
      onReflow: handleReflow,
    });

    // 初始化 store 的节点排列 + 状态
    let list = cloneDeep(data);
    if (!Array.isArray(list)) {
      list = [];
    }

    store.append(list);

    // 刷新节点，必须在配置选中之前执行
    // 这样选中态联动判断才能找到父节点
    store.refreshNodes();

    // 初始化选中状态
    if (Array.isArray(value)) {
      store.setChecked(value);
    }

    // 初始化展开状态
    if (Array.isArray(expanded)) {
      const expandedMap = new Map();
      expanded.forEach((val) => {
        expandedMap.set(val, true);
        if (expandParent) {
          const node = store.getNode(val);
          node.getParents().forEach((tn) => {
            expandedMap.set(tn.value, true);
          });
        }
      });
      const expandedArr = Array.from(expandedMap.keys());
      store.setExpanded(expandedArr);
    }

    // 初始化激活状态
    if (Array.isArray(actived)) {
      store.setActived(actived);
    }

    // refresh();

    store.refreshNodes();
    return store;
  };

  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  /* ======== 由 props 引发的 store 更新 ======= */
  const store = storeRef.current;

  useEffect(() => {
    if (data && Array.isArray(data)) {
      store.removeAll();
      store.append(data);
    }
  }, [data, store]);

  useEffect(() => {
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

  useEffect(() => {
    if (Array.isArray(value)) {
      store.replaceChecked(value);
    }
  }, [store, value]);

  useEffect(() => {
    if (Array.isArray(expanded)) {
      store.replaceExpanded(expanded);
    }
  }, [expanded, store]);

  useEffect(() => {
    if (Array.isArray(actived)) {
      store.replaceActived(actived);
    }
  }, [actived, store]);

  useEffect(() => {
    store.setConfig({
      filter,
    });
    store.updateAll();
  }, [filter, store]);

  return storeRef.current;
}
