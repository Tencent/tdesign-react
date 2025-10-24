/**
 * 基于 sortablejs 实现表格的行与列的拖拽功能
 * @docs https://github.com/SortableJS/Sortable
 *
 * (1) toArray() 会返回所有当前容器内的所有 tr 节点的 dataIdAttr 列表
 * - 与是否标记过 dataIdAttr 无关，firstFullRow、lastFullRow、expandedRow 等都会被包含在内
 * - 如果节点没有 dataIdAttr，该库会分配一个随机值
 *
 * (2) sort([id1, id2]) 会根据传入的数组，自动重新排序 DOM 节点
 * - 用于处理受控，恢复拖拽前的顺序，不 onEnd 后直接更新，而是等外部数据更新，再进行重绘
 */

import { useEffect, useMemo, useRef, useState } from 'react';

import { get } from 'lodash-es';
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

interface DragSortOptions {
  primaryTableRef: React.MutableRefObject<PrimaryTableRef>;
  innerPagination: React.MutableRefObject<PaginationProps>;
}

function useDragSort(props: TdEnhancedTableProps, options: DragSortOptions) {
  const { sortOnRowDraggable, dragSort, data, onDragSort } = props;
  const { primaryTableRef, innerPagination } = options;

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
  const trIdList = useRef<string[]>([]);
  const lastColIdList = useRef<string[]>([]);
  const dragColumns = useRef<BaseTableColumns>([]);
  const originalColumns = useRef<BaseTableColumns>([]);

  // fix: https://github.com/Tencent/tdesign/issues/294 修正 onDragSort 会使用旧的变量问题
  const onDragSortRef = useLatest(onDragSort);

  if (props.sortOnRowDraggable) {
    log.warn('Table', "`sortOnRowDraggable` is going to be deprecated, use dragSort='row' instead.");
  }

  const updateLastRowList = () => {
    // 同步表格的 tr 结构变化
    trIdList.current = dragRowInstance.current?.toArray() || [];
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
        updateLastRowList();
        const dragRowId = evt.item.getAttribute('data-id');
        // eslint-disable-next-line no-param-reassign
        evt.to.style.overflow = 'hidden';
        const childRows = getDescendantRows(dragRowId);
        childRows.forEach((row) => {
          // eslint-disable-next-line no-param-reassign
          row.style.display = 'none';
        });
      },
      onMove: (evt: MoveEvent) => {
        // 阻止拖拽到固定行
        const isFullRow = hasClass(evt.related, tableFullRowClasses.base);
        if (isFullRow) return false;

        const { related, dragged, willInsertAfter } = evt;

        const isTargetExpandedParent = hasClass(related, tableExpandClasses.expanded);
        const isTargetExpandedChild = hasClass(related, tableExpandClasses.row);
        // 禁止插在展开父行及其子行之间
        if (isTargetExpandedParent && willInsertAfter) return false;
        if (isTargetExpandedChild && !willInsertAfter) return false;

        if (!props.tree) return;
        // 同级行才能交换位置
        const getDragLevel = (el: HTMLElement) => {
          const levelClass = Array.from(el.classList).find((cls) => cls.includes('-table-tr--level-'));
          return parseInt(levelClass?.split('level-')[1], 10);
        };
        const dragLevel = getDragLevel(dragged);
        const targetLevel = getDragLevel(related);
        return dragLevel === targetLevel;
      },
      onEnd: (evt: SortableEvent) => {
        // eslint-disable-next-line no-param-reassign
        dragRowInstance.current?.sort(trIdList.current);

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
        let targetId = evt.to.children[evt.newIndex]?.getAttribute('data-id');
        if (targetId.startsWith('EXPANDED__')) {
          targetId = targetId.replace('EXPANDED__', '');
        }

        const filteredTrIdList = trIdList.current.filter((id) => !id.startsWith('EXPANDED__'));
        const dataIdList = tData.current.map((item) => String(get(item, props.rowKey)));

        let currentIndex = dataIdList.indexOf(dragId);
        let targetIndex = filteredTrIdList.indexOf(targetId);

        if (currentIndex === -1 || targetIndex === -1) return;

        // eslint-disable-next-line no-underscore-dangle
        const isVirtual = tData.current.some((d) => d.__VIRTUAL_SCROLL_INDEX);
        if (isVirtual) {
          const firstVisibleId = filteredTrIdList[props.firstFullRow ? 1 : 0];
          const virtualOffset = dataIdList.indexOf(firstVisibleId);
          targetIndex += virtualOffset;

          /**
           * https://github.com/SortableJS/Sortable/issues/2336
           * - 属于该库内置缺陷，在使用虚拟滚动时，如果在拖拽过程中发生滚动
           * - 当原始节点最终不在可见范围内时，会意外在首行生成一个新的 `draggable = false` 的节点
           * - 下面算是一个 HACK 方案
           */
          const draggableTr = primaryTableRef.current?.tableContentElement?.querySelector('tr[draggable="false"]');
          if (!draggableTr || !draggableTr.parentNode) return;
          draggableTr.parentNode.removeChild(draggableTr);
          if (currentIndex < targetIndex) targetIndex -= 1;
        }

        if (props.firstFullRow) targetIndex -= 1;

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
        // currentData is going to be deprecated
        params.currentData = params.newData;
        onDragSortRef.current?.(params);
      },
      ...props.dragSortOptions,
    };

    if (!dragContainer) return;
    try {
      if (isRowDraggable) {
        dragRowInstance.current = new Sortable(dragContainer, { ...baseOptions });
      } else if (isRowHandlerDraggable) {
        dragRowInstance.current = new Sortable(dragContainer, {
          ...baseOptions,
          handle: `.${tableDraggableClasses.handle}`,
        });
      }
    } catch (error) {
      //
    }
    updateLastRowList();
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
          dragColInstance.current?.sort([...lastColIdList.current]);
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
      lastColIdList.current = dragInstanceTmp?.toArray();
    } else {
      // 多级表头只抛出事件，不处理其他未知逻辑（如多层表头之间具体如何交换）
      trList?.forEach((container) => {
        registerOneLevelColDragEvent(container as HTMLElement, false);
      });
    }
  };

  useEffect(() => {
    tData.current = data;
    updateLastRowList();
  }, [data]);

  useEffect(() => {
    lastColIdList.current = props.columns.map((t) => t.colKey);
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
      dragRowInstance.current?.destroy();
      dragRowInstance.current = null;
      dragColInstance.current?.destroy();
      dragColInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryTableRef, columns, dragSort, innerPagination]);

  return {
    isRowDraggable,
    isRowHandlerDraggable,
    isColDraggable,
    updateLastRowList,
    setDragSortColumns,
  };
}

export default useDragSort;
