import React, { useRef, useMemo, useImperativeHandle, forwardRef, useEffect, useState, WheelEvent } from 'react';
import pick from 'lodash/pick';
import classNames from 'classnames';
import TBody, { extendTableProps } from './TBody';
import { Affix } from '../affix';
import { ROW_LISTENERS } from './TR';
import THead from './THead';
import TFoot from './TFoot';
import useTableHeader from './hooks/useTableHeader';
import useColumnResize from './hooks/useColumnResize';
import useFixed from './hooks/useFixed';
import useAffix from './hooks/useAffix';
import usePagination from './hooks/usePagination';
import Loading from '../loading';
import { BaseTableProps, BaseTableRef } from './interface';
import useStyle, { formatCSSUnit } from './hooks/useStyle';
import useClassName from './hooks/useClassName';
import { getAffixProps } from './utils';
import { baseTableDefaultProps } from './defaultProps';
import { Styles } from '../common';
import { TableRowData } from './type';
import useVirtualScroll from '../hooks/useVirtualScroll';
import { getIEVersion } from '../_common/js/utils/helper';

export const BASE_TABLE_EVENTS = ['page-change', 'cell-click', 'scroll', 'scrollX', 'scrollY'];
export const BASE_TABLE_ALL_EVENTS = ROW_LISTENERS.map((t) => `row-${t}`).concat(BASE_TABLE_EVENTS);

export interface TableListeners {
  [key: string]: Function;
}

const BaseTable = forwardRef<BaseTableRef, BaseTableProps>((props, ref) => {
  const { tableLayout, height, data, columns, style, headerAffixedTop, bordered, resizable } = props;
  const tableRef = useRef<HTMLDivElement>();
  const tableElmRef = useRef<HTMLTableElement>();
  const bottomContentRef = useRef<HTMLDivElement>();
  const [tableFootHeight, setTableFootHeight] = useState(0);
  const { classPrefix, virtualScrollClasses, tableLayoutClasses, tableBaseClass, tableColFixedClasses } =
    useClassName();
  // 表格基础样式类
  const { tableClasses, sizeClassNames, tableContentStyles, tableElementStyles } = useStyle(props);
  const { isMultipleHeader, spansAndLeafNodes, thList } = useTableHeader({ columns: props.columns });
  const finalColumns = useMemo(
    () => spansAndLeafNodes?.leafColumns || columns,
    [spansAndLeafNodes?.leafColumns, columns],
  );

  // 固定表头和固定列逻辑
  const {
    scrollbarWidth,
    tableWidth,
    tableElmWidth,
    tableContentRef,
    isFixedHeader,
    isWidthOverflow,
    isFixedColumn,
    thWidthList,
    showColumnShadow,
    rowAndColFixedPosition,
    setData,
    refreshTable,
    setTableElmWidth,
    emitScrollEvent,
    setUseFixedTableElmRef,
    updateColumnFixedShadow,
    getThWidthList,
    updateThWidthList,
    addTableResizeObserver,
    updateTableAfterColumnResize,
  } = useFixed(props, finalColumns);

  // 1. 表头吸顶；2. 表尾吸底；3. 底部滚动条吸底；4. 分页器吸底
  const {
    affixHeaderRef,
    affixFooterRef,
    horizontalScrollbarRef,
    paginationRef,
    showAffixHeader,
    showAffixFooter,
    showAffixPagination,
    onHorizontalScroll,
    setTableContentRef,
    updateAffixHeaderOrFooter,
  } = useAffix(props);

  const { dataSource, innerPagination, isPaginateData, renderPagination } = usePagination(props);

  // 列宽拖拽逻辑
  const columnResizeParams = useColumnResize({
    isWidthOverflow,
    tableContentRef,
    showColumnShadow,
    getThWidthList,
    updateThWidthList,
    setTableElmWidth,
    updateTableAfterColumnResize,
    onColumnResizeChange: props.onColumnResizeChange,
  });
  const { resizeLineRef, resizeLineStyle, setEffectColMap, updateTableWidthOnColumnChange } = columnResizeParams;

  const dynamicBaseTableClasses = classNames(
    tableClasses.concat({
      [tableBaseClass.headerFixed]: isFixedHeader,
      [tableBaseClass.columnFixed]: isFixedColumn,
      [tableBaseClass.widthOverflow]: isWidthOverflow,
      [tableBaseClass.multipleHeader]: isMultipleHeader,
      [tableColFixedClasses.leftShadow]: showColumnShadow.left,
      [tableColFixedClasses.rightShadow]: showColumnShadow.right,
      [tableBaseClass.columnResizableTable]: props.resizable,
    }),
  );

  const tableElmClasses = classNames([
    [tableLayoutClasses[tableLayout || 'fixed']],
    { [tableBaseClass.fullHeight]: height },
  ]);

  const showRightDivider = useMemo(
    () => props.bordered && isFixedHeader && ((isMultipleHeader && isWidthOverflow) || !isMultipleHeader),
    [isFixedHeader, isMultipleHeader, isWidthOverflow, props.bordered],
  );

  const [dividerBottom, setDividerBottom] = useState(0);
  useEffect(() => {
    if (!bordered) return;
    const bottomRect = bottomContentRef.current?.getBoundingClientRect();
    const paginationRect = paginationRef.current?.getBoundingClientRect();
    const bottom = (bottomRect?.height || 0) + (paginationRect?.height || 0);
    setDividerBottom(bottom);
  }, [bottomContentRef, paginationRef, bordered]);

  useEffect(() => {
    setUseFixedTableElmRef(tableElmRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableElmRef]);

  useEffect(() => {
    setData(isPaginateData ? dataSource : props.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, dataSource, isPaginateData]);

  const [lastLeafColumns, setLastLeafColumns] = useState(props.columns || []);

  useEffect(() => {
    if (lastLeafColumns.map((t) => t.colKey).join() !== spansAndLeafNodes.leafColumns.map((t) => t.colKey).join()) {
      props.onLeafColumnsChange?.(spansAndLeafNodes.leafColumns);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setLastLeafColumns(spansAndLeafNodes.leafColumns);
    }
    setEffectColMap(spansAndLeafNodes.leafColumns, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spansAndLeafNodes.leafColumns]);

  const onFixedChange = () => {
    const timer = setTimeout(() => {
      onHorizontalScroll();
      updateAffixHeaderOrFooter();
      clearTimeout(timer);
    }, 0);
  };

  const virtualConfig = useVirtualScroll(tableContentRef, { data, scroll: props.scroll });

  let lastScrollY = -1;
  const onInnerVirtualScroll = (e: WheelEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const top = target.scrollTop;
    // 排除横向滚动出发的纵向虚拟滚动计算
    if (lastScrollY !== top) {
      virtualConfig.isVirtualScroll && virtualConfig.handleScroll();
    } else {
      lastScrollY = -1;
      updateColumnFixedShadow(target);
    }
    lastScrollY = top;
    emitScrollEvent(e);
  };

  /**
   * 横向滚动到指定列
   * 对外暴露方法，修改时需谨慎（expose）
   * @param colKey
   * @returns
   */
  const scrollColumnIntoView = (colKey: string) => {
    if (!tableContentRef.current) return;
    const thDom = tableContentRef.current.querySelector(`th[data-colkey="${colKey}"]`);
    const fixedThDom = tableContentRef.current.querySelectorAll('th.t-table__cell--fixed-left');
    let totalWidth = 0;
    for (let i = 0, len = fixedThDom.length; i < len; i++) {
      totalWidth += fixedThDom[i].getBoundingClientRect().width;
    }
    const domRect = thDom.getBoundingClientRect();
    const contentRect = tableContentRef.current.getBoundingClientRect();
    const distance = domRect.left - contentRect.left - totalWidth;
    tableContentRef.current.scrollTo({ left: distance, behavior: 'smooth' });
  };

  useImperativeHandle(ref, () => ({
    showColumnShadow,
    tableElement: tableRef.current,
    tableHtmlElement: tableElmRef.current,
    tableContentElement: tableContentRef.current,
    affixHeaderElement: affixHeaderRef.current,
    refreshTable,
    scrollToElement: virtualConfig.scrollToElement,
    scrollColumnIntoView,
    updateTableWidthOnColumnChange,
  }));

  // used for top margin
  const getTFootHeight = () => {
    const timer = setTimeout(() => {
      if (!tableElmRef.current) return;
      const height = tableElmRef.current.querySelector('tfoot')?.getBoundingClientRect().height;
      setTableFootHeight(height);
    }, 1);

    return () => {
      clearTimeout(timer);
    };
  };

  useEffect(() => {
    setTableContentRef(tableContentRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableContentRef]);

  useEffect(
    () => addTableResizeObserver(tableRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableRef],
  );

  useEffect(getTFootHeight, [tableElmRef]);

  const newData = isPaginateData ? dataSource : data;

  const renderColGroup = (isFixedHeader = true) => (
    <colgroup>
      {finalColumns.map((col) => {
        const style: Styles = {
          width: formatCSSUnit((isFixedHeader || resizable ? thWidthList.current[col.colKey] : undefined) || col.width),
        };
        if (col.minWidth) {
          style.minWidth = formatCSSUnit(col.minWidth);
        }
        // 没有设置任何宽度的场景下，需要保留表格正常显示的最小宽度，否则会出现因宽度过小的抖动问题
        if (!style.width && !col.minWidth && props.tableLayout === 'fixed') {
          style.minWidth = '80px';
        }
        return <col key={col.colKey} style={style} />;
      })}
    </colgroup>
  );
  const headProps = {
    isFixedHeader,
    rowAndColFixedPosition,
    isMultipleHeader,
    bordered: props.bordered,
    maxHeight: props.maxHeight,
    height: props.height,
    spansAndLeafNodes,
    thList,
    thWidthList: thWidthList.current,
    resizable: props.resizable,
    columnResizeParams,
    classPrefix,
    ellipsisOverlayClassName: props.size !== 'medium' ? sizeClassNames[props.size] : '',
    attach: props.attach,
    thDraggable: props.thDraggable,
    showColumnShadow,
  };

  const headUseMemoDependencies = [
    resizable,
    thWidthList,
    isFixedHeader,
    rowAndColFixedPosition,
    isMultipleHeader,
    spansAndLeafNodes,
    thList,
    columnResizeParams,
    classPrefix,
    props.bordered,
    props.resizable,
    props.size,
  ];

  // 多级表头左边线缺失
  const affixedLeftBorder = props.bordered ? 1 : 0;

  /**
   * Affixed Header
   */
  const renderFixedHeader = () => {
    if (!props.showHeader) return null;
    // IE浏览器需要遮挡header吸顶滚动条，要减去getBoundingClientRect.height的滚动条高度4像素
    const IEHeaderWrap = getIEVersion() <= 11 ? 4 : 0;
    const barWidth = isWidthOverflow ? scrollbarWidth : 0;
    const headerBarWidth = isFixedHeader ? scrollbarWidth : 0;
    const affixHeaderHeight = (affixHeaderRef.current?.getBoundingClientRect().height || 0) - IEHeaderWrap;
    const affixHeaderWrapHeight = affixHeaderHeight - barWidth;
    // 两类场景：1. 虚拟滚动，永久显示表头，直到表头消失在可视区域； 2. 表头吸顶，根据滚动情况判断是否显示吸顶表头
    const headerOpacity = headerAffixedTop ? Number(showAffixHeader) : 1;
    const affixHeaderWrapHeightStyle = {
      width: `${tableWidth.current - headerBarWidth}px`,
      height: `${affixHeaderWrapHeight}px`,
      opacity: headerOpacity,
    };
    const affixedHeader = Boolean((props.headerAffixedTop || virtualConfig.isVirtualScroll) && tableWidth.current) && (
      <div
        ref={affixHeaderRef}
        style={{ width: `${tableWidth.current - headerBarWidth - affixedLeftBorder}px`, opacity: headerOpacity }}
        className={classNames([
          'scrollbar',
          {
            [tableBaseClass.affixedHeaderElm]: props.headerAffixedTop || virtualConfig.isVirtualScroll,
          },
        ])}
      >
        <table
          className={classNames(tableElmClasses)}
          style={{ ...tableElementStyles, width: `${tableElmWidth.current}px` }}
        >
          {renderColGroup(true)}
          {props.showHeader && <THead {...headProps} />}
        </table>
      </div>
    );

    // 添加这一层，是为了隐藏表头的横向滚动条。如果以后不需要照顾 IE 10 以下的项目，则可直接移除这一层
    // 彼时，可更为使用 CSS 样式中的 .hideScrollbar()
    const affixHeaderWithWrap = (
      <div className={tableBaseClass.affixedHeaderWrap} style={affixHeaderWrapHeightStyle}>
        {affixedHeader}
      </div>
    );
    return affixHeaderWithWrap;
  };

  const renderAffixedHeader = () => {
    if (!props.showHeader) return null;
    return (
      !!(virtualConfig.isVirtualScroll || props.headerAffixedTop) &&
      (props.headerAffixedTop ? (
        <Affix
          offsetTop={0}
          {...getAffixProps(props.headerAffixedTop, props.headerAffixProps)}
          onFixedChange={onFixedChange}
        >
          {renderFixedHeader()}
        </Affix>
      ) : (
        isFixedHeader && renderFixedHeader()
      ))
    );
  };

  /**
   * Affixed Footer
   */
  const renderAffixedFooter = () => {
    let marginScrollbarWidth = isWidthOverflow ? scrollbarWidth : 0;
    if (bordered) {
      marginScrollbarWidth += 1;
    }
    // Hack: Affix 组件，marginTop 临时使用 负 margin 定位位置
    const affixedFooter = Boolean(props.footerAffixedBottom && props.footData?.length && tableWidth.current) && (
      <Affix
        className={tableBaseClass.affixedFooterWrap}
        onFixedChange={onFixedChange}
        offsetBottom={marginScrollbarWidth || 0}
        {...getAffixProps(props.footerAffixedBottom)}
        style={{ marginTop: `${-1 * (tableFootHeight + marginScrollbarWidth)}px` }}
      >
        <div
          ref={affixFooterRef}
          style={{ width: `${tableWidth.current - affixedLeftBorder}px`, opacity: Number(showAffixFooter) }}
          className={classNames([
            'scrollbar',
            { [tableBaseClass.affixedFooterElm]: props.footerAffixedBottom || virtualConfig.isVirtualScroll },
          ])}
        >
          <table className={tableElmClasses} style={{ ...tableElementStyles, width: `${tableElmWidth.current}px` }}>
            {renderColGroup(true)}
            <TFoot
              rowKey={props.rowKey}
              isFixedHeader={isFixedHeader}
              rowAndColFixedPosition={rowAndColFixedPosition}
              footData={props.footData}
              columns={spansAndLeafNodes?.leafColumns || columns}
              rowAttributes={props.rowAttributes}
              rowClassName={props.rowClassName}
              thWidthList={thWidthList.current}
              footerSummary={props.footerSummary}
              rowspanAndColspanInFooter={props.rowspanAndColspanInFooter}
            ></TFoot>
          </table>
        </div>
      </Affix>
    );
    return affixedFooter;
  };

  const tableBodyProps = {
    classPrefix,
    ellipsisOverlayClassName: props.size !== 'medium' ? sizeClassNames[props.size] : '',
    rowAndColFixedPosition,
    showColumnShadow,
    data: virtualConfig.isVirtualScroll ? virtualConfig.visibleData : newData,
    virtualConfig,
    handleRowMounted: virtualConfig.handleRowMounted,
    columns: spansAndLeafNodes?.leafColumns || columns,
    tableElm: tableRef.current,
    tableContentElm: tableContentRef.current,
    tableWidth: tableWidth.current,
    isWidthOverflow,
    rowKey: props.rowKey || 'id',
    scroll: props.scroll,
    cellEmptyContent: props.cellEmptyContent,
    renderExpandedRow: props.renderExpandedRow,
    ...pick(props, extendTableProps),
    pagination: innerPagination,
  };

  const translate = `translate(0, ${virtualConfig.scrollHeight}px)`;
  const virtualStyle = {
    transform: translate,
    msTransform: translate,
    MozTransform: translate,
    WebkitTransform: translate,
  };
  const tableContent = (
    <div
      ref={tableContentRef}
      className={tableBaseClass.content}
      style={tableContentStyles}
      onScroll={onInnerVirtualScroll}
    >
      {virtualConfig.isVirtualScroll && <div className={virtualScrollClasses.cursor} style={virtualStyle} />}

      <table
        ref={tableElmRef}
        className={classNames(tableElmClasses)}
        style={{
          ...tableElementStyles,
          width:
            resizable && isWidthOverflow && tableElmWidth.current
              ? `${tableElmWidth.current}px`
              : tableElementStyles.width,
        }}
      >
        {renderColGroup(false)}
        {useMemo(() => {
          if (!props.showHeader) return null;
          return <THead {...{ ...headProps, thWidthList: resizable ? thWidthList.current : {} }} />;
          // eslint-disable-next-line
        }, headUseMemoDependencies)}

        {useMemo(
          () => (
            <TBody {...tableBodyProps} />
          ),
          // eslint-disable-next-line
          [
            tableBodyProps.classPrefix,
            tableBodyProps.ellipsisOverlayClassName,
            tableBodyProps.rowAndColFixedPosition,
            tableBodyProps.showColumnShadow,
            tableBodyProps.data,
            tableBodyProps.columns,
            tableBodyProps.tableElm,
            tableBodyProps.tableContentElm,
            tableBodyProps.tableWidth,
            isWidthOverflow,
            props.rowKey,
            props.rowClassName,
            props.rowAttributes,
            props.loading,
            props.empty,
            props.fixedRows,
            props.firstFullRow,
            props.lastFullRow,
            props.rowspanAndColspan,
            props.scroll,
            props.cellEmptyContent,
          ],
        )}

        {useMemo(
          () => (
            <TFoot
              rowKey={props.rowKey}
              isFixedHeader={isFixedHeader}
              rowAndColFixedPosition={rowAndColFixedPosition}
              footData={props.footData}
              columns={spansAndLeafNodes?.leafColumns || columns}
              rowAttributes={props.rowAttributes}
              rowClassName={props.rowClassName}
              thWidthList={thWidthList.current}
              footerSummary={props.footerSummary}
              rowspanAndColspanInFooter={props.rowspanAndColspanInFooter}
            ></TFoot>
          ),
          // eslint-disable-next-line
          [
            isFixedHeader,
            rowAndColFixedPosition,
            spansAndLeafNodes,
            columns,
            thWidthList,
            props.rowKey,
            props.footData,
            props.rowAttributes,
            props.rowClassName,
            props.footerSummary,
          ],
        )}
      </table>
    </div>
  );

  const { loading, loadingProps } = props;
  const customLoadingText = loading;
  const loadingContent = loading !== undefined && (
    <Loading
      loading={!!loading}
      text={customLoadingText}
      attach={() => tableRef.current}
      showOverlay
      size="small"
      {...loadingProps}
    ></Loading>
  );

  const { topContent, bottomContent } = props;
  const pagination = (
    <div ref={paginationRef} className={tableBaseClass.paginationWrap} style={{ opacity: Number(showAffixPagination) }}>
      {renderPagination()}
    </div>
  );
  const bottom = !!bottomContent && (
    <div ref={bottomContentRef} className={tableBaseClass.bottomContent}>
      {bottomContent}
    </div>
  );

  return (
    <div ref={tableRef} className={classNames(dynamicBaseTableClasses)} style={{ position: 'relative', ...style }}>
      {!!topContent && <div className={tableBaseClass.topContent}>{topContent}</div>}

      {useMemo(
        renderAffixedHeader,
        // eslint-disable-next-line
        [
          // eslint-disable-next-line
          ...headUseMemoDependencies,
          showAffixHeader,
          tableWidth,
          tableElmWidth,
          affixHeaderRef,
          affixedLeftBorder,
          tableElmClasses,
          tableElementStyles,
          columns,
          spansAndLeafNodes,
          props.showHeader,
          props.headerAffixedTop,
        ],
      )}

      {tableContent}

      {/* eslint-disable-next-line */}
      {useMemo(renderAffixedFooter, [
        showAffixFooter,
        isFixedHeader,
        rowAndColFixedPosition,
        spansAndLeafNodes,
        columns,
        thWidthList,
        tableBaseClass,
        tableElementStyles,
        tableElmWidth,
        affixFooterRef,
        affixedLeftBorder,
        bordered,
        isWidthOverflow,
        scrollbarWidth,
        tableElmClasses,
        tableFootHeight,
        tableWidth,
        props.rowKey,
        props.footData,
        props.rowAttributes,
        props.rowClassName,
        props.footerSummary,
        props.footerAffixedBottom,
        props.rowspanAndColspanInFooter,
      ])}

      {loadingContent}

      {useMemo(() => {
        if (!showRightDivider) return null;
        return (
          <div
            className={tableBaseClass.scrollbarDivider}
            style={{
              right: `${scrollbarWidth}px`,
              bottom: dividerBottom ? `${dividerBottom}px` : undefined,
              height: `${tableContentRef.current?.getBoundingClientRect().height}px`,
            }}
          ></div>
        );
      }, [tableBaseClass, showRightDivider, scrollbarWidth, dividerBottom, tableContentRef])}

      {bottom}

      {/* 吸底的滚动条 */}
      {props.horizontalScrollAffixedBottom && (
        <Affix
          offsetBottom={0}
          {...getAffixProps(props.horizontalScrollAffixedBottom)}
          style={{ marginTop: `-${scrollbarWidth * 2}px` }}
        >
          <div
            ref={horizontalScrollbarRef}
            className={classNames(['scrollbar', tableBaseClass.obviousScrollbar])}
            style={{
              width: `${tableWidth.current}px`,
              overflow: 'auto',
              opacity: Number(showAffixFooter),
            }}
          >
            <div style={{ width: `${tableElmWidth.current}px`, height: '5px' }}></div>
          </div>
        </Affix>
      )}

      {/* 吸底的分页器 */}
      {props.paginationAffixedBottom ? (
        <Affix offsetBottom={0} {...getAffixProps(props.paginationAffixedBottom)}>
          {pagination}
        </Affix>
      ) : (
        pagination
      )}

      {/* 调整列宽时的指示线。由于层级需要比较高，因而放在根节点，避免被吸顶表头覆盖。非必要情况，请勿调整辅助线位置 */}
      <div ref={resizeLineRef} className={tableBaseClass.resizeLine} style={resizeLineStyle}></div>
    </div>
  );
});

BaseTable.displayName = 'BaseTable';

BaseTable.defaultProps = baseTableDefaultProps;

export default BaseTable as <T extends TableRowData = TableRowData>(
  props: BaseTableProps<T> & {
    ref?: React.Ref<BaseTableRef>;
  },
) => React.ReactElement;
