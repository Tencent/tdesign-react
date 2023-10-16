import { useState, MouseEvent } from 'react';

import { TypeTreeNode, TypeTargetNode, TreeNodeValue, TypeTreeStore } from '../tree-types';
import useControlled from '../../hooks/useControlled';
import { usePersistFn } from '../../_util/usePersistFn';
import { getNode } from '../utils';

import type { TdTreeProps } from '../type';

export default function useTreeState(props: TdTreeProps) {
  const [value, onChange] = useControlled(props, 'value', props.onChange);
  const [expanded, onExpand] = useControlled(props, 'expanded', props.onExpand);
  const [actived, onActive] = useControlled(props, 'actived', props.onActive);
  const [store, setStore] = useState(null);

  const [allNodes, setAllNodes] = useState([]); // 全部节点

  const [visibleNodes, setVisibleNodes] = useState([]); // 可见节点

  const updateState = (store: TypeTreeStore) => {
    setStore(store);
    const nodes = store.getNodes();
    setAllNodes(nodes);
    const visibleNodes = nodes.filter((node) => node.visible);
    setVisibleNodes(visibleNodes);
  };

  const setActived = usePersistFn(
    (
      node: TypeTreeNode,
      isActived: boolean,
      ctx: { e?: MouseEvent<HTMLDivElement>; trigger: 'node-click' | 'icon-click' | 'setItem' },
    ) => {
      const actived = node.setActived(isActived);
      const treeNodeModel = node?.getModel();
      onActive(actived, { node: treeNodeModel, ...ctx });
      return actived;
    },
  );

  const toggleActived = (
    item: TypeTargetNode,
    ctx: { e?: MouseEvent<HTMLDivElement>; trigger: 'node-click' | 'icon-click' | 'setItem' },
  ): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setActived(node, !node.isActived(), ctx);
  };

  const setChecked = usePersistFn(
    (node: TypeTreeNode, isChecked: boolean, ctx: { e?: any; trigger: 'node-click' | 'icon-click' | 'setItem' }) => {
      const checked = node.setChecked(isChecked);
      const treeNodeModel = node?.getModel();
      onChange(checked, { node: treeNodeModel, ...ctx });
      return checked;
    },
  );

  const toggleChecked = (
    item: TypeTargetNode,
    ctx: { e?: MouseEvent<HTMLElement>; trigger: 'node-click' | 'icon-click' | 'setItem' },
  ): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setChecked(node, !node.isChecked(), ctx);
  };

  // 因为是被 useImperativeHandle 依赖的方法，使用 usePersistFn 变成持久化的。或者也可以使用 useCallback
  const setExpanded = usePersistFn(
    (
      node: TypeTreeNode,
      isExpanded: boolean,
      ctx: { e?: MouseEvent<HTMLDivElement>; trigger: 'node-click' | 'icon-click' | 'setItem' },
    ) => {
      const { e, trigger } = ctx;
      const expanded = node.setExpanded(isExpanded);
      const treeNodeModel = node?.getModel();
      if (e || trigger) {
        onExpand(expanded, { node: treeNodeModel, ...ctx });
      }
      return expanded;
    },
  );

  const toggleExpanded = (
    item: TypeTargetNode,
    ctx: { e?: MouseEvent<HTMLDivElement>; trigger: 'node-click' | 'icon-click' | 'setItem' },
  ): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setExpanded(node, !node.isExpanded(), ctx);
  };

  return {
    value,
    setChecked,
    toggleChecked,
    expanded,
    setExpanded,
    toggleExpanded,
    actived,
    setActived,
    toggleActived,
    store,
    setStore,
    allNodes,
    setAllNodes,
    visibleNodes,
    setVisibleNodes,
    updateState,
  };
}
