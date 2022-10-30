// 表格 行拖拽 + 列拖拽功能
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import Sortable, { SortableEvent, SortableOptions, MoveEvent } from 'sortablejs';
import get from 'lodash/get';
import { TableRowData, TdPrimaryTableProps, DragSortContext, PrimaryTableCol } from '../type';
import useClassName from './useClassName';
import { hasClass } from '../../_util/dom';
import log from '../../_common/js/log';
import swapDragArrayElement from '../../_common/js/utils/swapDragArrayElement';
import { BaseTableColumns } from '../interface';

export default function useDragSort(props: TdPrimaryTableProps, primaryTableRef: MutableRefObject<any>) {
  const { sortOnRowDraggable, dragSort, data, onDragSort } = props;
  const { tableDraggableClasses, tableBaseClass, tableFullRowClasses } = useClassName();
  const [columns, setDragSortColumns] = useState<BaseTableColumns>(props.columns || []);
  // 判断是否有拖拽列。此处重点测试树形结构的拖拽排序
  const dragCol = useMemo(() => columns.find((item) => item.colKey === 'drag'), [columns]);
  // 行拖拽判断条件
  const isRowDraggable = useMemo(() => sortOnRowDraggable || dragSort === 'row', [dragSort, sortOnRowDraggable]);
  // 行拖拽判断条件-手柄列
  const isRowHandlerDraggable = useMemo(
    () => ['row-handler', 'row-handler-col'].includes(dragSort) && !!dragCol,
    [dragSort, dragCol],
  );
  // 列拖拽判断条件
  const isColDraggable = useMemo(() => ['col', 'row-handler-col'].includes(dragSort), [dragSort]);
  // 为实现受控，存储上一次的变化结果。React 在回调函数中无法获取最新的 state/props 值，因此使用 useRef
  const lastRowList = useRef([]);
  // React 在回调函数中无法获取最新的 state/props 值，因此使用 useRef
  const tData = useRef<TableRowData[]>();
  // 为实现受控，存储上一次的变化结果。React 在回调函数中无法获取最新的 state/props 值，因此使用 useRef
  const lastColList = useRef([]);
  // 为实现受控，存储上一次的变化结果。React 在回调函数中无法获取最新的 state/props 值，因此使用 useRef
  const dragColumns = useRef([]);
  // 为实现受控，存储上一次的变化结果。React 在回调函数中无法获取最新的 state/props 值，因此使用 useRef
  const originalColumns = useRef([]);

  if (props.sortOnRowDraggable) {
    log.warn('Table', "`sortOnRowDraggable` is going to be deprecated, use dragSort='row' instead.");
  }

  useEffect(() => {
    // 更新排列顺序
    lastRowList.current = data.map((item) => String(get(item, props.rowKey)));
    tData.current = data;
  }, [data, props.rowKey]);

  useEffect(() => {
    lastColList.current = props.columns.map((t) => t.colKey);
    dragColumns.current = props.columns;
    originalColumns.current = props.columns;
  }, [props.columns]);

  // 本地分页的表格，index 不同，需加上分页计数
  function getDataPageIndex(index: number) {
    const { pagination } = props;
    // 开启本地分页的场景
    if (!props.disableDataPage && pagination && data.length > pagination.pageSize) {
      return pagination.pageSize * (pagination.current - 1) + index;
    }
    return index;
  }

  const registerRowDragEvent = (element: HTMLElement) => {
    if (!isRowHandlerDraggable && !isRowDraggable) return;
    // 拖拽实例
    let dragInstanceTmp: Sortable = null;
    const dragContainer = element?.querySelector('tbody');
    if (!dragContainer) {
      log.error('Table', 'tbody does not exist.');
      return null;
    }
    const baseOptions: SortableOptions = {
      animation: 150,
      ghostClass: tableDraggableClasses.ghost,
      chosenClass: tableDraggableClasses.chosen,
      dragClass: tableDraggableClasses.dragging,
      filter: `.${tableFullRowClasses.base}`, // 过滤首行尾行固定
      onMove: (evt: MoveEvent) => !hasClass(evt.related, tableFullRowClasses.base),
      onEnd: (evt: SortableEvent) => {
        // 处理受控：拖拽列表恢复原始排序，等待外部数据 data 变化，更新最终顺序
        let { oldIndex: currentIndex, newIndex: targetIndex } = evt;

        dragInstanceTmp?.sort([...lastRowList.current]);
        if (props.firstFullRow) {
          currentIndex -= 1;
          targetIndex -= 1;
        }
        const params: DragSortContext<TableRowData> = {
          currentIndex,
          current: tData.current[currentIndex],
          targetIndex,
          target: tData.current[targetIndex],
          data: tData.current,
          newData: swapDragArrayElement(
            [...tData.current],
            getDataPageIndex(currentIndex),
            getDataPageIndex(targetIndex),
          ),
          e: evt,
          sort: 'row',
        };
        // currentData is going to be deprecated.
        params.currentData = params.newData;

        onDragSort?.(params);
      },
      ...props.dragSortOptions,
    };

    if (!dragContainer) return;
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

  // TODO: 待和 Vue 保持相同逻辑
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
        let { oldIndex: currentIndex, newIndex: targetIndex } = evt;
        const current = dragColumns.current[currentIndex];
        const target = dragColumns.current[targetIndex];
        if (!current || !current.colKey) {
          log.error('Table', `colKey is missing in ${JSON.stringify(current)}`);
        }
        if (!target || !target.colKey) {
          log.error('Table', `colKey is missing in ${JSON.stringify(target)}`);
        }
        // 寻找外部数据 props.columns 中的真正下标
        currentIndex = originalColumns.current.findIndex((t) => t.colKey === current.colKey);
        targetIndex = originalColumns.current.findIndex((t) => t.colKey === target.colKey);
        const params: DragSortContext<PrimaryTableCol> = {
          data: dragColumns.current,
          currentIndex,
          current,
          targetIndex,
          target,
          newData: swapDragArrayElement([...originalColumns.current], currentIndex, targetIndex),
          e: evt,
          sort: 'col',
        };
        // currentData is going to be deprecated.
        params.currentData = params.newData;
        onDragSort?.(params);
      },
    };
    const container = tableElement.querySelector('thead > tr') as HTMLDivElement;
    if (!container) return;
    dragInstanceTmp = new Sortable(container, options);
    lastColList.current = dragInstanceTmp?.toArray();
  };

  // 注册拖拽事件
  useEffect(() => {
    if (!primaryTableRef || !primaryTableRef.current) return;
    registerRowDragEvent(primaryTableRef.current?.tableElement);
    registerColDragEvent(primaryTableRef.current?.tableHtmlElement);
    /** 待表头节点准备完成后 */
    const timer = setTimeout(() => {
      if (primaryTableRef.current?.affixHeaderElement) {
        registerColDragEvent(primaryTableRef.current.affixHeaderElement);
      }
      clearTimeout(timer);
    });
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryTableRef, columns, dragSort]);

  return {
    isRowDraggable,
    isRowHandlerDraggable,
    isColDraggable,
    setDragSortColumns,
  };
}
