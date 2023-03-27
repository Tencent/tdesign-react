// 表格 行拖拽 + 列拖拽功能
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import Sortable, { SortableEvent, SortableOptions, MoveEvent } from 'sortablejs';
import get from 'lodash/get';
import { TableRowData, TdPrimaryTableProps, DragSortContext } from '../type';
import useClassName from './useClassName';
import { hasClass } from '../../_util/dom';
import useLatest from '../../_util/useLatest';
import log from '../../_common/js/log';
import swapDragArrayElement from '../../_common/js/utils/swapDragArrayElement';
import { BaseTableColumns } from '../interface';
import { getColumnDataByKey, getColumnIndexByKey } from '../utils';

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
  const lastColList = useRef([]);
  const dragColumns = useRef([]);
  const originalColumns = useRef([]);

  // 拖拽实例
  let dragColInstanceTmp: Sortable = null;

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

  // fix: https://github.com/Tencent/tdesign/issues/294 修正 onDragSort 会使用旧的变量问题
  const onDragSortRef = useLatest(onDragSort);

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
        if (evt.newIndex === evt.oldIndex) return;
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

        onDragSortRef.current?.(params);
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

  const registerOneLevelColDragEvent = (container: HTMLElement, recover: boolean) => {
    const options: SortableOptions = {
      animation: 150,
      dataIdAttr: 'data-colkey',
      direction: 'vertical',
      ghostClass: tableDraggableClasses.ghost,
      chosenClass: tableDraggableClasses.chosen,
      dragClass: tableDraggableClasses.dragging,
      handle: `.${tableBaseClass.thCellInner}`,
      // 存在类名：t-table__th--drag-sort 的列才允许拖拽调整顺序（注意：添加 draggable 之后，固定列的表头 和 吸顶表头 位置顺序会错位，暂时注释）
      // draggable: `th.${tableDraggableClasses.dragSortTh}`,
      onEnd: (evt: SortableEvent) => {
        if (evt.newIndex === evt.oldIndex) return;
        if (recover) {
          // 处理受控：拖拽列表恢复原始排序，等待外部数据 data 变化，更新最终顺序
          dragColInstanceTmp?.sort([...lastColList.current]);
        }
        const { oldIndex, newIndex, target: targetElement } = evt;
        let currentIndex = recover ? oldIndex : newIndex;
        let targetIndex = recover ? newIndex : oldIndex;
        const oldElement = targetElement.children[currentIndex] as HTMLElement;
        const newElement = targetElement.children[targetIndex] as HTMLElement;
        const current = getColumnDataByKey(originalColumns.current, oldElement.dataset.colkey);
        const target = getColumnDataByKey(originalColumns.current, newElement.dataset.colkey);
        if (!current || !current.colKey) {
          log.error('Table', `colKey is missing in ${JSON.stringify(current)}`);
        }
        if (!target || !target.colKey) {
          log.error('Table', `colKey is missing in ${JSON.stringify(target)}`);
        }
        // 寻找外部数据 props.columns 中的真正下标
        currentIndex = getColumnIndexByKey(originalColumns.current, current.colKey);
        targetIndex = getColumnIndexByKey(originalColumns.current, target.colKey);
        const params: DragSortContext<TableRowData> = {
          data: dragColumns.current,
          currentIndex,
          current,
          targetIndex,
          target,
          newData: swapDragArrayElement([...originalColumns.current], currentIndex, targetIndex),
          e: evt,
          sort: 'col',
        };
        // currentData is going to be deprecated
        params.currentData = params.newData;
        onDragSortRef.current?.(params);
      },
      ...props.dragSortOptions,
    };
    if (!container) return;
    dragColInstanceTmp = new Sortable(container, options);
    return dragColInstanceTmp;
  };

  const registerColDragEvent = (tableElement: HTMLElement) => {
    if (!isColDraggable || !tableElement) return;
    const trList = tableElement.querySelectorAll('thead > tr');
    if (trList.length <= 1) {
      const container = trList[0];
      const dragInstanceTmp = registerOneLevelColDragEvent(container as HTMLElement, true);
      lastColList.current = dragInstanceTmp?.toArray();
    } else {
      // 多级表头只抛出事件，不处理其他未知逻辑（如多层表头之间具体如何交换）
      trList?.forEach((container) => {
        registerOneLevelColDragEvent(container as HTMLElement, false);
      });
    }
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
