import { throttle } from 'lodash-es';
import { RefObject, DragEvent, useState, useRef } from 'react';
import { TreeNode } from '@tdesign/common-js/tree-v1/tree-node';
import { useTreeDraggableContext } from './TreeDraggableContext';
import { DropPosition } from '../interface';
import { usePersistFn } from '../../hooks/usePersistFn';

import type { TdTreeProps } from '../type';

export default function useDraggable(props: {
  nodeRef: RefObject<HTMLElement | undefined>;
  node: TreeNode;
  allowDrop?: TdTreeProps['allowDrop'];
}) {
  const { nodeRef, node, allowDrop } = props;
  const { onDragStart, onDragEnd, onDragLeave, onDragOver, onDrop } = useTreeDraggableContext();

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

  const updateDropPosition = useRef(
    throttle((e: DragEvent) => {
      if (!nodeRef.current) return;

      const rect = nodeRef.current.getBoundingClientRect();
      const offsetY = window.pageYOffset + rect.top;
      const { pageY } = e;
      const gapHeight = rect.height / 4;
      const diff = pageY - offsetY;

      if (diff < gapHeight) {
        setPartialState({ dropPosition: -1 });
      } else if (diff < rect.height - gapHeight) {
        setPartialState({ dropPosition: 0 });
      } else {
        setPartialState({ dropPosition: 1 });
      }
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
        setPartialState({
          isDragOver: true,
        });
        updateDropPosition(e);
        onDragOver?.({ node, e });
        break;
      case 'dragLeave':
        setPartialState({
          isDragOver: false,
          dropPosition: 0,
        });
        updateDropPosition.cancel();
        onDragLeave?.({ node, e });
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
