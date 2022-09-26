import { useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';
// import isEqual from 'lodash/isEqual';
import useUpdateEffect from '../_util/useUpdateEffect';
// import { TreeOptionData } from '../common';
import TreeStore from '../_common/js/tree/tree-store';
// import TreeNode from '../_common/js/tree/tree-node';
import { usePersistFn } from '../_util/usePersistFn';
import { TdTreeProps } from './type';
import { TypeEventState } from './interface';

export function useStore(props: TdTreeProps, refresh: () => void): TreeStore {
  const storeRef = useRef<TreeStore>();

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
    // onDataChange,
    onLoad,
    allowFoldNodeOnFilter = false,
  } = props;

  // 传入 TreeStore 中调用的，但是每次都需要使用最新的值，所以使用 usePersistFn
  const handleUpdate = usePersistFn(() => {
    refresh();
  });

  // const handleReflow = usePersistFn(() => {
  //   if (!onDataChange) {
  //     return;
  //   }

  //   const nodes = storeRef.current.getNodes();

  //   const rootNodes = nodes.filter((v) => !v.parent);

  //   const getChild = (list: TreeNode[] | boolean) => {
  //     if (Array.isArray(list) && list.length > 0) {
  //       return list.map((v) => {
  //         const nodeData: TreeOptionData = v.data;
  //         if (Array.isArray(v.children) && v.children.length > 0) {
  //           nodeData.children = getChild(v.children);
  //         }
  //         return nodeData;
  //       });
  //     }
  //   };

  //   const newData = getChild(rootNodes);

  //   if (!isEqual(newData, data)) {
  //     onDataChange?.(newData);
  //   }
  // });

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
      // onReflow: handleReflow,
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
      const expandedArr = getExpandedArr(expanded, store);
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

  useUpdateEffect(() => {
    if (data && Array.isArray(data)) {
      const expanded = store.getExpanded();
      const checked = store.getChecked();
      const actived = store.getActived();
      store.removeAll();
      store.append(data);
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
  }, [store, value]);

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
