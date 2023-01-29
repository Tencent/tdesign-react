import { useEffect, useState, useMemo, useRef, WheelEvent } from 'react';
import get from 'lodash/get';
import { getIEVersion } from '../../_common/js/utils/helper';
import log from '../../_common/js/log';
import { ClassName, Styles } from '../../common';
import { BaseTableCol, TableRowData, TdBaseTableProps } from '../type';
import getScrollbarWidth from '../../_common/js/utils/getScrollbarWidth';
import { on, off } from '../../_util/dom';
import {
  FixedColumnInfo,
  TableRowFixedClasses,
  RowAndColFixedPosition,
  TableColFixedClasses,
  RecalculateColumnWidthFunc,
} from '../interface';
import useDebounce from '../../hooks/useDebounce';

// 固定列相关类名处理
export function getColumnFixedStyles(
  col: TdBaseTableProps['columns'][0],
  index: number,
  rowAndColFixedPosition: RowAndColFixedPosition,
  tableColFixedClasses: TableColFixedClasses,
): { style?: Styles; classes?: ClassName } {
  const fixedPos = rowAndColFixedPosition?.get(col.colKey || index);
  if (!fixedPos) return {};
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
    top: fixedTop ? `${fixedPos.top}px` : undefined,
    bottom: fixedBottom ? `${fixedPos.bottom}px` : undefined,
  };
  return {
    style: rowStyles,
    classes: rowClasses,
  };
}

export default function useFixed(props: TdBaseTableProps, finalColumns: BaseTableCol<TableRowData>[]) {
  const {
    // data,
    columns,
    tableLayout,
    tableContentWidth,
    fixedRows,
    firstFullRow,
    lastFullRow,
    maxHeight,
    headerAffixedTop,
    bordered,
    // scroll,
  } = props;
  const [data, setData] = useState<TableRowData[]>([]);
  const tableContentRef = useRef<HTMLDivElement>();
  const [isFixedHeader, setIsFixedHeader] = useState(false);
  const [isWidthOverflow, setIsWidthOverflow] = useState(false);
  const tableElmRef = useRef<HTMLTableElement>();
  // CSS 样式设置了固定 6px
  const [scrollbarWidth, setScrollbarWidth] = useState(6);
  // 固定列、固定表头、固定表尾等内容的位置信息
  const [rowAndColFixedPosition, setRowAndColFixedPosition] = useState<RowAndColFixedPosition>(new Map());
  const [showColumnShadow, setShowColumnShadow] = useState({
    left: false,
    right: false,
  });
  // 虚拟滚动无法使用 CSS sticky 固定表头
  const [virtualScrollHeaderPos, setVirtualScrollHeaderPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const tableWidth = useRef(0);
  const tableElmWidth = useRef(0);
  const thWidthList = useRef<{ [colKey: string]: number }>({});

  const [isFixedColumn, setIsFixedColumn] = useState(false);
  // const [isFixedRightColumn, setIsFixedRightColumn] = useState(false);
  // const [isFixedLeftColumn, setIsFixedLeftColumn] = useState(false);

  // const displayNoneElementRefresh = inject(TDisplayNoneElementRefresh, ref(0));

  const columnResizable = useMemo(() => props.resizable || false, [props.resizable]);

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

  const recalculateColWidth = useRef<RecalculateColumnWidthFunc>(null);

  function setUseFixedTableElmRef(val: HTMLTableElement) {
    tableElmRef.current = val;
  }

  function setRecalculateColWidthFuncRef(val: RecalculateColumnWidthFunc) {
    recalculateColWidth.current = val;
  }

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
      // if (col.fixed === 'right') {
      //   setIsFixedRightColumn(true);
      // }
      // if (col.fixed === 'left') {
      //   setIsFixedLeftColumn(true);
      // }
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
      const colInfo = initialColumnMap.get(col.colKey || i);
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

  // 获取固定列位置信息。先获取节点宽度，再计算
  const setFixedColPosition = (trList: HTMLCollection, initialColumnMap: RowAndColFixedPosition) => {
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
          initialColumnMap.set(colKey, { ...obj, width: th?.getBoundingClientRect?.().width });
        }
      }
    }
    setFixedLeftPos(columns, initialColumnMap);
    setFixedRightPos(columns, initialColumnMap);
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
      initialColumnMap.set(rowId, { ...thisRowInfo, height: tr?.getBoundingClientRect?.().height });
    }
    for (let i = data.length - 1; i >= data.length - fixedBottomRows; i--) {
      const tr = trList[i] as HTMLElement;
      const rowId = get(data[i], rowKey);
      const thisRowInfo = initialColumnMap.get(rowId) || {};
      const lastRowId = get(data[i + 1], rowKey);
      const lastRowInfo = initialColumnMap.get(lastRowId) || {};
      let defaultBottom = 0;
      if (i === data.length - 1) {
        defaultBottom = tfoot?.getBoundingClientRect?.().height || 0;
      }
      thisRowInfo.bottom = (lastRowInfo.bottom || defaultBottom) + (lastRowInfo.height || 0);
      initialColumnMap.set(rowId, { ...thisRowInfo, height: tr?.getBoundingClientRect?.().height });
    }
  };

  const updateRowAndColFixedPosition = (tableContentElm: HTMLElement, initialColumnMap: RowAndColFixedPosition) => {
    rowAndColFixedPosition.clear();
    if (!tableContentElm) return;
    const thead = tableContentElm.querySelector('thead');
    // 处理固定列
    thead && setFixedColPosition(thead.children, initialColumnMap);
    // 处理冻结行
    const tbody = tableContentElm.querySelector('tbody');
    const tfoot = tableContentElm.querySelector('tfoot');
    tbody && setFixedRowPosition(tbody.children, initialColumnMap, thead, tfoot);
    // 更新最终 Map
    setRowAndColFixedPosition(initialColumnMap);
  };

  let shadowLastScrollLeft: number;
  const updateColumnFixedShadow = (target: HTMLElement, extra?: { skipScrollLimit?: boolean }) => {
    if (!isFixedColumn || !target) return;
    const { scrollLeft } = target;
    // 只有左右滚动，需要更新固定列阴影
    if (shadowLastScrollLeft === scrollLeft && (!extra || !extra.skipScrollLimit)) return;
    shadowLastScrollLeft = scrollLeft;
    const isShowRight = target.clientWidth + scrollLeft < target.scrollWidth;
    const isShowLeft = scrollLeft > 0;
    if (showColumnShadow.left === isShowLeft && showColumnShadow.right === isShowRight) return;
    setShowColumnShadow({
      left: isShowLeft,
      right: isShowRight,
    });
  };

  // 多级表头场景较为复杂：为了滚动的阴影效果，需要知道哪些列是边界列，左侧固定列的最后一列，右侧固定列的第一列，每一层表头都需要兼顾
  const setIsLastOrFirstFixedCol = (levelNodes: FixedColumnInfo[][]) => {
    for (let t = 0; t < levelNodes.length; t++) {
      const nodes = levelNodes[t];
      for (let i = 0, len = nodes.length; i < len; i++) {
        const colMapInfo = nodes[i];
        const nextColMapInfo = nodes[i + 1];
        const { parent } = colMapInfo;
        const isParentLastLeftFixedCol = !parent || parent?.lastLeftFixedCol;
        if (isParentLastLeftFixedCol && colMapInfo.col.fixed === 'left' && nextColMapInfo?.col.fixed !== 'left') {
          colMapInfo.lastLeftFixedCol = true;
        }
        const lastColMapInfo = nodes[i - 1];
        const isParentFirstRightFixedCol = !parent || parent?.firstRightFixedCol;
        if (isParentFirstRightFixedCol && colMapInfo.col.fixed === 'right' && lastColMapInfo?.col.fixed !== 'right') {
          colMapInfo.firstRightFixedCol = true;
        }
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateFixedStatus = () => {
    const { newColumnsMap, levelNodes } = getColumnMap(columns);
    setIsLastOrFirstFixedCol(levelNodes);
    const timer = setTimeout(() => {
      if (isFixedColumn || fixedRows?.length) {
        updateRowAndColFixedPosition(tableContentRef.current, newColumnsMap);
      }
      clearTimeout(timer);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  };

  const updateFixedHeader = () => {
    const timer = setTimeout(() => {
      const tRef = tableContentRef?.current;
      if (!tRef) return;
      setIsFixedHeader(tRef.scrollHeight > tRef.clientHeight);
      setIsWidthOverflow(tRef.scrollWidth > tRef.clientWidth);
      const pos = tRef?.getBoundingClientRect?.();
      setVirtualScrollHeaderPos({
        top: pos?.top,
        left: pos?.left,
      });
      clearTimeout(timer);
    }, 0);
  };

  const updateTableWidth = () => {
    const rect = tableContentRef.current?.getBoundingClientRect?.();
    if (!rect) return;
    // 存在纵向滚动条，且固定表头时，需去除滚动条宽度
    const reduceWidth = isFixedHeader ? scrollbarWidth : 0;
    tableWidth.current = rect.width - reduceWidth - (props.bordered ? 1 : 0);
    const elmRect = tableElmRef?.current?.getBoundingClientRect();
    tableElmWidth.current = elmRect?.width;
  };

  const updateThWidthList = (trList: HTMLCollection | { [colKey: string]: number }) => {
    if (trList instanceof HTMLCollection) {
      if (columnResizable) return;
      const widthMap: { [colKey: string]: number } = {};
      for (let i = 0, len = trList.length; i < len; i++) {
        const thList = trList[i].children;
        for (let j = 0, thLen = thList.length; j < thLen; j++) {
          const th = thList[j] as HTMLElement;
          const colKey = th.dataset.colkey;
          widthMap[colKey] = th?.getBoundingClientRect?.().width;
        }
      }
      thWidthList.current = widthMap;
    } else {
      Object.entries(trList).forEach(([colKey, width]) => {
        thWidthList.current[colKey] = width;
      });
    }
  };

  const updateThWidthListHandler = () => {
    if (columnResizable && recalculateColWidth.current) {
      recalculateColWidth.current(finalColumns, thWidthList.current, tableLayout, tableElmWidth.current);
    }
    if (notNeedThWidthList) return;
    const timer = setTimeout(() => {
      updateTableWidth();
      const thead = tableContentRef.current?.querySelector('thead');
      if (!thead) return;
      updateThWidthList(thead.children);
      clearTimeout(timer);
    }, 0);
  };

  const resetThWidthList = () => {
    thWidthList.current = {};
  };

  const emitScrollEvent = (e: WheelEvent<HTMLDivElement>) => {
    props.onScrollX?.({ e });
    props.onScrollY?.({ e });
    props.onScroll?.({ e });
  };

  const getThWidthList = () => thWidthList.current || {};

  useEffect(
    updateFixedStatus,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      data,
      columns,
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
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFixedColumn) {
        updateColumnFixedShadow(tableContentRef.current);
      }
      clearTimeout(timer);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFixedColumn, columns, tableContentRef]);

  useEffect(updateFixedHeader, [maxHeight, data, columns, bordered, tableContentRef]);

  useEffect(() => {
    resetThWidthList();
    if (columnResizable) {
      recalculateColWidth.current(finalColumns, thWidthList.current, tableLayout, tableElmWidth.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalColumns]);

  // 影响表头宽度的元素
  useEffect(
    updateThWidthListHandler,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      data,
      columns,
      bordered,
      tableLayout,
      fixedRows,
      isFixedHeader,
      headerAffixedTop,
      tableContentWidth,
      notNeedThWidthList,
      tableContentRef,
    ],
  );

  const refreshTable = useDebounce(() => {
    updateTableWidth();
    updateFixedHeader();
    updateThWidthListHandler();
    if (isFixedColumn || isFixedHeader) {
      updateFixedStatus();
      updateColumnFixedShadow(tableContentRef.current, { skipScrollLimit: true });
    }
  }, 30);

  const onResize = refreshTable;

  function addTableResizeObserver(tableElement: HTMLDivElement) {
    // IE 11 以下使用 window resize；IE 11 以上使用 ResizeObserver
    if (getIEVersion() < 11 || typeof window.ResizeObserver === 'undefined') return;
    off(window, 'resize', onResize);
    const resizeObserver = new window.ResizeObserver(() => {
      refreshTable();
    });
    resizeObserver.observe(tableElement);
    return () => {
      resizeObserver?.unobserve?.(tableElement);
      resizeObserver?.disconnect?.();
    };
  }

  useEffect(() => {
    const scrollWidth = getScrollbarWidth();
    setScrollbarWidth(scrollWidth);
    const isWatchResize = isFixedColumn || isFixedHeader || !notNeedThWidthList || !data.length;
    const timer = setTimeout(() => {
      updateTableWidth();
      if (columnResizable && recalculateColWidth.current) {
        recalculateColWidth.current(finalColumns, thWidthList.current, tableLayout, tableElmWidth.current);
      }
      // IE 11 以下使用 window resize；IE 11 以上使用 ResizeObserver
      if ((isWatchResize && getIEVersion() < 11) || typeof window.ResizeObserver === 'undefined') {
        on(window, 'resize', onResize);
      }
      clearTimeout(timer);
    });
    return () => {
      if ((isWatchResize && getIEVersion() < 11) || typeof window.ResizeObserver === 'undefined') {
        off(window, 'resize', onResize);
      }
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFixedColumn]);

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
    emitScrollEvent,
    updateThWidthListHandler,
    updateColumnFixedShadow,
    setUseFixedTableElmRef,
    getThWidthList,
    updateThWidthList,
    setRecalculateColWidthFuncRef,
    addTableResizeObserver,
  };
}
