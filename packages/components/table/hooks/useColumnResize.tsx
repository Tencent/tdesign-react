/**
 * important info: only resize happened, th width calculating allowed
 * 验证场景：多级表头调整叶子结点列宽、吸顶表头调整列宽、列数量发生变化、表格未超出、表格已超出
 * - 始终调整分割线 (Resize Line) 左侧列的宽度
 * - 若表格宽度已超出，直接改变左侧列宽，同时改变表格总宽度
 * - 若表格宽度未超出，改变左侧列宽的同时，调整右侧列或最后一列的宽度以保持总宽度不变
 */

import { isNumber } from 'lodash-es';
import React, { CSSProperties, MutableRefObject, useEffect, useRef, useState } from 'react';
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

  const resizeParams = {
    isResizing: false,
    resizeEl: null as HTMLElement,
    resizeCol: null as BaseTableCol<TableRowData>,
    resizeStart: 0,
    resizeLineStyle: {} as CSSProperties,
  };

  const resizeLineRef = useRef<HTMLDivElement>(null);
  const effectColMap = useRef<{ [colKey: string]: any }>({});

  const [leafColumns, setLeafColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [resizeLineStyle, setResizeLineStyle] = useState<CSSProperties>({
    display: 'none',
    left: '10px',
    height: '10px',
    bottom: '0',
  });

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

  const setEffectColMap = (
    leafColumns: BaseTableCol<TableRowData>[],
    originalColumns: BaseTableCol<TableRowData>[],
  ) => {
    if (!leafColumns) return;

    const collectAllColumns = (cols: BaseTableCol<TableRowData>[], result: BaseTableCol<TableRowData>[] = []) => {
      if (!cols) return result;
      cols.forEach((col) => {
        result.push(col);
        if (col.children?.length) {
          collectAllColumns(col.children, result);
        }
      });
      return result;
    };

    setAllColumns(collectAllColumns(originalColumns));
    setLeafColumns(leafColumns);

    leafColumns.forEach((n, index) => {
      effectColMap.current[n.colKey] = {
        prevSibling: getSiblingResizableCol(leafColumns, index - 1, 'prev'),
        nextSibling: getSiblingResizableCol(leafColumns, index + 1, 'next'),
      };
    });
  };

  const isColRightFixActive = (col: BaseTableCol<TableRowData>) => col.fixed === 'right' && showColumnShadow.right;

  const getLeafColumns = (col: BaseTableCol<TableRowData>): BaseTableCol<TableRowData>[] => {
    if (!col.children || col.children.length === 0) {
      return [col];
    }
    const leaves: BaseTableCol<TableRowData>[] = [];
    col.children.forEach((child) => {
      leaves.push(...getLeafColumns(child));
    });
    return leaves;
  };

  const onColumnMouseover = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (!resizeLineRef.current || resizeParams.isResizing || !e.target) return;

    const target = (e.target as HTMLElement).closest('th');
    if (!target) return;

    const colKey = target.getAttribute('data-colkey');

    // 先在所有列中查找（包括父级列）
    const targetCol = allColumns.find((t) => t.colKey === colKey);
    if (!targetCol) return;

    // 多级表头，获取实际用于调整的叶子节点列
    let resizeCol = targetCol;
    if (targetCol.children && targetCol.children.length > 0) {
      const leaves = getLeafColumns(targetCol);
      // 使用最右侧的叶子节点
      resizeCol = leaves[leaves.length - 1];
    }

    const targetBoundRect = target.getBoundingClientRect();
    const shouldResizeCurrCol = targetBoundRect.right - e.pageX <= DISTANCE;
    const shouldResizePrevCol = e.pageX - targetBoundRect.left <= DISTANCE;
    const targetIndex = leafColumns.findIndex((t) => t.colKey === resizeCol.colKey);

    const updateResizeTarget = (element?: HTMLElement | null, resizeCol?: BaseTableCol<TableRowData>) => {
      if (element) {
        // eslint-disable-next-line no-param-reassign
        element.style.cursor = 'col-resize';
        // 存储实际用于调整的列
        resizeParams.resizeEl = element;
        resizeParams.resizeCol = resizeCol || null;
      } else {
        target.style.cursor = '';
        resizeParams.resizeEl = null;
        resizeParams.resizeCol = null;
      }
    };

    // 处理右侧固定列
    if (isColRightFixActive(resizeCol)) {
      const colResizable = resizeCol.resizable ?? true;
      if (!colResizable) {
        updateResizeTarget(null);
        return;
      }
      if (shouldResizePrevCol) {
        updateResizeTarget(target.previousElementSibling as HTMLElement);
      } else if (shouldResizeCurrCol) {
        updateResizeTarget(target, resizeCol);
      } else {
        updateResizeTarget(null);
      }
      return;
    }

    // 处理普通列
    if (shouldResizeCurrCol) {
      const colResizable = resizeCol.resizable ?? true;
      updateResizeTarget(colResizable ? target : null, resizeCol);
    } else if (shouldResizePrevCol && targetIndex > 0) {
      const prevCol = leafColumns[targetIndex - 1];
      const prevColResizable = prevCol?.resizable ?? true;
      if (prevColResizable) {
        const allThs = target.parentElement?.querySelectorAll('th[data-colkey]');
        if (allThs) {
          for (let i = 0; i < allThs.length; i++) {
            if (allThs[i].getAttribute('data-colkey') === prevCol.colKey) {
              updateResizeTarget(allThs[i] as HTMLElement, prevCol);
              return;
            }
          }
        }
      }
      updateResizeTarget(null);
    } else {
      updateResizeTarget(null);
    }
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

  const getTotalTableWidth = (thWidthList: { [key: string]: number }) => {
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

  const onColumnMousedown = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (e.button === CONTEXTMENU || !resizeParams.resizeEl) return;
    const target = resizeParams.resizeEl;

    let targetCol: BaseTableCol<TableRowData>;
    if (resizeParams.resizeCol) {
      targetCol = resizeParams.resizeCol;
    } else {
      const targetColKey = target.getAttribute('data-colkey');
      targetCol = leafColumns.find((t) => t.colKey === targetColKey);
    }

    if (!targetCol) return;

    const targetBoundRect = target.getBoundingClientRect();
    const tableBoundRect = tableContentRef.current?.getBoundingClientRect();
    const targetColInfo = effectColMap.current[targetCol.colKey];

    const { resizeLinePos, minResizeLineLeft, maxResizeLineLeft } = isColRightFixActive(targetCol)
      ? getFixedToRightResizeInfo(target, targetCol, targetColInfo?.nextSibling, targetBoundRect, tableBoundRect)
      : getNormalResizeInfo(targetCol, targetBoundRect, tableBoundRect);
    // 开始拖拽，记录下鼠标起始位置
    resizeParams.isResizing = true;
    resizeParams.resizeStart = e.pageX || 0;

    // 初始化 resizeLine 标记线
    if (resizeLineRef?.current) {
      const styles = { ...resizeLineStyle };
      styles.display = 'block';
      styles.height = `${tableBoundRect.bottom - targetBoundRect.top}px`;
      styles.left = `${resizeLinePos}px`;
      const parent = tableContentRef.current.parentElement.getBoundingClientRect();
      styles.bottom = `${parent.bottom - tableBoundRect.bottom}px`;
      setResizeLineStyle(styles);
      resizeParams.resizeLineStyle = styles;
    }

    const onDragOver: EventListener = (e: MouseEvent) => {
      if (resizeParams.isResizing) {
        const left = resizeLinePos + e.x - resizeParams.resizeStart;
        let finalLeft = Math.min(Math.max(left, minResizeLineLeft), maxResizeLineLeft);

        // 检查是否允许调整相邻列宽
        const thWidthList = getThWidthList('calculate');
        const rightCol = targetColInfo?.nextSibling;
        const moveDistance = resizeLinePos - finalLeft;
        const targetIndex = leafColumns.findIndex((t) => t.colKey === targetCol.colKey);
        const siblingColResizable = getSiblingColCanResizable(thWidthList, rightCol, moveDistance, targetIndex);

        // 表格超出时，不允许向右拖拽扩大列宽
        if (!siblingColResizable && isWidthOverflow) {
          finalLeft = Math.min(finalLeft, resizeLinePos);
        }

        const styles = {
          ...resizeParams.resizeLineStyle,
          left: `${finalLeft}px`,
        };
        resizeParams.resizeLineStyle = styles;
        setResizeLineStyle(styles);
      }
    };

    // 拖拽时鼠标可能会超出 table 范围，需要给 document 绑定拖拽相关事件
    const onDragEnd = () => {
      if (!resizeParams.isResizing) return;
      const moveDistance = resizeLinePos - (parseFloat(String(resizeParams.resizeLineStyle?.left || '')) || 0);

      const thWidthList = getThWidthList('calculate');
      const newThWidthList = { ...thWidthList };
      const initTableElmWidth = getTotalTableWidth(newThWidthList);

      // 当前列不允许修改宽度，就调整相邻列的宽度
      const tmpCurrentCol = targetCol.resizable !== false ? targetCol : targetColInfo?.prevSibling;

      const rightCol = targetColInfo?.nextSibling;
      const targetIndex = leafColumns.findIndex((t) => t.colKey === targetCol.colKey);
      const siblingColResizable = getSiblingColCanResizable(newThWidthList, rightCol, moveDistance, targetIndex);

      // 右侧激活态的固定列，需特殊调整
      if (isColRightFixActive(targetCol)) {
        // 如果不相同，则表示改变相临的右侧列宽
        if (target.dataset.colkey !== targetCol.colKey) {
          newThWidthList[targetColInfo.nextSibling.colKey] += moveDistance;
        } else {
          newThWidthList[tmpCurrentCol.colKey] += moveDistance;
        }
      } else {
        // 非右侧激活态的固定列
        newThWidthList[tmpCurrentCol.colKey] -= moveDistance;
        if (siblingColResizable) {
          newThWidthList[targetColInfo.nextSibling.colKey] += moveDistance;
        } else {
          // 不允许调整相邻列时，将减少的宽度分配给最后一列，保持表格总宽度不变
          const lastCol = leafColumns[leafColumns.length - 1];
          if (lastCol && lastCol.colKey !== tmpCurrentCol.colKey) {
            newThWidthList[lastCol.colKey] += moveDistance;
          }
        }
      }

      updateThWidthList(newThWidthList);

      const tableWidth = getTotalTableWidth(newThWidthList);

      // 整个表格只有一列可以调整的场景
      if (!targetColInfo?.nextSibling?.colKey) setTableElmWidth(Math.max(initTableElmWidth, Math.round(tableWidth)));
      else setTableElmWidth(Math.round(tableWidth));
      updateTableAfterColumnResize();

      // 恢复设置
      resizeParams.isResizing = false;
      resizeParams.resizeEl = null;
      resizeParams.resizeCol = null;
      resizeParams.resizeLineStyle = null;
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
