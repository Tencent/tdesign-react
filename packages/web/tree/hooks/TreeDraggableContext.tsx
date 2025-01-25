import { useRef, DragEvent } from 'react';
import TreeStore from '../../_common/js/tree-v1/tree-store';
import TreeNode from '../../_common/js/tree-v1/tree-node';
import { TreeProps } from '../Tree';
import { createHookContext } from '../../_util/createHookContext';

import type { TdTreeProps } from '../type';

interface Value {
  props: TreeProps;
  store: TreeStore;
}

export const TreeDraggableContext = createHookContext((value: Value) => {
  const { props, store } = value;

  const dragNode = useRef<TreeNode | null>(null);

  const onDragStart = (context: { node: TreeNode; e: DragEvent<HTMLDivElement> }) => {
    dragNode.current = context.node;
    props.onDragStart?.({
      ...context,
      node: context.node.model,
    });
  };

  const onDragEnd = (context: { node: TreeNode; e: DragEvent<HTMLDivElement> }) => {
    dragNode.current = context.node;
    props.onDragEnd?.({
      ...context,
      node: context.node.model,
    });
  };

  const onDragOver = (context: { node: TreeNode; e: DragEvent<HTMLDivElement> }) => {
    props.onDragOver?.({
      ...context,
      node: context.node.model,
    });
  };

  const onDragLeave = (context: { node: TreeNode; e: DragEvent<HTMLDivElement> }) => {
    props.onDragLeave?.({
      ...context,
      node: context.node.model,
    });
  };

  const onDrop = (context: {
    node: TreeNode;
    dropPosition: number;
    e: DragEvent<HTMLDivElement>;
    allowDrop?: TdTreeProps['allowDrop'];
  }) => {
    const { node, dropPosition } = context;
    if (
      node.value === dragNode.current?.value ||
      node.getParents().some((_node) => _node.value === dragNode.current?.value)
    ) {
      return;
    }
    const ctx = {
      dropNode: node.getModel(),
      dragNode: dragNode.current.getModel(),
      dropPosition,
      e: context.e,
    };

    if (props.allowDrop?.(ctx) === false) return;

    const nodes = store.getNodes() as TreeNode[];
    nodes.some((_node) => {
      if (_node.value === node.value) {
        if (dropPosition === 0) {
          dragNode.current?.appendTo(store, _node);
        } else if (dropPosition < 0) {
          node.insertBefore(dragNode.current);
        } else {
          node.insertAfter(dragNode.current);
        }
        return true;
      }
      return false;
    });
    props.onDrop?.({
      ...context,
      dragNode: dragNode.current?.model,
      dropNode: node.model,
    });
  };

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
  };
});

export const useTreeDraggableContext = () => TreeDraggableContext.use();
