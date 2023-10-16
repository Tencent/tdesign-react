import { useEffect, useState } from 'react';
import pick from 'lodash/pick';

import { TreeStore } from '../../_common/js/tree/tree-store';
import usePrevious from '../../hooks/usePrevious';

import type { TdTreeProps, TreeNodeValue } from '../type';

export default function useTreeStore(props: TdTreeProps, state: any) {
  const {
    data = [],
    keys,
    filter,
    valueMode,
    expandParent,
    value: propsValue,
    actived: propsActived,
    expanded: propsExpanded,
  } = props;

  const { value, actived, expanded, updateState } = state;

  const store: TreeStore = new TreeStore({
    valueMode,
    filter: filter as any,
  });

  const [filterChanged, setFilterChanged] = useState(false);
  const [prevExpanded, setPrevExpanded] = useState(null);
  const [allNodes, setAllNodes] = useState([]);
  const prevFilter = usePrevious(filter);

  // 同步 Store 选项
  const updateStoreConfig = () => {
    // 统一更新选项，然后在 store 统一识别属性更新
    const storeProps = pick(props, [
      'expandAll',
      'expandLevel',
      'expandMutex',
      'expandParent',
      'activable',
      'activeMultiple',
      'disabled',
      'checkable',
      'draggable',
      'checkStrictly',
      'load',
      'lazy',
      'valueMode',
      'filter',
      'allowFoldNodeOnFilter',
    ]);

    store.setConfig(storeProps as any);
  };

  const updateExpanded = () => {
    if (!Array.isArray(state.expanded)) return;
    // 初始化展开状态
    // 校验是否自动展开父节点
    const expandedMap = new Map();
    state.expanded.forEach((val: string) => {
      expandedMap.set(val, true);
      if (expandParent) {
        const node = store.getNode(val);
        if (node) {
          node
            .getModel()
            .getParents()
            .forEach((tn: any) => {
              expandedMap.set(tn.value, true);
            });
        }
      }
    });
    const expandedArr = Array.from(expandedMap.keys());
    store.setExpanded(expandedArr);
  };

  // store 的 update 方法触发后，可以拿到搜索命中节点的路径节点
  // 所以在 update 之后检查，如果之前 filter 有变更，则检查路径节点是否需要展开
  // 如果 filter 属性被清空，则重置为开启搜索之前的结果
  const expandFilterPath = () => {
    if (!props.allowFoldNodeOnFilter) return;
    if (!filterChanged) return;
    // 确保 filter 属性未变更时，不会重复检查展开状态
    setFilterChanged(false);

    if (filter) {
      if (!prevExpanded) {
        // 缓存之前的展开状态
        const storeExpanded = store.getExpanded();
        setPrevExpanded(storeExpanded);
      }

      // 展开搜索命中节点的路径节点
      const pathValues: TreeNodeValue[] = [];
      const allNodes: any[] = store.getNodes();
      allNodes.forEach((node: any) => {
        if (node.vmIsLocked) {
          pathValues.push(node.value);
        }
      });
      store.setExpanded(pathValues);
    } else if (prevExpanded) {
      // filter 属性置空，该还原之前的展开状态了
      store.replaceExpanded(prevExpanded);
      setPrevExpanded(null);
    }
  };

  // 这个方法监听 filter 属性，仅在 allowFoldNodeOnFilter 属性为 true 时生效
  // 仅在 filter 属性发生变更时开启检查开关，避免其他操作也触发展开状态的重置
  const checkFilterExpand = (newFilter: null | Function, previousFilter: null | Function) => {
    if (!props.allowFoldNodeOnFilter) return;
    setFilterChanged(newFilter !== previousFilter);
  };

  const handleLoad = (info: any) => {
    const { node } = info;
    const evtCtx = {
      node: node.getModel(),
    };
    if (Array.isArray(state.value) && state.value.length > 0) {
      store.replaceChecked(state.value);
    }
    if (Array.isArray(state.expanded) && state.expanded.length > 0) {
      store.replaceExpanded(state.expanded);
    }
    if (Array.isArray(state.actived) && state.actived.length > 0) {
      store.replaceActived(state.actived);
    }

    props?.onLoad?.(evtCtx);
  };

  const rebuild = (list: TdTreeProps['data']) => {
    store.reload(list || []);
    // 初始化选中状态
    if (Array.isArray(state.value)) {
      store.setChecked(state.value);
    }
    // 更新展开状态
    updateExpanded();
    // 初始化激活状态
    if (Array.isArray(state.actived)) {
      store.setActived(state.actived);
    }
    // 刷新节点状态
    store.refreshState();
  };

  const initStore = () => {
    // keys 属性, 不应该在实例化之后再次变更
    store.setConfig({
      keys,
    });
    updateStoreConfig();
    store.append(data);

    // 刷新节点，必须在配置选中之前执行
    // 这样选中态联动判断才能找到父节点
    store.refreshNodes();

    // 初始化选中状态
    if (Array.isArray(state.value)) {
      store.setChecked(state.value);
    }

    // 更新节点展开状态
    updateExpanded();

    // 初始化激活状态
    if (Array.isArray(state.actived)) {
      store.setActived(state.actived);
    }

    store.emitter.on('load', handleLoad);
    store.emitter.on('update', expandFilterPath);
  };

  // 初始化 store
  useEffect(() => {
    initStore();
    updateState(store);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 配置属性监听
  useEffect(() => {
    const previousVal = store.getChecked();
    if (propsValue?.join() === previousVal?.join()) return;
    store.replaceChecked(propsValue || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsValue]);

  useEffect(() => {
    store.replaceExpanded(propsExpanded || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsExpanded]);

  useEffect(() => {
    const previousVal = store.getActived();
    if (propsActived?.join() === previousVal?.join()) return;
    store.replaceActived(propsActived || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsActived]);

  useEffect(() => {
    store.replaceChecked(value || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    store.replaceExpanded(expanded || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  useEffect(() => {
    store.replaceActived(actived || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actived]);

  useEffect(() => {
    rebuild(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    checkFilterExpand(filter, prevFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    store.setConfig({
      keys,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  return {
    store,
    updateStoreConfig,
    updateExpanded,
    expandFilterPath,
    allNodes,
    setAllNodes,
  };
}
