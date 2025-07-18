import { useEffect, useState, useMemo, useRef, WheelEvent, useCallback, MutableRefObject } from 'react';
import { get, pick, xorWith } from 'lodash-es';
import { getIEVersion } from '@tdesign/common-js/utils/helper';
import log from '@tdesign/common-js/log/index';
import { getScrollbarWidthWithCSS } from '@tdesign/common-js/utils/getScrollbarWidth';
import { ClassName, Styles } from '../../common';
import { BaseTableCol, TableRowData, TdBaseTableProps } from '../type';
import { FixedColumnInfo, TableRowFixedClasses, RowAndColFixedPosition, TableColFixedClasses } from '../interface';
import useDebounce from '../../hooks/useDebounce';
import usePrevious from '../../hooks/usePrevious';
import { resizeObserverElement, isLessThanIE11OrNotHaveResizeObserver } from '../utils';
import { off, on } from '../../_util/listener';
import { AffixRef } from '../../affix';

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
  } = props;
  const preFinalColumns = usePrevious(finalColumns);
  const [data, setData] = useState<TableRowData[]>([]);
  const tableContentRef = useRef<HTMLDivElement>(null);
  const [isFixedHeader, setIsFixedHeader] = useState(false);
  const [isWidthOverflow, setIsWidthOverflow] = useState(false);
  const tableElmRef = useRef<HTMLTableElement>(null);
  // CSS 样式设置了固定 6px
  const [scrollbarWidth, setScrollbarWidth] = useState(6);
  // 固定列、固定表头、固定表尾等内容的位置信息
  const [rowAndColFixedPosition, setRowAndColFixedPosition] = useState<RowAndColFixedPosition>(() => new Map());
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
  const [isFixedRightColumn, setIsFixedRightColumn] = useState(false);
  const [isFixedLeftColumn, setIsFixedLeftColumn] = useState(false);

  const columnResizable = props.resizable;

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
      if (col.fixed === 'right') {
        setIsFixedRightColumn(true);
      }
      if (col.fixed === 'left') {
        setIsFixedLeftColumn(true);
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
      left: isShowLeft && isFixedLeftColumn,
      right: isShowRight && isFixedRightColumn,
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

    // updateTableWidth(isHeightOverflow);
    // updateThWidthListHandler();
  }, []);

  const setTableElmWidth = (width: number) => {
    if (tableElmWidth.current === width) return;
    tableElmWidth.current = width;
  };

  const updateTableWidth = () => {
    const rect = tableContentRef.current?.getBoundingClientRect?.();
    if (!rect) return;
    // 存在纵向滚动条，且固定表头时，需去除滚动条宽度
    const reduceWidth = isFixedHeader ? scrollbarWidth : 0;
    tableWidth.current = rect.width - reduceWidth - (props.bordered ? 1 : 0);
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

  const calculateThWidthList = (trList: HTMLCollection) => {
    const widthMap: { [colKey: string]: number } = {};
    for (let i = 0, len = trList?.length; i < len; i++) {
      const thList = trList[i].children;
      // second for used for multiple row header
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

  const updateThWidthListHandler = () => {
    const timer = setTimeout(() => {
      updateTableWidth();
      if (notNeedThWidthList) return;
      const thead = tableContentRef.current?.querySelector('thead');
      if (!thead) return;
      updateThWidthList(thead.children);
      clearTimeout(timer);
    }, 0);
  };

  const emitScrollEvent = (e: WheelEvent<HTMLDivElement>) => {
    props.onScrollX?.({ e });
    props.onScrollY?.({ e });
    props.onScroll?.({ e });
  };

  const getThWidthList = (type?: 'default' | 'calculate') => {
    if (type === 'calculate') {
      const trList = tableContentRef.current?.querySelector('thead')?.children;
      return calculateThWidthList(trList);
    }
    return thWidthList.current || {};
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

  // 使用防抖函数，避免频繁触发
  const updateFixedHeaderByUseDebounce = useDebounce(() => {
    updateFixedHeader();
  }, 30);

  /**
   * 通过监测表格大小变化，来调用 updateFixedHeader 修改状态
   */
  useEffect(() => {
    if (tableContentRef.current) {
      return resizeObserverElement(tableContentRef.current, updateFixedHeaderByUseDebounce);
    }
  }, [updateFixedHeaderByUseDebounce]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateFixedHeaderByUseDebounce, [maxHeight, data, columns, bordered, tableContentRef]);

  useEffect(() => {
    updateTableElmWidthOnColumnChange(finalColumns, preFinalColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalColumns]);

  // 影响表头宽度的元素
  useEffect(
    () => {
      const timer = setTimeout(() => {
        // updateTableWidth(isFixedHeader);
        updateThWidthListHandler();
        updateAffixPosition();
        clearTimeout(timer);
      }, 10);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // data,
      bordered,
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
    updateAffixPosition();

    if (isFixedColumn || isFixedHeader) {
      updateFixedStatus();
      updateColumnFixedShadow(tableContentRef.current, { skipScrollLimit: true });
    }
  };

  const onResize = useDebounce(() => {
    refreshTable();
  }, 30);

  function addTableResizeObserver(tableElement: HTMLDivElement) {
    /**
     * IE 11 以下使用 window resize；IE 11 以上使用 ResizeObserver
     * 抽离相关判断为单独的方法
     */
    if (isLessThanIE11OrNotHaveResizeObserver()) return;
    off(window, 'resize', onResize);
    if (!tableElmWidth.current) return;
    // 抽离 resize 为单独的方法，通过回调来执行操作
    return resizeObserverElement(tableElement, () => {
      const timer = setTimeout(() => {
        refreshTable();
        clearTimeout(timer);
      }, 60);
    });
  }

  useEffect(() => {
    const scrollWidth = getScrollbarWidthWithCSS();
    setScrollbarWidth(scrollWidth);

    const isWatchResize = isFixedColumn || isFixedHeader || !notNeedThWidthList || !data.length;
    const hasWindow = typeof window !== 'undefined';
    const hasResizeObserver = hasWindow && typeof window.ResizeObserver !== 'undefined';
    updateTableWidth();
    updateThWidthListHandler();
    // IE 11 以下使用 window resize；IE 11 以上使用 ResizeObserver
    if ((isWatchResize && getIEVersion() < 11) || !hasResizeObserver) {
      on(window, 'resize', onResize);
    }

    return () => {
      if ((isWatchResize && getIEVersion() < 11) || !hasResizeObserver) {
        if (typeof window !== 'undefined') {
          off(window, 'resize', onResize);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFixedColumn]);

  const updateTableAfterColumnResize = () => {
    updateFixedStatus();
    updateFixedHeader();
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
    addTableResizeObserver,
    updateTableAfterColumnResize,
  };
}
