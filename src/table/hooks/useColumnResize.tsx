import { useState, useRef, MutableRefObject, CSSProperties } from 'react';
import isNumber from 'lodash/isNumber';
import { BaseTableCol, TableRowData } from '../type';
import { RecalculateColumnWidthFunc } from '../interface';

const DEFAULT_MIN_WIDTH = 80;
const DEFAULT_MAX_WIDTH = 600;

export default function useColumnResize(
  tableContentRef: MutableRefObject<HTMLDivElement>,
  refreshTable: () => void,
  getThWidthList: () => { [colKeys: string]: number },
  updateThWidthList: (data: { [colKeys: string]: number }) => void,
) {
  const resizeLineRef = useRef<HTMLDivElement>();
  const notCalculateWidthCols = useRef<string[]>([]);

  const resizeLineParams = {
    isDragging: false,
    draggingCol: null as HTMLElement,
    draggingStart: 0,
  };

  const [resizeLineStyle, setResizeLineStyle] = useState<CSSProperties>({
    display: 'none',
    left: '10px',
    height: '10px',
    bottom: '0',
  });

  const setNotCalculateWidthCols = (colKeys: string[]) => {
    notCalculateWidthCols.current = colKeys;
  };

  let resizeLineLeft = '';

  // 表格列宽拖拽事件
  // 只在表头显示拖拽图标
  const onColumnMouseover = (e: MouseEvent) => {
    if (!resizeLineRef.current) return;

    const target = (e.target as HTMLElement).closest('th');
    const targetBoundRect = target.getBoundingClientRect();
    if (!resizeLineParams.isDragging) {
      // 当离右边框的距离不超过 8 时，显示拖拽图标
      const distance = 8;
      if (targetBoundRect.right - e.pageX <= distance) {
        target.style.cursor = 'col-resize';
        resizeLineParams.draggingCol = target;
      } else {
        target.style.cursor = '';
        resizeLineParams.draggingCol = null;
      }
    }
  };

  // 调整表格列宽
  const onColumnMousedown = (e: MouseEvent, col: BaseTableCol<TableRowData>, nearCol: BaseTableCol<TableRowData>) => {
    // 非 resize 的点击，不做处理
    if (!resizeLineParams.draggingCol) return;

    const target = (e.target as HTMLElement).closest('th');
    const targetBoundRect = target.getBoundingClientRect();
    const tableBoundRect = tableContentRef.current?.getBoundingClientRect();
    const resizeLinePos = targetBoundRect.right - tableBoundRect.left;
    const colLeft = targetBoundRect.left - tableBoundRect.left;
    const minColWidth = col.resize?.minWidth || DEFAULT_MIN_WIDTH;
    const maxColWidth = col.resize?.maxWidth || DEFAULT_MAX_WIDTH;
    const minResizeLineLeft = colLeft + minColWidth;
    const maxResizeLineLeft = colLeft + maxColWidth;

    // 开始拖拽，记录下鼠标起始位置
    resizeLineParams.isDragging = true;
    resizeLineParams.draggingStart = e.pageX || 0;

    const parent = tableContentRef.current.parentElement.getBoundingClientRect();
    const resizeLineBottom = `${parent.bottom - tableBoundRect.bottom}px`;

    // 初始化 resizeLine 标记线
    if (resizeLineRef?.current) {
      setResizeLineStyle({
        display: 'block',
        left: `${resizeLinePos}px`,
        height: `${tableBoundRect.bottom - targetBoundRect.top}px`,
        bottom: resizeLineBottom,
      });
    }

    const onDragOver: EventListener = (e: MouseEvent) => {
      // 计算新的列宽，新列宽不得小于最小列宽
      if (resizeLineParams.isDragging) {
        const left = resizeLinePos + e.x - resizeLineParams.draggingStart;
        const lineLeft = `${Math.min(Math.max(left, minResizeLineLeft), maxResizeLineLeft)}px`;
        setResizeLineStyle({
          display: 'block',
          left: lineLeft,
          height: `${tableBoundRect.bottom - targetBoundRect.top}px`,
          bottom: resizeLineBottom,
        });
        resizeLineLeft = lineLeft;
      }
    };

    const setThWidthListByColumnDrag = (
      dragCol: BaseTableCol<TableRowData>,
      dragWidth: number,
      nearCol: BaseTableCol<TableRowData>,
    ) => {
      const thWidthList = getThWidthList();

      const propColWidth = isNumber(dragCol.width) ? dragCol.width : parseFloat(dragCol.width);
      const propNearColWidth = isNumber(nearCol.width) ? nearCol.width : parseFloat(nearCol.width);
      const oldWidth = thWidthList[dragCol.colKey] || propColWidth;
      const oldNearWidth = thWidthList[nearCol.colKey] || propNearColWidth;

      updateThWidthList({
        [dragCol.colKey]: dragWidth,
        [nearCol.colKey]: Math.max(nearCol.resize?.minWidth || DEFAULT_MIN_WIDTH, oldWidth + oldNearWidth - dragWidth),
      });

      setNotCalculateWidthCols([dragCol.colKey, nearCol.colKey]);
    };

    // 拖拽时鼠标可能会超出 table 范围，需要给 document 绑定拖拽相关事件
    const onDragEnd = () => {
      if (resizeLineParams.isDragging) {
        // 结束拖拽，更新列宽
        let width = Math.ceil(parseInt(resizeLineLeft, 10) - colLeft) || 0;
        // 为了避免精度问题，导致 width 宽度超出 [minColWidth, maxColWidth] 的范围，需要对比目标宽度和最小/最大宽度
        if (width <= minColWidth) {
          width = minColWidth;
        } else if (width >= maxColWidth) {
          width = maxColWidth;
        }
        // 更新列宽
        setThWidthListByColumnDrag(col, width, nearCol);

        // 恢复设置
        resizeLineParams.isDragging = false;
        resizeLineParams.draggingCol = null;
        target.style.cursor = '';
        setResizeLineStyle({
          ...resizeLineStyle,
          display: 'none',
          left: '0',
        });
        document.removeEventListener('mousemove', onDragOver);
        document.removeEventListener('mouseup', onDragEnd);
        document.onselectstart = null;
        document.ondragstart = null;
      }

      refreshTable();
    };

    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('mousemove', onDragOver);

    // 禁用鼠标的选中文字和拖放
    document.onselectstart = () => false;
    document.ondragstart = () => false;
  };

  const recalculateColWidth: RecalculateColumnWidthFunc = (
    columns: BaseTableCol<TableRowData>[],
    thWidthList: { [colKey: string]: number },
    tableLayout: string,
    tableElmWidth: number,
  ): void => {
    let actualWidth = 0;
    const missingWidthCols: BaseTableCol<TableRowData>[] = [];
    const thMap: { [colKey: string]: number } = {};

    columns.forEach((col) => {
      if (!thWidthList[col.colKey]) {
        thMap[col.colKey] = isNumber(col.width) ? col.width : parseFloat(col.width);
      } else {
        thMap[col.colKey] = thWidthList[col.colKey];
      }
      const originWidth = thMap[col.colKey];
      if (originWidth) {
        actualWidth += originWidth;
      } else {
        missingWidthCols.push(col);
      }
    });

    let tableWidth = tableElmWidth;
    let needUpdate = false;
    if (tableWidth > 0) {
      if (missingWidthCols.length) {
        if (actualWidth < tableWidth) {
          const widthDiff = tableWidth - actualWidth;
          const avgWidth = widthDiff / missingWidthCols.length;
          missingWidthCols.forEach((col) => {
            thMap[col.colKey] = avgWidth;
          });
        } else if (tableLayout === 'fixed') {
          missingWidthCols.forEach((col) => {
            const originWidth = thMap[col.colKey] || 100;
            thMap[col.colKey] = isNumber(originWidth) ? originWidth : parseFloat(originWidth);
          });
        } else {
          const extraWidth = missingWidthCols.length * 100;
          const totalWidth = extraWidth + actualWidth;
          columns.forEach((col) => {
            if (!thMap[col.colKey]) {
              thMap[col.colKey] = (100 / totalWidth) * tableWidth;
            } else {
              thMap[col.colKey] = (thMap[col.colKey] / totalWidth) * tableWidth;
            }
          });
        }
        needUpdate = true;
      } else {
        if (notCalculateWidthCols.current.length) {
          let sum = 0;
          notCalculateWidthCols.current.forEach((colKey) => {
            sum += thMap[colKey];
          });
          actualWidth -= sum;
          tableWidth -= sum;
        }

        if (actualWidth !== tableWidth || notCalculateWidthCols.current.length) {
          columns.forEach((col) => {
            if (notCalculateWidthCols.current.includes(col.colKey)) return;
            thMap[col.colKey] = (thMap[col.colKey] / actualWidth) * tableWidth;
          });
          needUpdate = true;
        }
      }
    } else {
      missingWidthCols.forEach((col) => {
        const originWidth = thMap[col.colKey] || 100;
        thMap[col.colKey] = isNumber(originWidth) ? originWidth : parseFloat(originWidth);
      });

      needUpdate = true;
    }

    // 列宽转为整数
    if (needUpdate) {
      let addon = 0;
      Object.keys(thMap).forEach((key) => {
        const width = thMap[key];
        addon += width - Math.floor(width);
        thMap[key] = Math.floor(width) + (addon > 1 ? 1 : 0);
        if (addon > 1) {
          addon -= 1;
        }
      });
      if (addon > 0.5) {
        thMap[columns[0].colKey] += 1;
      }
    }

    updateThWidthList(thMap);

    if (notCalculateWidthCols.current.length) {
      notCalculateWidthCols.current = [];
    }
  };

  return {
    resizeLineRef,
    resizeLineStyle,
    onColumnMouseover,
    onColumnMousedown,
    recalculateColWidth,
  };
}
