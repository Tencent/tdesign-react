import { useRef, useState } from 'react';
import { throttle } from 'lodash-es';

import { usePersistFn } from '../../hooks/usePersistFn';
import { useTreeDraggableContext } from './TreeDraggableContext';

import type { DragEvent, RefObject } from 'react';
import type { TreeNode } from '@tdesign/common-js/tree-v1/tree-node';
import type { DropPosition } from '../interface';
import type { TdTreeProps } from '../type';

export default function useDraggable(props: {
  nodeRef: RefObject<HTMLElement | undefined>;
  node: TreeNode;
  allowDrop?: TdTreeProps['allowDrop'];
}) {
  const { nodeRef, node, allowDrop } = props;
  const { onDragStart, onDragEnd, onDragLeave, onDragOver, onDrop, getDragNode } = useTreeDraggableContext();

  const [state, setState] = useState<{
    isDragOver: boolean;
    isDragging: boolean;
    dropPosition: DropPosition;
  }>({
    isDragOver: false,
    isDragging: false,
    dropPosition: 0,
  });

  const setPartialState = usePersistFn((newState: Partial<typeof state>) => {
    setState((prev) => ({
      ...prev,
      ...newState,
    }));
  });

  const calcDropPosition = (e: DragEvent): DropPosition => {
    if (!window || !nodeRef.current) return 0;
    const rect = nodeRef.current.getBoundingClientRect();
    const offsetY = window.scrollY + rect.top;
    const { pageY } = e;
    // 节点上 1/4 视为前置，下 1/4 视为后置，中间为子节点
    const gapHeight = rect.height / 4;
    const diff = pageY - offsetY;
    if (diff < gapHeight) return -1;
    if (diff < rect.height - gapHeight) return 0;
    return 1;
  };

  const updateDropPosition = useRef(
    throttle((e: DragEvent) => {
      const dropPosition = calcDropPosition(e);
      // 通过 allowDrop 判断当前位置是否允许放置
      // 从而决定提示线是否显示
      const dragNode = getDragNode?.();
      const isAllowed =
        !allowDrop ||
        !dragNode ||
        allowDrop({
          e,
          dragNode: dragNode.getModel(),
          dropNode: node.getModel(),
          dropPosition,
        }) !== false;
      setPartialState({ dropPosition, isDragOver: isAllowed });
    }),
  ).current;

  const setDragStatus = (
    status: 'dragStart' | 'dragOver' | 'dragLeave' | 'dragEnd' | 'drop',
    e: DragEvent<HTMLDivElement>,
  ) => {
    switch (status) {
      case 'dragStart':
        setPartialState({
          isDragging: true,
          dropPosition: 0,
        });
        onDragStart?.({ node, e });
        break;
      case 'dragEnd':
        setPartialState({
          isDragging: false,
          isDragOver: false,
          dropPosition: 0,
        });
        updateDropPosition.cancel();
        onDragEnd?.({ node, e });
        break;
      case 'dragOver':
        updateDropPosition(e);
        onDragOver?.({ node, dropPosition: state.dropPosition, e });
        break;
      case 'dragLeave':
        setPartialState({
          isDragOver: false,
        });
        updateDropPosition.cancel();
        onDragLeave?.({ node, dropPosition: state.dropPosition, e });
        break;
      case 'drop':
        onDrop?.({ node, dropPosition: state.dropPosition, e, allowDrop });
        setPartialState({
          isDragOver: false,
        });
        updateDropPosition.cancel();
        break;
      default:
        break;
    }
  };

  return {
    ...state,
    setDragStatus,
  };
}
