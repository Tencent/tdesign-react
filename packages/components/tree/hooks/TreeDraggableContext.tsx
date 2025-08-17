import { useRef } from 'react';
import TreeNode from '@tdesign/common-js/tree-v1/tree-node';
import TreeStore from '@tdesign/common-js/tree-v1/tree-store';
import { createHookContext } from '../../_util/createHookContext';
import type { TreeProps } from '../Tree';
import type { TdTreeProps } from '../type';

interface Value {
  props: TreeProps;
  store: TreeStore;
}

export type BaseDragContextType = {
  node: TreeNode;
  e: React.DragEvent<HTMLDivElement>;
};

export type DragContextType = BaseDragContextType & {
  dropPosition: number;
};

export type DropContextType = BaseDragContextType & {
  dropPosition: number;
  allowDrop?: TdTreeProps['allowDrop'];
};

export const TreeDraggableContext = createHookContext((value: Value) => {
  const { props, store } = value;

  const dragNode = useRef<TreeNode | null>(null);

  const onDragStart = (context: BaseDragContextType) => {
    dragNode.current = context.node;
    props.onDragStart?.({
      ...context,
      node: context.node.getModel(),
    });
  };

  const onDragEnd = (context: BaseDragContextType) => {
    dragNode.current = context.node;
    props.onDragEnd?.({
      ...context,
      node: context.node.getModel(),
    });
  };

  const onDragOver = (context: DragContextType) => {
    props.onDragOver?.({
      ...context,
      node: context.node.getModel(),
      dragNode: dragNode.current?.getModel(),
    });
  };

  const onDragLeave = (context: DragContextType) => {
    props.onDragLeave?.({
      ...context,
      node: context.node.getModel(),
      dragNode: dragNode.current?.getModel(),
    });
  };

  const onDrop = (context: DropContextType) => {
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
      dragNode: dragNode.current?.getModel(),
      dropNode: node.getModel(),
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
