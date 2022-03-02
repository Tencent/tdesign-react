import { useState } from 'react';

interface DragSortProps<T> {
  sortOnDraggable: boolean;
  onDragSort?: (context: DragSortContext<T>) => void;
}

type DragFnType = (e?: React.DragEvent<HTMLTableRowElement>, index?: number, record?: any) => void;
interface DragSortInnerData {
  dragging?: boolean;
  onDragStart?: DragFnType;
  onDragOver?: DragFnType;
  onDrop?: DragFnType;
  onDragEnd?: DragFnType;
}

export interface DragSortInnerProps extends DragSortInnerData {
  getDragProps?: (index?: number, record?: any) => DragSortInnerData;
}

export interface DragSortContext<T> {
  currentIndex: number;
  current: T;
  targetIndex: number;
  target: T;
}

function useDragSorter<T>(props: DragSortProps<T>): DragSortInnerProps {
  const { sortOnDraggable, onDragSort } = props;
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const [dragStartData, setDragStartData] = useState(null);
  const [isDroped, setIsDroped] = useState(null);

  if (!sortOnDraggable) {
    return {};
  }

  function onDragStart(e, index, record: T) {
    setDraggingIndex(index);
    setDragStartData(record);
  }
  function onDragOver(e, index, record: T) {
    e.preventDefault();
    if (draggingIndex === index || draggingIndex === -1) return;

    onDragSort?.({ currentIndex: draggingIndex, current: dragStartData, target: record, targetIndex: index });
    setDraggingIndex(index);
  }
  function onDrop() {
    setIsDroped(true);
  }
  function onDragEnd() {
    if (!isDroped) {
      // 取消排序，待扩展api，输出dragStartData
    }
    setIsDroped(false);
    setDraggingIndex(-1);
    setDragStartData(null);
  }
  function getDragProps(index, record: T) {
    if (sortOnDraggable) {
      return {
        draggable: true,
        onDragStart: (e) => {
          onDragStart(e, index, record);
        },
        onDragOver: (e) => {
          onDragOver(e, index, record);
        },
        onDrop: () => {
          onDrop();
        },
        onDragEnd: () => {
          onDragEnd();
        },
      };
    }
    return {};
  }

  return { onDragStart, onDragOver, onDrop, onDragEnd, getDragProps, dragging: draggingIndex !== -1 };
}

export default useDragSorter;
