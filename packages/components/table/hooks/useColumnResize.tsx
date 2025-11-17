/**
 * important info: only resize happened, th width calculating allowed
 * 验证场景：多级表头调整叶子结点列宽、吸顶表头调整列宽、列数量发生变化、表格未超出、表格已超出
 * - 始终调整分割线 (Resize Line) 左侧列的宽度
 * - 若表格宽度已超出，直接改变左侧列宽，同时改变表格总宽度
 * - 若表格宽度未超出，改变左侧列宽的同时，调整右侧列或最后一列的宽度以保持总宽度不变
 */

import React, { CSSProperties, MutableRefObject, useEffect, useRef, useState } from 'react';
import { isNumber } from 'lodash-es';
import { off, on } from '../../_util/listener';
import type { BaseTableCol, TableRowData, TdBaseTableProps } from '../type';

const DEFAULT_MIN_WIDTH = 80;
const DEFAULT_MAX_WIDTH = 600;

/**
 * 鼠标在边框附近的特定距离内，才显示拖拽图标
 */
const DISTANCE = 8;
/**
 * 鼠标右键事件
 */
const CONTEXTMENU = 2;

let originalSelectStart: (this: GlobalEventHandlers, ev: Event) => any;
let originalDragStart: (this: GlobalEventHandlers, ev: Event) => any;

export default function useColumnResize(params: {
  isWidthOverflow: boolean;
  tableContentRef: MutableRefObject<HTMLDivElement>;
  showColumnShadow: {
    left: boolean;
    right: boolean;
  };
  getThWidthList: (type?: 'default' | 'calculate') => { [colKeys: string]: number };
  updateThWidthList: (data: { [colKeys: string]: number }) => void;
  setTableElmWidth: (width: number) => void;
  updateTableAfterColumnResize: () => void;
  onColumnResizeChange: TdBaseTableProps['onColumnResizeChange'];
}) {
  const {
    isWidthOverflow,
    tableContentRef,
    showColumnShadow,
    getThWidthList,
    updateThWidthList,
    setTableElmWidth,
    updateTableAfterColumnResize,
    onColumnResizeChange,
  } = params;

  const resizeLineRef = useRef<HTMLDivElement>(null);
  const effectColMap = useRef<{ [colKey: string]: any }>({});
  const [leafColumns, setLeafColumns] = useState([]);

  useEffect(() => {
    const hasDocument = typeof document !== 'undefined';
    originalSelectStart = hasDocument ? document.onselectstart : null;
    originalDragStart = hasDocument ? document.ondragstart : null;
  }, []);

  const getSiblingResizableCol = (nodes: BaseTableCol<TableRowData>[], index: number, type: 'prev' | 'next') => {
    let i = index;
    while (nodes[i] && nodes[i].resizable === false) {
      if (type === 'next') {
        i += 1;
      } else {
        i -= 1;
      }
    }
    return nodes[i];
  };

  // 递归查找列宽度变化后，受影响的相关列
  const setEffectColMap = (nodes: BaseTableCol<TableRowData>[], parent: BaseTableCol<TableRowData> | null) => {
    if (!nodes) return;
    setLeafColumns(nodes);
    nodes.forEach((n, index) => {
      const prevNode = getSiblingResizableCol(nodes, index - 1, 'prev');
      const nextNode = getSiblingResizableCol(nodes, index + 1, 'next');
      const parentPrevCol = parent ? effectColMap.current[parent.colKey].prev : nextNode;
      const parentNextCol = parent ? effectColMap.current[parent.colKey].next : prevNode;
      const prev = index === 0 ? parentPrevCol : prevNode;
      const next = index === nodes.length - 1 ? parentNextCol : nextNode;
      effectColMap.current[n.colKey] = {
        prev,
        next,
        current: {
          prevSibling: getSiblingResizableCol(nodes, index - 1, 'prev'),
          nextSibling: getSiblingResizableCol(nodes, index + 1, 'next'),
        },
      };
      setEffectColMap(n.children, n);
    });
  };

  const resizeLineParams = {
    isDragging: false,
    draggingCol: null as HTMLElement,
    draggingStart: 0,
    // 列宽调整类型：影响右侧列宽度、影响左侧列宽度、或者仅影响自身
    effectCol: 'next' as 'next' | 'prev',
    resizeLineStyle: {} as CSSProperties,
  };

  const [resizeLineStyle, setResizeLineStyle] = useState<CSSProperties>({
    display: 'none',
    left: '10px',
    height: '10px',
    bottom: '0',
  });

  // 当前列是否配置右侧固定并且处于固定激活状态
  const isColRightFixActive = (col: BaseTableCol<TableRowData>) => col.fixed === 'right' && showColumnShadow.right;

  // 表格列宽拖拽事件
  // 只在表头显示拖拽图标
  const onColumnMouseover = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    // calculate mouse cursor before drag start
    if (!resizeLineRef.current || resizeLineParams.isDragging || !e.target) return;
    const target = (e.target as HTMLElement).closest('th');
    if (!target) return;
    // 判断是否为叶子阶段，仅叶子结点允许拖拽
    const colKey = target.getAttribute('data-colkey');
    const targetCol = leafColumns.find((t) => t.colKey === colKey);
    if (!targetCol) return;

    const targetBoundRect = target.getBoundingClientRect();
    const thRightCursor = targetBoundRect.right - e.pageX <= DISTANCE;
    const thLeftCursor = e.pageX - targetBoundRect.left <= DISTANCE;
    const isFixedToRight = isColRightFixActive(targetCol);

    const targetIndex = leafColumns.findIndex((t) => t.colKey === targetCol.colKey);

    if (isFixedToRight) {
      const colResizable = targetCol.resizable ?? true;
      if (colResizable) {
        target.style.cursor = 'col-resize';
        if (thLeftCursor) {
          const prevEl = target.previousElementSibling as HTMLElement;
          if (prevEl) {
            resizeLineParams.draggingCol = prevEl;
            resizeLineParams.effectCol = 'next';
          }
        } else if (thRightCursor) {
          resizeLineParams.draggingCol = target;
          resizeLineParams.effectCol = 'next';
        }
        return;
      }
    }
    // 普通列的处理：拖拽右侧边界调整当前列（左侧列）
    else if (thRightCursor) {
      const colResizable = targetCol.resizable ?? true;
      if (colResizable) {
        target.style.cursor = 'col-resize';
        resizeLineParams.draggingCol = target;
        resizeLineParams.effectCol = 'next';
        return;
      }
    }
    // 拖拽左侧边界调整前一列（左侧列）
    else if (thLeftCursor && targetIndex > 0) {
      const prevCol = leafColumns[targetIndex - 1];
      const prevColResizable = prevCol?.resizable ?? true;
      if (prevColResizable) {
        target.style.cursor = 'col-resize';

        // 在 DOM 中查找前一列的 th 元素
        const allThs = target.parentElement?.querySelectorAll('th[data-colkey]');
        let prevThElement: HTMLElement | null = null;
        if (allThs) {
          for (let i = 0; i < allThs.length; i++) {
            if (allThs[i].getAttribute('data-colkey') === prevCol.colKey) {
              prevThElement = allThs[i] as HTMLElement;
              break;
            }
          }
        }

        if (prevThElement) {
          resizeLineParams.draggingCol = prevThElement;
          resizeLineParams.effectCol = 'next';
          return;
        }
      }
    }
    // 重置记录值
    target.style.cursor = '';
    resizeLineParams.draggingCol = null;
    resizeLineParams.effectCol = null;
  };

  const getMinMaxColWidth = (targetCol: BaseTableCol<TableRowData>) => {
    const propMinWidth = isNumber(targetCol?.minWidth) ? targetCol.minWidth : parseInt(targetCol?.minWidth || '0', 10);
    return {
      minColWidth: Math.max(targetCol?.resize?.minWidth || DEFAULT_MIN_WIDTH, propMinWidth),
      maxColWidth: targetCol?.resize?.maxWidth || DEFAULT_MAX_WIDTH,
    };
  };

  const getNormalResizeInfo = (col: BaseTableCol, targetBoundRect: DOMRect, tableBoundRect: DOMRect) => {
    const resizeLinePos = targetBoundRect.right - tableBoundRect.left;
    const colLeft = targetBoundRect.left - tableBoundRect.left;
    const { minColWidth, maxColWidth } = getMinMaxColWidth(col);
    return {
      resizeLinePos,
      minResizeLineLeft: colLeft + minColWidth,
      maxResizeLineLeft: colLeft + maxColWidth,
    };
  };

  const getFixedToRightResizeInfo = (
    target: HTMLElement,
    col: BaseTableCol,
    effectPrevCol: BaseTableCol,
    targetBoundRect: DOMRect,
    tableBoundRect: DOMRect,
  ) => {
    const resizeLinePos = targetBoundRect.left - tableBoundRect.left;
    const targetCol = target.dataset.colkey === col.colKey ? col : effectPrevCol;
    const colLeft = targetBoundRect.left - tableBoundRect.left;
    const { minColWidth, maxColWidth } = getMinMaxColWidth(targetCol);
    return {
      resizeLinePos,
      minResizeLineLeft: colLeft + (targetBoundRect.width - maxColWidth),
      maxResizeLineLeft: colLeft + (targetBoundRect.width - minColWidth),
    };
  };

  const getTotalTableWidth = (thWidthList: { [key: string]: number }): number => {
    let tableWidth = 0;
    leafColumns.forEach((col) => {
      tableWidth += thWidthList[col.colKey];
    });
    return tableWidth;
  };

  const getSiblingColCanResizable = (
    newThWidthList: { [key: string]: number },
    effectNextCol: BaseTableCol,
    distance: number,
    index: number,
  ) => {
    let isWidthAbnormal = true;
    if (effectNextCol) {
      const { minColWidth, maxColWidth } = getMinMaxColWidth(effectNextCol);
      const targetNextColWidth = newThWidthList[effectNextCol.colKey] + distance;
      isWidthAbnormal = targetNextColWidth < minColWidth || targetNextColWidth > maxColWidth;
    }
    return !(isWidthAbnormal || isWidthOverflow || index === leafColumns.length - 1);
  };

  // 调整表格列宽
  const onColumnMousedown = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (e.button === CONTEXTMENU || !resizeLineParams.draggingCol) return;
    const target = resizeLineParams.draggingCol;
    const targetColKey = target.getAttribute('data-colkey');
    const targetCol = leafColumns.find((t) => t.colKey === targetColKey);
    if (!targetCol) return;

    const targetBoundRect = target.getBoundingClientRect();
    const tableBoundRect = tableContentRef.current?.getBoundingClientRect();
    const effectNextCol = effectColMap.current[targetCol.colKey]?.next;
    const effectPrevCol = effectColMap.current[targetCol.colKey]?.prev;

    const { resizeLinePos, minResizeLineLeft, maxResizeLineLeft } = isColRightFixActive(targetCol)
      ? getFixedToRightResizeInfo(target, targetCol, effectNextCol, targetBoundRect, tableBoundRect)
      : getNormalResizeInfo(targetCol, targetBoundRect, tableBoundRect);
    // 开始拖拽，记录下鼠标起始位置
    resizeLineParams.isDragging = true;
    resizeLineParams.draggingStart = e.pageX || 0;

    // 初始化 resizeLine 标记线
    if (resizeLineRef?.current) {
      const styles: CSSProperties = { ...resizeLineStyle };
      styles.display = 'block';
      styles.height = `${tableBoundRect.bottom - targetBoundRect.top}px`;
      styles.left = `${resizeLinePos}px`;
      const parent = tableContentRef.current.parentElement.getBoundingClientRect();
      styles.bottom = `${parent.bottom - tableBoundRect.bottom}px`;
      setResizeLineStyle(styles);
      resizeLineParams.resizeLineStyle = styles;
    }

    const onDragOver: EventListener = (e: MouseEvent) => {
      if (resizeLineParams.isDragging) {
        const left = resizeLinePos + e.x - resizeLineParams.draggingStart;
        let finalLeft = Math.min(Math.max(left, minResizeLineLeft), maxResizeLineLeft);

        // 检查是否允许调整相邻列宽
        const thWidthList = getThWidthList('calculate');
        const currentCol = effectColMap.current[targetCol.colKey]?.current;
        const rightCol = resizeLineParams.effectCol === 'next' ? currentCol.nextSibling : targetCol;
        const moveDistance = resizeLinePos - finalLeft;
        const targetIndex = leafColumns.findIndex((t) => t.colKey === targetCol.colKey);
        const canResizeSiblingColWidth = getSiblingColCanResizable(thWidthList, rightCol, moveDistance, targetIndex);

        // 当表格已超出且不允许调整相邻列时的特殊处理
        // 注意：moveDistance < 0 表示向右拖拽（扩大列宽），moveDistance > 0 表示向左拖拽（缩小列宽）
        if (!canResizeSiblingColWidth && isWidthOverflow) {
          if (resizeLineParams.effectCol === 'next') {
            // effectCol='next' 表示拖拽分割线调整左侧列
            // 向右拖拽（moveDistance < 0）= 扩大左侧列 = 增加表格总宽度 ✅ 允许
            // 向左拖拽（moveDistance > 0）= 缩小左侧列 = 减少表格总宽度 ✅ 允许
            // 所以不需要任何限制！
          } else if (resizeLineParams.effectCol === 'prev') {
            finalLeft = Math.max(finalLeft, resizeLinePos);
          }
        }

        const styles = {
          ...resizeLineParams.resizeLineStyle,
          left: `${finalLeft}px`,
        };
        resizeLineParams.resizeLineStyle = styles;
        setResizeLineStyle(styles);
      }
    };

    // 拖拽时鼠标可能会超出 table 范围，需要给 document 绑定拖拽相关事件
    const onDragEnd = () => {
      if (!resizeLineParams.isDragging) return;
      const moveDistance = resizeLinePos - (parseFloat(String(resizeLineParams.resizeLineStyle?.left || '')) || 0);

      const thWidthList = getThWidthList('calculate');
      const currentCol = effectColMap.current[targetCol.colKey]?.current;
      const currentSibling = resizeLineParams.effectCol === 'next' ? currentCol.prevSibling : currentCol.nextSibling;
      // 多行表头，列宽为最后一层的宽度，即叶子结点宽度
      const newThWidthList = { ...thWidthList };
      const initTableElmWidth = getTotalTableWidth(newThWidthList);

      // 当前列不允许修改宽度，就调整相邻列的宽度
      const tmpCurrentCol = targetCol.resizable !== false ? targetCol : currentSibling;

      const rightCol = resizeLineParams.effectCol === 'next' ? currentCol.nextSibling : targetCol;
      const targetIndex = leafColumns.findIndex((t) => t.colKey === targetCol.colKey);
      const siblingColResizable = getSiblingColCanResizable(newThWidthList, rightCol, moveDistance, targetIndex);

      if (resizeLineParams.effectCol === 'next') {
        // 右侧激活态的固定列，需特殊调整
        if (isColRightFixActive(targetCol)) {
          // 如果不相同，则表示改变相临的右侧列宽
          if (target.dataset.colkey !== targetCol.colKey) {
            newThWidthList[effectNextCol.colKey] += moveDistance;
          } else {
            newThWidthList[tmpCurrentCol.colKey] += moveDistance;
          }
        } else {
          // 非右侧激活态的固定列
          newThWidthList[tmpCurrentCol.colKey] -= moveDistance;
          if (siblingColResizable) {
            newThWidthList[effectNextCol.colKey] += moveDistance;
          } else {
            // 不允许调整相邻列时，将减少的宽度分配给最后一列，保持表格总宽度不变
            const lastCol = leafColumns[leafColumns.length - 1];
            if (lastCol && lastCol.colKey !== tmpCurrentCol.colKey) {
              newThWidthList[lastCol.colKey] += moveDistance;
            }
          }
        }
      } else if (resizeLineParams.effectCol === 'prev') {
        // 计算当前列的新宽度
        const { minColWidth } = getMinMaxColWidth(tmpCurrentCol);
        const newCurrentColWidth = Math.max(minColWidth, newThWidthList[tmpCurrentCol.colKey] - moveDistance);
        const actualMoveDistance = newThWidthList[tmpCurrentCol.colKey] - newCurrentColWidth;

        newThWidthList[tmpCurrentCol.colKey] = newCurrentColWidth;

        if (siblingColResizable && effectPrevCol) {
          newThWidthList[effectPrevCol.colKey] += actualMoveDistance;
        } else {
          // 不允许调整相邻列时，将减少的宽度分配给最后一列，保持表格总宽度不变
          const lastCol = leafColumns[leafColumns.length - 1];
          if (lastCol && lastCol.colKey !== tmpCurrentCol.colKey) {
            newThWidthList[lastCol.colKey] += actualMoveDistance;
          }
        }
      }

      updateThWidthList(newThWidthList);

      const tableWidth = getTotalTableWidth(newThWidthList);

      // 整个表格只有一列可以调整的场景
      if (!effectNextCol?.colKey) setTableElmWidth(Math.max(initTableElmWidth, Math.round(tableWidth)));
      else setTableElmWidth(Math.round(tableWidth));
      updateTableAfterColumnResize();

      // 恢复设置
      resizeLineParams.isDragging = false;
      resizeLineParams.draggingCol = null;
      resizeLineParams.effectCol = null;
      resizeLineParams.resizeLineStyle = null;
      target.style.cursor = '';
      setResizeLineStyle({
        ...resizeLineStyle,
        display: 'none',
        left: undefined,
      });
      off(document, 'mouseup', onDragEnd);
      off(document, 'mousemove', onDragOver);
      document.onselectstart = originalSelectStart;
      document.ondragstart = originalDragStart;
      onColumnResizeChange?.({ columnsWidth: newThWidthList });
    };

    on(document, 'mouseup', onDragEnd);
    on(document, 'mousemove', onDragOver);

    // 禁用鼠标的选中文字和拖放
    document.onselectstart = () => false;
    document.ondragstart = () => false;
  };

  /**
   * 对外暴露函数：更新列数量减少时的表格宽度
   * @params colKeys 减少的列
   */
  const updateTableWidthOnColumnChange = (colKeys: string[]) => {
    const thWidthList = getThWidthList('calculate');
    let reduceWidth = 0;
    colKeys.forEach((key) => {
      reduceWidth += thWidthList[key] || 0;
    });
    const oldTotalWidth = Object.values(thWidthList).reduce((r = 0, n) => r + n);
    setTableElmWidth(oldTotalWidth - reduceWidth);
  };

  return {
    resizeLineRef,
    resizeLineStyle,
    onColumnMouseover,
    onColumnMousedown,
    setEffectColMap,
    updateTableWidthOnColumnChange,
  };
}
