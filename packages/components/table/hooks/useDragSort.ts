/**
 * 基于 sortablejs 实现表格的行与列的拖拽功能
 * @docs https://github.com/SortableJS/Sortable
 *
 * (1) toArray() 会返回所有当前容器内的所有 tr 节点的 dataIdAttr 列表
 * - 与是否标记过 dataIdAttr 无关，firstFullRow、lastFullRow、expandedRow 等都会被包含在内
 * - 如果节点没有 dataIdAttr，sortablejs 会分配一个随机值
 *
 * (2) sort([id1, id2, id3]) 会根据传入的数组，自动重新排序 DOM 节点
 * - 用于处理受控，恢复拖拽前的顺序，不 onEnd 后直接更新，而是等外部数据更新，再进行重绘
 */

import { useEffect, useMemo, useRef, useState } from 'react';

import Sortable, { type MoveEvent, type SortableEvent, type SortableOptions } from 'sortablejs';

import log from '@tdesign/common-js/log/index';
import { getColumnDataByKey, getColumnIndexByKey } from '@tdesign/common-js/table/utils';
import swapDragArrayElement from '@tdesign/common-js/utils/swapDragArrayElement';

import { hasClass } from '../../_util/style';
import useLatest from '../../hooks/useLatest';
import useClassName from './useClassName';

import type { PaginationProps } from '../../pagination';
import type { BaseTableColumns, PrimaryTableRef } from '../interface';
import type { DragSortContext, TableRowData, TdEnhancedTableProps } from '../type';

function useDragSort(
  props: TdEnhancedTableProps,
  {
    primaryTableRef,
    innerPagination,
  }: {
    primaryTableRef: React.MutableRefObject<PrimaryTableRef>;
    innerPagination: React.MutableRefObject<PaginationProps>;
  },
) {
  const { sortOnRowDraggable, dragSort, data, onDragSort } = props;
  const { tableDraggableClasses, tableExpandClasses, tableBaseClass, tableFullRowClasses } = useClassName();

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

  const tData = useRef<TableRowData[]>(null);

  const dragRowInstance = useRef<Sortable>(null);
  const dragColInstance = useRef<Sortable>(null);

  // 存储拖拽前的数据
  const lastRowList = useRef<string[]>([]);
  const lastColList = useRef<string[]>([]);
  const dragColumns = useRef<BaseTableColumns>([]);
  const originalColumns = useRef<BaseTableColumns>([]);

  // fix: https://github.com/Tencent/tdesign/issues/294 修正 onDragSort 会使用旧的变量问题
  const onDragSortRef = useLatest(onDragSort);

  if (props.sortOnRowDraggable) {
    log.warn('Table', "`sortOnRowDraggable` is going to be deprecated, use dragSort='row' instead.");
  }

  const updateLastRowList = () => {
    requestAnimationFrame(() => {
      // 用于表格 tr 结构突然变化时（例如手动展开、换页等），更新行列表
      lastRowList.current = dragRowInstance.current?.toArray();
    });
  };

  const getDataPageIndex = (index: number, pagination: PaginationProps) => {
    // 本地分页的表格，index 不同，需加上分页计数
    const current = pagination.current ?? pagination.defaultCurrent;
    const pageSize = pagination.pageSize ?? pagination.defaultPageSize;
    if (!props.disableDataPage && pagination && data.length > pageSize) {
      return pageSize * (current - 1) + index;
    }
    return index;
  };

  const cloneNodeWithStyles = (sourceEl: HTMLElement) => {
    // 克隆节点，并复制样式
    const clone = sourceEl.cloneNode(true) as HTMLElement;
    const sourceEls = sourceEl.querySelectorAll('*');
    const cloneEls = clone.querySelectorAll('*');

    const cloneStyles = (src: HTMLElement, dest: HTMLElement) => {
      if (!window) return dest;
      const computed = window.getComputedStyle(src);
      const cssText = Array.from(computed)
        .map((name) => `${name}:${computed.getPropertyValue(name)};`)
        .join('');
      // eslint-disable-next-line no-param-reassign
      dest.style.cssText = cssText;
    };

    cloneStyles(sourceEl, clone);
    sourceEls.forEach((src, i) => cloneStyles(src as HTMLElement, cloneEls[i] as HTMLElement));
    return clone;
  };

  const getDescendantRows = (parentId: string) => {
    const container = primaryTableRef.current?.tableContentElement;
    const children = Array.from(container.querySelectorAll(`tr[data-parent-id="${parentId}"]`) || []) as HTMLElement[];
    let allDescendants = [...children];
    children.forEach((child) => {
      const childId = child.getAttribute('data-id');
      if (childId) {
        allDescendants = allDescendants.concat(getDescendantRows(childId));
      }
    });

    return allDescendants;
  };

  const registerRowDragEvent = (element: HTMLElement) => {
    if (!isRowHandlerDraggable && !isRowDraggable) return;

    const dragContainer = element?.querySelector('tbody');
    if (!dragContainer) return null;

    const baseOptions: SortableOptions = {
      animation: 150,
      dataIdAttr: 'data-id',
      ghostClass: tableDraggableClasses.ghost,
      chosenClass: tableDraggableClasses.chosen,
      dragClass: tableDraggableClasses.dragging,
      filter: `.${tableFullRowClasses.base}`,
      setData: (dataTransfer, dragEl) => {
        const dragRowId = dragEl.getAttribute('data-id');
        const childRows = getDescendantRows(dragRowId);

        if (!childRows || childRows.length === 0) return;

        // 拖拽时跟随在鼠标附近的元素剪影
        const ghostNode = cloneNodeWithStyles(dragEl);
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.borderSpacing = '0';
        const tbody = document.createElement('tbody');
        tbody.appendChild(ghostNode);

        childRows.forEach((row) => {
          tbody.appendChild(cloneNodeWithStyles(row as HTMLElement));
        });
        table.appendChild(tbody);

        // 必须先有实际节点
        document.body.appendChild(table);
        dataTransfer.setDragImage(table, 10, 10);

        requestAnimationFrame(() => {
          if (document.body.contains(table)) {
            // 开启移动后即可移除
            document.body.removeChild(table);
          }
        });
      },
      onStart: (evt: SortableEvent) => {
        const dragRowId = evt.item.getAttribute('data-id');
        const childRows = getDescendantRows(dragRowId);
        childRows.forEach((row) => {
          // eslint-disable-next-line no-param-reassign
          (row as HTMLElement).style.display = 'none';
        });
      },
      onMove: (evt: MoveEvent) => {
        // 阻止拖拽到固定行
        const isTargetFullRow = hasClass(evt.related, tableFullRowClasses.base);
        if (isTargetFullRow) return false;

        const isTargetExpandedRow = hasClass(evt.related, tableExpandClasses.row);

        // 阻止拖拽到展开行与其父行之间
        if (isTargetExpandedRow && !evt.willInsertAfter) {
          const prevElement = evt.related.previousElementSibling;
          if (prevElement && hasClass(prevElement, tableExpandClasses.expanded)) {
            return false;
          }
        }

        // 只支持树形结构在同级节点间拖拽
        if (props.tree) {
          const dragItem = evt.dragged;
          const targetItem = evt.related;

          const getDragLevel = (el: HTMLElement) => {
            const levelClass = Array.from(el.classList).find((cls) => cls.includes('-table-tr--level-'));
            return parseInt(levelClass.split('level-')[1], 10);
          };

          const dragLevel = getDragLevel(dragItem);
          const targetLevel = getDragLevel(targetItem);

          if (dragLevel !== targetLevel) false;
        }

        return true;
      },
      onEnd: (evt: SortableEvent) => {
        if (evt.newIndex === evt.oldIndex) return;
        dragRowInstance.current?.sort(lastRowList.current);

        const dragId = evt.item.getAttribute('data-id');
        // 恢复隐藏的展开行
        const childRows = getDescendantRows(dragId);
        childRows.forEach((row) => {
          // eslint-disable-next-line no-param-reassign
          row.style.display = '';
          if (!row.getAttribute('style')) {
            row.removeAttribute('style');
          }
        });

        const rowIdList = lastRowList.current.filter((id) => !id.startsWith('EXPANDED'));

        // TODO: 虚拟滚动时，index 的计算会有问题，需要后续支持
        let currentIndex = rowIdList.indexOf(dragId);
        let targetIndex = rowIdList.indexOf(evt.to.children[evt.newIndex]?.getAttribute('data-id'));

        if (currentIndex === -1 || targetIndex === -1) return;

        if (props.firstFullRow) {
          currentIndex -= 1;
          targetIndex -= 1;
        }
        if (innerPagination.current) {
          currentIndex = getDataPageIndex(currentIndex, innerPagination.current);
          targetIndex = getDataPageIndex(targetIndex, innerPagination.current);
        }
        const newData = swapDragArrayElement([...tData.current], currentIndex, targetIndex);
        const params: DragSortContext<TableRowData> = {
          currentIndex,
          current: tData.current[currentIndex],
          targetIndex,
          target: tData.current[targetIndex],
          data: tData.current,
          newData,
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
      dragRowInstance.current = new Sortable(dragContainer, { ...baseOptions });
    } else if (isRowHandlerDraggable) {
      dragRowInstance.current = new Sortable(dragContainer, {
        ...baseOptions,
        handle: `.${tableDraggableClasses.handle}`,
      });
    }
    lastRowList.current = dragRowInstance.current.toArray();
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
          dragColInstance.current?.sort([...lastColList.current]);
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
    dragColInstance.current = new Sortable(container, options);
    return dragColInstance.current;
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

  useEffect(() => {
    lastRowList.current = dragRowInstance.current?.toArray() || [];
    tData.current = data;
  }, [data, props.rowKey]);

  useEffect(() => {
    lastColList.current = props.columns.map((t) => t.colKey);
    dragColumns.current = props.columns;
    originalColumns.current = props.columns;
  }, [props.columns]);

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
  }, [primaryTableRef, columns, dragSort, innerPagination]);

  return {
    isRowDraggable,
    isRowHandlerDraggable,
    isColDraggable,
    setDragSortColumns,
    updateLastRowList,
  };
}

export default useDragSort;
