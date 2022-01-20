import { useState } from 'react';
import { TdPrimaryTableProps } from '../type';
import { DragSortInnerProps } from '../base/Table';

function useDragSorter(props: TdPrimaryTableProps): DragSortInnerProps {
  const { sortOnRowDraggable, onDragSort } = props;
  const [draggingRowIndex, setDraggingRowIndex] = useState(-1);
  const [dragStartRowData, setDragStartRowData] = useState(null);
  const [isDroped, setIsDroped] = useState(null);
  // const [dragStartData, setDragStartData] = useState([]);

  if (!sortOnRowDraggable) {
    return {};
  }

  function onDragStart(e, rowIndex, record) {
    console.log('onDragStart', rowIndex);
    setDraggingRowIndex(rowIndex);
    setDragStartRowData(record);
    // setDragStartData(data);
  }
  function onDragOver(e, rowIndex, record) {
    e.preventDefault();
    if (draggingRowIndex === rowIndex || draggingRowIndex === -1) return;

    onDragSort?.({ currentIndex: draggingRowIndex, current: dragStartRowData, target: record, targetIndex: rowIndex });
    setDraggingRowIndex(rowIndex);
  }
  function onDrop() {
    setIsDroped(true);
  }
  function onDragEnd() {
    if (!isDroped) {
      // 取消排序，待扩展api，输出dragStartData
    }
    setIsDroped(false);
    setDraggingRowIndex(-1);
    setDragStartRowData(null);
  }

  return { onDragStart, onDragOver, onDrop, onDragEnd, dragging: draggingRowIndex !== -1 };
}

export default useDragSorter;
