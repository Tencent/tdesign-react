import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { get, pick, xorWith } from 'lodash-es';
import log from '@tdesign/common-js/log/index';
import { getScrollbarWidthWithCSS } from '@tdesign/common-js/utils/getScrollbarWidth';
import { getIEVersion } from '@tdesign/common-js/utils/helper';

import { off, on } from '../../_util/listener';
import useDeepEffect from '../../hooks/useDeepEffect';
import usePrevious from '../../hooks/usePrevious';
import { resizeObserverElement } from '../utils';
import { buildFixedLayoutState, markFixedColumnBoundaries } from '../utils/markFixedColumnBoundaries';
import {
  getDeferredRightFixedStickyColKeys,
  hasFixedColumnNeedReorder,
  readFixedLayoutScrollMetricsFromElement,
  resolveDisplayColumnsForFixed,
  resolveRightBorderBoundaryColKey,
  shouldShowLeftFixedColumnShadow,
  shouldShowRightFixedColumnShadow,
} from '../utils/reorderFixedColumns';

import type { MutableRefObject } from 'react';
import type { AffixRef } from '../../affix';
import type { ClassName, Styles } from '../../common';
import type { FixedColumnInfo, RowAndColFixedPosition, TableColFixedClasses, TableRowFixedClasses } from '../interface';
import type { BaseTableCol, TableRowData, TdBaseTableProps } from '../type';

// 固定列相关类名处理
export function getColumnFixedStyles(
  col: TdBaseTableProps['columns'][0],
  index: number,
  rowAndColFixedPosition: RowAndColFixedPosition,
  tableColFixedClasses: TableColFixedClasses,
): { style?: Styles; classes?: ClassName } {
  const fixedPos = rowAndColFixedPosition?.get(col.colKey || index);
  if (!fixedPos || fixedPos.deferRightSticky) return {};
  const thClasses = {
    [tableColFixedClasses.left]: col.fixed === 'left',
    [tableColFixedClasses.right]: col.fixed === 'right',
    [tableColFixedClasses.lastLeft]: col.fixed === 'left' && fixedPos.lastLeftFixedCol,
    [tableColFixedClasses.firstRight]: col.fixed === 'right' && fixedPos.firstRightFixedCol,
  };
  const thStyles = {
    left: col.fixed === 'left' ? `${fixedPos.left}px` : undefined,
    right: col.fixed === 'right' ? `${fixedPos.right}px` : undefined,
  };
  return {
    style: thStyles,
    classes: thClasses,
  };
}

// 固定行相关类名处理
export function getRowFixedStyles(
  rowId: string | number,
  rowIndex: number,
  rowLength: number,
  fixedRows: TdBaseTableProps['fixedRows'],
  rowAndColFixedPosition: RowAndColFixedPosition,
  tableRowFixedClasses: TableRowFixedClasses,
  // 和虚拟滚动搭配使用时，需要增加 style 的偏移量
  virtualTranslateY = 0,
): { style: Styles; classes: ClassName } {
  if (!fixedRows || !fixedRows.length) return { style: undefined, classes: undefined };
  const fixedTop = rowIndex < fixedRows[0];
  const fixedBottom = rowIndex > rowLength - 1 - fixedRows[1];
  const firstFixedBottomRow = rowLength - fixedRows[1];
  const fixedPos = rowAndColFixedPosition?.get(rowId) || {};
  const rowClasses = {
    [tableRowFixedClasses.top]: fixedTop,
    [tableRowFixedClasses.bottom]: fixedBottom,
    [tableRowFixedClasses.firstBottom]: rowIndex === firstFixedBottomRow,
    [tableRowFixedClasses.withoutBorderBottom]: rowIndex === firstFixedBottomRow - 1,
  };
  const rowStyles = {
    top: fixedTop ? `${fixedPos.top - virtualTranslateY}px` : undefined,
    bottom: fixedBottom ? `${fixedPos.bottom + virtualTranslateY}px` : undefined,
  };
  return {
    style: rowStyles,
    classes: rowClasses,
  };
}

export default function useFixed(
  props: TdBaseTableProps,
  finalColumns: BaseTableCol<TableRowData>[],
  originColumns: BaseTableCol<TableRowData>[] = finalColumns,
  affixRef?: {
    paginationAffixRef: MutableRefObject<AffixRef>;
    horizontalScrollAffixRef: MutableRefObject<AffixRef>;
    headerTopAffixRef: MutableRefObject<AffixRef>;
    footerBottomAffixRef: MutableRefObject<AffixRef>;
  },
) {
  const {
    columns,
    tableLayout,
    tableContentWidth,
    fixedRows,
    firstFullRow,
    lastFullRow,
    maxHeight,
    headerAffixedTop,
    bordered,
    resizable: columnResizable,
  } = props;

  const preFinalColumns = usePrevious(finalColumns);

  const tableContentRef = useRef<HTMLDivElement>(null);
  const tableElmRef = useRef<HTMLTableElement>(null);
  const thWidthList = useRef<{ [colKey: string]: number }>({});
  const lastFixedBorderSignatureRef = useRef('');

  const [data, setData] = useState<TableRowData[]>([]);
  const [isFixedHeader, setIsFixedHeader] = useState(false);
  const [isWidthOverflow, setIsWidthOverflow] = useState(false);
  const [tableWidth, setTableWidth] = useState(0);
  const [tableElmWidth, setTableElmWidthState] = useState(0);
  // CSS 样式设置了固定 6px
  const [scrollbarWidth, setScrollbarWidth] = useState(6);
  // 固定列、固定表头、固定表尾等内容的位置信息
  const [rowAndColFixedPosition, setRowAndColFixedPosition] = useState<RowAndColFixedPosition>(() => new Map());
  const [showColumnShadow, setShowColumnShadow] = useState({
    left: false,
    right: false,
  });
  // 虚拟滚动无法使用 CSS sticky 固定表头
  const [virtualScrollHeaderPos, setVirtualScrollHeaderPos] = useState<{
    left: number;
    top: number;
  }>({
    left: 0,
    top: 0,
  });
  const [isFixedColumn, setIsFixedColumn] = useState(false);

  // 没有表头吸顶，没有虚拟滚动，则不需要表头宽度计算
  const notNeedThWidthList = useMemo(
    () =>
      !(
        props.headerAffixedTop ||
        props.footerAffixedBottom ||
        props.horizontalScrollAffixedBottom ||
        props.scroll?.type === 'virtual'
      ),
    [props.footerAffixedBottom, props.headerAffixedTop, props.horizontalScrollAffixedBottom, props.scroll?.type],
  );

  function setUseFixedTableElmRef(val: HTMLTableElement) {
    tableElmRef.current = val;
  }

  const getFixedLayoutScrollMetrics = () =>
    readFixedLayoutScrollMetricsFromElement(tableContentRef.current, originColumns, thWidthList.current);

  const calculateThWidthList = (trList: HTMLCollection) => {
    const widthMap: { [colKey: string]: number } = {};
    for (let i = 0, len = trList?.length; i < len; i++) {
      const thList = trList[i].children;
      for (let j = 0, thLen = thList.length; j < thLen; j++) {
        const th = thList[j] as HTMLElement;
        const colKey = th.dataset.colkey;
        widthMap[colKey] = th.getBoundingClientRect().width;
      }
    }
    return widthMap;
  };

  const updateThWidthList = (trList: HTMLCollection | { [colKey: string]: number }) => {
    if (trList instanceof HTMLCollection) {
      if (columnResizable) return;
      thWidthList.current = calculateThWidthList(trList);
    } else {
      thWidthList.current = thWidthList.current || {};
      Object.entries(trList).forEach(([colKey, width]) => {
        thWidthList.current[colKey] = width;
      });
    }
    return thWidthList.current;
  };

  const getThWidthList = (type?: 'default' | 'calculate') => {
    if (type === 'calculate') {
      const trList = tableContentRef.current?.querySelector('thead')?.children;
      return calculateThWidthList(trList);
    }
    return thWidthList.current || {};
  };

  /** 内置重排时以 originColumns + 当前 scroll 解析展示列，避免 finalColumns 滞后导致 border 标记错乱 */
  const resolveDisplayColumns = (displayColumnsOverride?: BaseTableCol<TableRowData>[]) => {
    if (displayColumnsOverride) return displayColumnsOverride;
    if (hasFixedColumnNeedReorder(originColumns)) {
      return resolveDisplayColumnsForFixed(originColumns, getFixedLayoutScrollMetrics(), getThWidthList());
    }
    return finalColumns;
  };

  function getColumnMap(
    columns: BaseTableCol[],
    map: RowAndColFixedPosition = new Map(),
    levelNodes: FixedColumnInfo[][] = [],
    level = 0,
    parent?: FixedColumnInfo,
  ) {
    for (let i = 0, len = columns.length; i < len; i++) {
      const col = columns[i];
      if (['left', 'right'].includes(col.fixed)) {
        setIsFixedColumn(true);
      }
      const key = col.colKey || i;
      const columnInfo: FixedColumnInfo = { col, parent, index: i };
      map.set(key, columnInfo);
      if (col.children?.length) {
        getColumnMap(col.children, map, levelNodes, level + 1, columnInfo);
      }
      if (levelNodes[level]) {
        levelNodes[level].push(columnInfo);
      } else {
        // eslint-disable-next-line no-param-reassign
        levelNodes[level] = [columnInfo];
      }
    }
    return {
      newColumnsMap: map,
      levelNodes,
    };
  }

  const setFixedLeftPos = (
    columns: BaseTableCol[],
    initialColumnMap: RowAndColFixedPosition,
    parent: FixedColumnInfo = {},
  ) => {
    for (let i = 0, len = columns.length; i < len; i++) {
      const col = columns[i];
      if (col.fixed === 'right') return;
      const colInfo = initialColumnMap.get(col.colKey || i);
      let lastColIndex = i - 1;
      while (lastColIndex >= 0 && columns[lastColIndex].fixed !== 'left') {
        lastColIndex -= 1;
      }
      const lastCol = columns[lastColIndex];
      // 多级表头，使用父元素作为初始基本位置
      const defaultWidth = i === 0 ? parent?.left || 0 : 0;
      const lastColInfo = initialColumnMap.get(lastCol?.colKey || i - 1);
      colInfo.left = (lastColInfo?.left || defaultWidth) + (lastColInfo?.width || 0);
      // 多级表头
      if (col.children?.length) {
        setFixedLeftPos(col.children, initialColumnMap, colInfo);
      }
    }
  };

  const setFixedRightPos = (
    columns: BaseTableCol[],
    initialColumnMap: RowAndColFixedPosition,
    parent: FixedColumnInfo = {},
  ) => {
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i];
      if (col.fixed === 'left') return;
      const colKey = col.colKey || i;
      const colInfo = initialColumnMap.get(colKey);
      if (!colInfo) continue;
      if (col.fixed === 'right' && colInfo.deferRightSticky) continue;
      let lastColIndex = i + 1;
      while (lastColIndex < columns.length && columns[lastColIndex].fixed !== 'right') {
        lastColIndex += 1;
      }
      const lastCol = columns[lastColIndex];
      // 多级表头，使用父元素作为初始基本位置
      const defaultWidth = i === columns.length - 1 ? parent?.right || 0 : 0;
      const lastColInfo = initialColumnMap.get(lastCol?.colKey || i + 1);
      colInfo.right = (lastColInfo?.right || defaultWidth) + (lastColInfo?.width || 0);
      // 多级表头
      if (col.children?.length) {
        setFixedRightPos(col.children, initialColumnMap, colInfo);
      }
    }
  };

  const applyDeferredRightStickyFlags = (
    initialColumnMap: RowAndColFixedPosition,
    originCols: BaseTableCol<TableRowData>[] = originColumns,
    scrollMetrics = getFixedLayoutScrollMetrics(),
  ) => {
    const deferredKeys = getDeferredRightFixedStickyColKeys(originCols, scrollMetrics, getThWidthList());
    deferredKeys.forEach((colKey) => {
      const colInfo = initialColumnMap.get(colKey);
      if (colInfo?.col?.fixed === 'right') {
        initialColumnMap.set(colKey, { ...colInfo, deferRightSticky: true });
      }
    });
  };

  // 获取固定列位置信息。先获取节点宽度，再计算
  const setFixedColPosition = (
    trList: HTMLCollection,
    initialColumnMap: RowAndColFixedPosition,
    displayColumns: BaseTableCol<TableRowData>[] = finalColumns,
  ) => {
    if (!trList) return;
    for (let i = 0, len = trList.length; i < len; i++) {
      const thList = trList[i].children;
      for (let j = 0, thLen = thList.length; j < thLen; j++) {
        const th = thList[j] as HTMLElement;
        const colKey = th.dataset.colkey;
        if (!colKey) {
          log.warn('TDesign Table', `${th.innerText} missing colKey. colKey is required for fixed column feature.`);
        }
        const obj = initialColumnMap.get(colKey || j);
        if (obj?.col?.fixed) {
          initialColumnMap.set(colKey, {
            ...obj,
            width: th?.getBoundingClientRect?.().width,
          });
        }
      }
    }
    setFixedLeftPos(displayColumns, initialColumnMap);
    applyDeferredRightStickyFlags(initialColumnMap, originColumns, getFixedLayoutScrollMetrics());
    setFixedRightPos(displayColumns, initialColumnMap);
  };

  // 设置固定行位置信息 top/bottom
  const setFixedRowPosition = (
    trList: HTMLCollection,
    initialColumnMap: RowAndColFixedPosition,
    thead: HTMLTableSectionElement,
    tfoot: HTMLTableSectionElement,
  ) => {
    const [fixedTopRows, fixedBottomRows] = fixedRows || [];
    const { data, rowKey = 'id' } = props;
    for (let i = 0; i < fixedTopRows; i++) {
      const tr = trList[i] as HTMLElement;
      const rowId = get(data[i], rowKey);
      const thisRowInfo = initialColumnMap.get(rowId) || {};
      const lastRowId = get(data[i - 1], rowKey);
      const lastRowInfo = initialColumnMap.get(lastRowId) || {};
      let defaultBottom = 0;
      if (i === 0) {
        defaultBottom = thead?.getBoundingClientRect?.().height || 0;
      }
      thisRowInfo.top = (lastRowInfo.top || defaultBottom) + (lastRowInfo.height || 0);
      initialColumnMap.set(rowId, {
        ...thisRowInfo,
        height: tr?.getBoundingClientRect?.().height,
      });
    }
    for (let i = data.length - 1; i >= data.length - fixedBottomRows; i--) {
      /**
       * 下面是一个 Hack
       * 开启虚拟滚动的时候，当尾部冻结行不在可视区域，无法获取到高度
       * 目前取第一个数据行的高度进行计算，但在动态行高的场景下会有误差
       */
      const tr = trList[i] || trList[0];
      const rowId = get(data[i], rowKey);
      const thisRowInfo = initialColumnMap.get(rowId) || {};
      const lastRowId = get(data[i + 1], rowKey);
      const lastRowInfo = initialColumnMap.get(lastRowId) || {};
      let defaultBottom = 0;
      if (i === data.length - 1) {
        defaultBottom = tfoot?.getBoundingClientRect?.().height || 0;
      }
      thisRowInfo.bottom = (lastRowInfo.bottom || defaultBottom) + (lastRowInfo.height || 0);
      initialColumnMap.set(rowId, {
        ...thisRowInfo,
        height: tr?.getBoundingClientRect?.().height,
      });
    }
  };

  const updateRowAndColFixedPosition = (
    tableContentElm: HTMLElement | null,
    initialColumnMap: RowAndColFixedPosition,
    displayColumns: BaseTableCol<TableRowData>[] = finalColumns,
  ) => {
    if (!tableContentElm) {
      setRowAndColFixedPosition(new Map(initialColumnMap));
      return;
    }
    const thead = tableContentElm.querySelector('thead');
    // 处理固定列
    thead && setFixedColPosition(thead.children, initialColumnMap, displayColumns);
    // 处理冻结行
    const tbody = tableContentElm.querySelector('tbody');
    const tfoot = tableContentElm.querySelector('tfoot');
    tbody && setFixedRowPosition(tbody.children, initialColumnMap, thead, tfoot);
    // 克隆 Map 引用，确保 lastLeftFixedCol 变化能触发重渲染
    setRowAndColFixedPosition(new Map(initialColumnMap));
  };

  /** 将边界标记写入已有 fixed 位置 Map，供横向滚动轻量 border 同步 */
  const applyFixedBoundaryFlagsToMap = (
    columnMap: RowAndColFixedPosition,
    levelNodes: FixedColumnInfo[][],
  ): RowAndColFixedPosition => {
    const next = new Map(columnMap);
    for (let t = 0, tLen = levelNodes.length; t < tLen; t++) {
      const nodes = levelNodes[t];
      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const key = node.col.colKey ?? node.index;
        const existing = next.get(key);
        if (existing) {
          next.set(key, {
            ...existing,
            lastLeftFixedCol: node.lastLeftFixedCol,
            firstRightFixedCol: node.firstRightFixedCol,
            deferRightSticky: existing.deferRightSticky,
          });
        } else {
          next.set(key, { ...node });
        }
      }
    }
    return next;
  };

  const hasFixedSideColumn = (cols: BaseTableCol[] = [], side: 'left' | 'right'): boolean =>
    cols.some((col) => {
      if (col.fixed === side) return true;
      return col.children?.length ? hasFixedSideColumn(col.children, side) : false;
    });

  let shadowLastScrollLeft: number;
  const updateColumnFixedShadow = (
    target: HTMLElement,
    extra?: { skipScrollLimit?: boolean },
    displayColumnsOverride?: BaseTableCol<TableRowData>[],
  ) => {
    if (!isFixedColumn || !target) return;
    const { scrollLeft } = target;
    // 只有左右滚动，需要更新固定列阴影
    if (shadowLastScrollLeft === scrollLeft && (!extra || !extra.skipScrollLimit)) return;
    shadowLastScrollLeft = scrollLeft;
    const scrollMetrics = getFixedLayoutScrollMetrics();
    const colWidths = getThWidthList();
    const displayColumns = resolveDisplayColumns(displayColumnsOverride);
    const isShowRight = shouldShowRightFixedColumnShadow(originColumns, scrollMetrics, colWidths, displayColumns);
    const isShowLeft = shouldShowLeftFixedColumnShadow(originColumns, scrollLeft, colWidths);
    if (showColumnShadow.left === isShowLeft && showColumnShadow.right === isShowRight) return;
    setShowColumnShadow({
      left: isShowLeft && hasFixedSideColumn(originColumns, 'left'),
      right: isShowRight && hasFixedSideColumn(originColumns, 'right'),
    });
  };

  // 多级表头场景较为复杂：为了滚动的阴影效果，需要知道哪些列是边界列
  const buildLayoutForBoundaryMark = (
    displayColumns: BaseTableCol<TableRowData>[] = finalColumns,
    scrollMetrics = getFixedLayoutScrollMetrics(),
  ) => {
    const colWidths = getThWidthList();
    const layout = buildFixedLayoutState(originColumns, displayColumns, scrollMetrics, colWidths);
    if (!layout.right.enabled) return layout;

    const borderBoundaryColKey = resolveRightBorderBoundaryColKey(
      originColumns,
      displayColumns,
      scrollMetrics,
      colWidths,
    );
    const showShadow = shouldShowRightFixedColumnShadow(originColumns, scrollMetrics, colWidths, displayColumns);
    const right = {
      ...layout.right,
      borderBoundaryColKey,
      showShadow,
      sideLayoutSignature: `${borderBoundaryColKey ?? ''}|${showShadow ? 1 : 0}|${layout.right.reorderSignature}`,
    };

    return {
      ...layout,
      right,
      layoutSignature: `${layout.left.sideLayoutSignature}::${right.sideLayoutSignature}`,
    };
  };

  const hasFixedColumns = (cols: BaseTableCol[] = []): boolean =>
    cols.some((col) => {
      if (col.fixed === 'left' || col.fixed === 'right') return true;
      return col.children?.length ? hasFixedColumns(col.children) : false;
    });

  const updateFixedStatus = (displayColumnsOverride?: BaseTableCol<TableRowData>[]) => {
    setIsFixedColumn(false);
    const scrollMetrics = getFixedLayoutScrollMetrics();
    const displayColumns = resolveDisplayColumns(displayColumnsOverride);
    const { newColumnsMap, levelNodes } = getColumnMap(displayColumns);

    if (hasFixedColumns(displayColumns) || fixedRows?.length) {
      // 先算 sticky 偏移，再据 right 偏移标记 fixed-right-first（与 setFixedRightPos 同源）
      updateRowAndColFixedPosition(tableContentRef.current, newColumnsMap, displayColumns);
      const layoutForMark = buildLayoutForBoundaryMark(displayColumns, scrollMetrics);
      lastFixedBorderSignatureRef.current = layoutForMark.layoutSignature;
      markFixedColumnBoundaries(levelNodes, layoutForMark);
      setRowAndColFixedPosition((prev) => applyFixedBoundaryFlagsToMap(prev.size ? prev : newColumnsMap, levelNodes));
    } else {
      lastFixedBorderSignatureRef.current = '';
      setRowAndColFixedPosition(new Map());
    }
    updateColumnFixedShadow(tableContentRef.current, { skipScrollLimit: true }, displayColumns);
  };

  // 使用 useCallback 来优化性能
  const updateFixedHeader = useCallback(() => {
    const tRef = tableContentRef?.current;
    if (!tRef) return;

    const isHeightOverflow = tRef.scrollHeight > tRef.clientHeight;
    setIsFixedHeader(isHeightOverflow);
    setIsWidthOverflow(tRef.scrollWidth > tRef.clientWidth);
    const pos = tRef?.getBoundingClientRect?.();
    setVirtualScrollHeaderPos({
      top: pos?.top,
      left: pos?.left,
    });
  }, []);

  const setTableElmWidth = (width: number) => {
    if (tableElmWidth === width) return;
    setTableElmWidthState(width);
  };

  const updateTableWidth = () => {
    const tRef = tableContentRef.current;
    if (!tRef) return;
    // clientWidth excludes border and scrollbar
    setTableWidth(tRef.clientWidth);

    const elmRect = tableElmRef?.current?.getBoundingClientRect();
    if (elmRect?.width) {
      setTableElmWidth(elmRect?.width);
    }
  };

  // 在表格高度变化的时候 需要手动调整affix的位置 因为affix本身无法监听到这些变化触发重新计算
  const updateAffixPosition = () => {
    affixRef.paginationAffixRef.current?.handleScroll?.();
    affixRef.horizontalScrollAffixRef.current?.handleScroll?.();
    affixRef.headerTopAffixRef.current?.handleScroll?.();
    affixRef.footerBottomAffixRef.current?.handleScroll?.();
  };

  const updateThWidthListHandler = () => {
    if (notNeedThWidthList) return;
    const thead = tableContentRef.current?.querySelector('thead');
    if (!thead) return;
    updateThWidthList(thead.children);
  };

  const emitScrollEvent = (e: React.WheelEvent<HTMLDivElement>) => {
    props.onScrollX?.({ e });
    props.onScrollY?.({ e });
    props.onScroll?.({ e });
  };

  const updateTableElmWidthOnColumnChange = (
    finalColumns: BaseTableCol<TableRowData>[] = [],
    preFinalColumns: BaseTableCol<TableRowData>[] = [],
  ) => {
    const finalColKeys = finalColumns.map((t) => t.colKey);
    const preColKeys = (preFinalColumns ?? []).map((t) => t.colKey);

    if (finalColKeys.length < preColKeys.length) {
      const reduceKeys = xorWith(preColKeys, finalColKeys);
      const thWidthList = getThWidthList('calculate');
      let reduceWidth = 0;
      reduceKeys.forEach((key) => {
        reduceWidth += thWidthList[key];
      });
      const rootThWidthList = pick(thWidthList, preColKeys);
      if (!Object.values(rootThWidthList).length) return;
      const oldTotalWidth = Object.values(rootThWidthList).reduce((r = 0, n) => r + n);
      // 保留原有可能编辑过的列宽度，但是当剩余列过小时，表头小于内容宽，需要缩放回内容宽度
      // 使用不包含滚动条的可视化区域宽度，意味着当不再溢出的时候，将宽度设置回完整宽度
      const contentWidth = tableContentRef.current.clientWidth;
      const widthToReserve = oldTotalWidth - reduceWidth;
      setTableElmWidth(Math.max(contentWidth, widthToReserve));
    }
  };

  useDeepEffect(
    updateFixedStatus,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      data,
      finalColumns,
      bordered,
      tableLayout,
      tableContentWidth,
      isFixedHeader,
      isWidthOverflow,
      isFixedColumn,
      fixedRows,
      firstFullRow,
      lastFullRow,
      tableContentRef,
    ],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useDeepEffect(() => {
    if (isFixedColumn) {
      updateColumnFixedShadow(tableContentRef.current, { skipScrollLimit: true }, resolveDisplayColumns());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFixedColumn, finalColumns, tableContentRef]);

  useDeepEffect(updateFixedHeader, [maxHeight, data, columns, bordered, tableContentRef]);

  useDeepEffect(() => {
    updateTableElmWidthOnColumnChange(finalColumns, preFinalColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalColumns]);

  // 影响表头宽度的元素
  useDeepEffect(
    () => {
      updateThWidthListHandler();
      updateAffixPosition();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      bordered,
      columns,
      tableLayout,
      fixedRows,
      headerAffixedTop,
      tableContentWidth,
      notNeedThWidthList,
      tableContentRef,
    ],
  );

  const refreshTable = () => {
    updateThWidthListHandler();
    updateFixedHeader();
    updateTableWidth();
    updateAffixPosition();

    if (isFixedColumn || isFixedHeader) {
      updateFixedStatus();
      updateColumnFixedShadow(tableContentRef.current, {
        skipScrollLimit: true,
      });
    }
  };

  useEffect(() => {
    if (!tableContentRef.current) return;
    // IE 11 以上使用 ResizeObserver
    return resizeObserverElement(tableContentRef.current, refreshTable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDeepEffect(() => {
    const scrollWidth = getScrollbarWidthWithCSS();
    setScrollbarWidth(scrollWidth);

    const isWatchResize = isFixedColumn || isFixedHeader || !notNeedThWidthList || !data.length;
    const hasWindow = typeof window !== 'undefined';
    const hasResizeObserver = hasWindow && typeof window.ResizeObserver !== 'undefined';
    updateTableWidth();
    updateThWidthListHandler();
    // IE 11 以下使用 window resize
    if ((isWatchResize && getIEVersion() < 11) || !hasResizeObserver) {
      on(window, 'resize', refreshTable);
    }

    return () => {
      if ((isWatchResize && getIEVersion() < 11) || !hasResizeObserver) {
        if (typeof window !== 'undefined') {
          off(window, 'resize', refreshTable);
        }
      }
    };
  }, [isFixedColumn, isFixedHeader, isWidthOverflow, scrollbarWidth, notNeedThWidthList, data]);

  useEffect(() => {
    // 针对表格放在 Dialog 等有动画效果元素里的场景
    const tableContent = tableContentRef.current;
    if (!tableContent) return;
    const onAnimationEnd = (e: AnimationEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.contains(tableContent)) return;
      refreshTable();
    };
    on(document, 'animationend', onAnimationEnd, { capture: true });
    return () => {
      off(document, 'animationend', onAnimationEnd, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableAfterColumnResize = () => {
    updateFixedStatus();
    updateFixedHeader();
  };

  /** 横向滚动时同步 fixed 边界（左 last / 右 first），优先用已算好的 sticky right 偏移 */
  const syncFixedColumnBorder = (displayColumnsOverride?: BaseTableCol<TableRowData>[]) => {
    if (!hasFixedColumnNeedReorder(originColumns)) return;
    const scrollMetrics = getFixedLayoutScrollMetrics();
    const displayColumns = resolveDisplayColumns(displayColumnsOverride);
    const { newColumnsMap, levelNodes } = getColumnMap(displayColumns);
    const layoutForMark = buildLayoutForBoundaryMark(displayColumns, scrollMetrics);
    if (lastFixedBorderSignatureRef.current === layoutForMark.layoutSignature) return;
    lastFixedBorderSignatureRef.current = layoutForMark.layoutSignature;

    markFixedColumnBoundaries(levelNodes, layoutForMark);
    setRowAndColFixedPosition((prev) => applyFixedBoundaryFlagsToMap(prev.size ? prev : newColumnsMap, levelNodes));

    updateColumnFixedShadow(tableContentRef.current, { skipScrollLimit: true }, displayColumns);
  };

  return {
    tableWidth,
    tableElmWidth,
    thWidthList,
    isFixedHeader,
    isWidthOverflow,
    tableContentRef,
    isFixedColumn,
    showColumnShadow,
    rowAndColFixedPosition,
    virtualScrollHeaderPos,
    scrollbarWidth,
    setData,
    refreshTable,
    setTableElmWidth,
    emitScrollEvent,
    updateThWidthListHandler,
    updateColumnFixedShadow,
    setUseFixedTableElmRef,
    getThWidthList,
    updateThWidthList,
    updateTableAfterColumnResize,
    syncFixedColumnBorder,
  };
}
