// 表格 行拖拽 + 列拖拽功能
import { MutableRefObject, useEffect, useRef } from 'react';
import Sortable, { SortableEvent, SortableOptions } from 'sortablejs';
import get from 'lodash/get';
import { TableRowData, TdPrimaryTableProps, DragSortContext } from '../type';
import useClassName from './useClassName';
import log from '../../_common/js/log';
import swapDragArrayElement from '../../_common/js/utils/swapDragArrayElement';

export default function useDragSort(props: TdPrimaryTableProps, primaryTableRef: MutableRefObject<any>) {
  const { sortOnRowDraggable, dragSort, columns, data, onDragSort } = props;
  // 判断是否有拖拽列
  const dragCol = columns.find((item) => item.colKey === 'drag');
  // 行拖拽判断条件
  const isRowDraggable = sortOnRowDraggable || dragSort === 'row';
  // 行拖拽判断条件-手柄列
  const isRowHandlerDraggable = dragSort === 'row-handler' && !!dragCol;
  // 列拖拽判断条件
  const isColDraggable = dragSort === 'col';
  const { tableDraggableClasses, tableBaseClass } = useClassName();
  // 为实现受控，存储上一次的变化结果。React 在回调函数中无法获取最新的 state/props 值，故而使用 useRef
  const lastRowList = useRef([]);
  // React 在回调函数中无法获取最新的 state/props 值，故而使用 useRef
  const tData = useRef<TableRowData[]>();
  // 为实现受控，存储上一次的变化结果。React 在回调函数中无法获取最新的 state/props 值，故而使用 useRef
  const lastColList = useRef([]);
  // 为实现受控，存储上一次的变化结果。React 在回调函数中无法获取最新的 state/props 值，故而使用 useRef
  const dragColumns = useRef([]);

  if (props.sortOnRowDraggable) {
    log.warn('Table', "`sortOnRowDraggable` is going to be deprecated, use dragSort='row' instead.");
  }

  useEffect(() => {
    // 更新排列顺序
    lastRowList.current = data.map((item) => String(get(item, props.rowKey)));
    tData.current = data;
  }, [data, props.rowKey]);

  useEffect(() => {
    lastColList.current = columns.map(t => t.colKey);
    dragColumns.current = columns;
  }, [columns]);

  // 注册拖拽事件
  const registerRowDragEvent = (element: HTMLElement) => {
    if (!isRowHandlerDraggable && !isRowDraggable) return;
    // 拖拽实例
    let dragInstanceTmp: Sortable = null;
    const dragContainer = element?.querySelector('tbody');
    if (!dragContainer) {
      console.error('tbody does not exist.');
      return null;
    }
    const baseOptions: SortableOptions = {
      animation: 150,
      ...props.dragSortOptions,
      // 放置占位符的类名
      ghostClass: tableDraggableClasses.ghost,
      chosenClass: tableDraggableClasses.chosen,
      dragClass: tableDraggableClasses.dragging,
      onEnd: (evt: SortableEvent) => {
        // 处理受控：拖拽列表恢复原始排序，等待外部数据 data 变化，更新最终顺序
        dragInstanceTmp?.sort([...lastRowList.current]);
        const { oldIndex: currentIndex, newIndex: targetIndex } = evt;
        const params: DragSortContext<TableRowData> = {
          currentIndex,
          current: data[currentIndex],
          targetIndex,
          target: data[targetIndex],
          currentData: swapDragArrayElement(tData.current, currentIndex, targetIndex),
          e: evt,
          sort: 'row',
        };
        onDragSort?.(params);
      },
    };

    if (isRowDraggable) {
      dragInstanceTmp = new Sortable(dragContainer, { ...baseOptions });
    } else if (isRowHandlerDraggable) {
      dragInstanceTmp = new Sortable(dragContainer, {
        ...baseOptions,
        handle: `.${tableDraggableClasses.handle}`,
      });
    }
    lastRowList.current = dragInstanceTmp?.toArray();
  };

  const registerColDragEvent = (tableElement: HTMLElement) => {
    if (!isColDraggable || !tableElement) return;
    // 拖拽实例
    let dragInstanceTmp: Sortable = null;
    const options: SortableOptions = {
      animation: 150,
      ...props.dragSortOptions,
      dataIdAttr: 'data-colkey',
      direction: 'vertical',
      ghostClass: tableDraggableClasses.ghost,
      chosenClass: tableDraggableClasses.chosen,
      dragClass: tableDraggableClasses.dragging,
      handle: `.${tableBaseClass.thCellInner}`,
      onEnd: (evt: SortableEvent) => {
        // 处理受控：拖拽列表恢复原始排序，等待外部数据 data 变化，更新最终顺序
        dragInstanceTmp?.sort([...lastColList.current]);
        const { oldIndex: currentIndex, newIndex: targetIndex } = evt;
        const params: DragSortContext<TableRowData> = {
          currentIndex,
          current: dragColumns[currentIndex],
          targetIndex,
          target: dragColumns[targetIndex],
          currentData: swapDragArrayElement(dragColumns.current, currentIndex, targetIndex),
          e: evt,
          sort: 'col',
        };
        onDragSort?.(params);
      },
    };
    const container = tableElement.querySelector('thead > tr') as HTMLDivElement;
    dragInstanceTmp = new Sortable(container, options);
    lastColList.current = dragInstanceTmp?.toArray();
  };

  // 注册拖拽事件
  useEffect(() => {
    if (!primaryTableRef || !primaryTableRef.current) return;
    registerRowDragEvent(primaryTableRef.current?.tableElement);
    registerColDragEvent(primaryTableRef.current?.tableHtmlElement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryTableRef]);

  return {
    isRowDraggable,
    isRowHandlerDraggable,
    isColDraggable,
  };
}
