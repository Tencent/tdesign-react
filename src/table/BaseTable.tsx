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
import { BaseTableProps } from './interface';
import useStyle, { formatCSSUnit } from './hooks/useStyle';
import useClassName from './hooks/useClassName';
import { getAffixProps } from './utils';

import { StyledProps } from '../common';

export const BASE_TABLE_EVENTS = ['page-change', 'cell-click', 'scroll', 'scrollX', 'scrollY'];
export const BASE_TABLE_ALL_EVENTS = ROW_LISTENERS.map((t) => `row-${t}`).concat(BASE_TABLE_EVENTS);

export interface TableListeners {
  [key: string]: Function;
}

export interface TBaseTableProps extends BaseTableProps, StyledProps {}

const BaseTable = forwardRef((props: TBaseTableProps, ref) => {
  const { tableLayout, height, data, columns, style, headerAffixedTop, bordered } = props;
  const tableRef = useRef<HTMLDivElement>();
  const tableElmRef = useRef<HTMLTableElement>();
  const [tableFootHeight, setTableFootHeight] = useState(0);
  const { virtualScrollClasses, tableLayoutClasses, tableBaseClass, tableColFixedClasses } = useClassName();
  // 表格基础样式类
  const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
  // const [global] = useLocaleReceiver('table');

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
    emitScrollEvent,
    setUseFixedTableElmRef,
    updateColumnFixedShadow,
  } = useFixed(props);

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

  const { isMultipleHeader, spansAndLeafNodes, thList } = useTableHeader({ columns: props.columns });
  const { dataSource, isPaginateData, renderPagination } = usePagination(props);

  // 列宽拖拽逻辑
  const columnResizeParams = useColumnResize(tableContentRef, refreshTable);
  const { resizeLineRef, resizeLineStyle } = columnResizeParams;

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

  const isVirtual = useMemo(
    () => props.scroll?.type === 'virtual' && props.data?.length > (props.scroll?.threshold || 100),
    [props.data?.length, props.scroll?.threshold, props.scroll?.type],
  );

  const showRightDivider = useMemo(
    () => props.bordered && isFixedHeader && ((isMultipleHeader && isWidthOverflow) || !isMultipleHeader),
    [isFixedHeader, isMultipleHeader, isWidthOverflow, props.bordered],
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spansAndLeafNodes.leafColumns]);

  useImperativeHandle(ref, () => ({
    tableElement: tableRef.current,
    tableHtmlElement: tableElmRef.current,
    tableContentElement: tableContentRef.current,
    affixHeaderElement: affixHeaderRef.current,
  }));

  const onFixedChange = () => {
    const timer = setTimeout(() => {
      onHorizontalScroll();
      updateAffixHeaderOrFooter();
      clearTimeout(timer);
    }, 0);
  };

  let lastScrollY = 0;
  const onInnerVirtualScroll = (e: WheelEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const top = target.scrollTop;
    // 排除横向滚动出发的纵向虚拟滚动计算
    if (lastScrollY !== top) {
      // TODO
      // isVirtual.value && handleVirtualScroll();
    } else {
      lastScrollY = 0;
      updateColumnFixedShadow(target);
    }
    lastScrollY = top;
    emitScrollEvent(e);
  };

  // used for top margin
  const getTFootHeight = () => {
    if (!tableElmRef.current) return;
    const timer = setTimeout(() => {
      const height = tableElmRef.current?.querySelector('tfoot')?.getBoundingClientRect().height;
      setTableFootHeight(height);
      clearTimeout(timer);
    });
  };

  useEffect(() => {
    setTableContentRef(tableContentRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableContentRef]);

  useEffect(getTFootHeight, [tableElmRef]);

  const newData = isPaginateData ? dataSource : data;

  const defaultColWidth = props.tableLayout === 'fixed' && isWidthOverflow ? '100px' : undefined;
  const colgroup = (
    <colgroup>
      {(spansAndLeafNodes?.leafColumns || columns).map((col, index) => (
        <col key={col.colKey || index} style={{ width: formatCSSUnit(col.width) || defaultColWidth }}></col>
      ))}
    </colgroup>
  );

  /**
   * Affixed Header
   */
  // onlyVirtualScrollBordered 用于浏览器兼容性处理，只有 chrome 需要调整 bordered，FireFox 和 Safari 不需要
  const onlyVirtualScrollBordered =
    !!(isVirtual && !headerAffixedTop && bordered) && /Chrome/.test(navigator?.userAgent);
  const borderWidth = bordered && onlyVirtualScrollBordered ? 1 : 0;
  const affixHeaderWrapHeight =
    (affixHeaderRef.current?.getBoundingClientRect().height || 0) - scrollbarWidth - borderWidth;
  // 两类场景：1. 虚拟滚动，永久显示表头，直到表头消失在可视区域； 2. 表头吸顶，根据滚动情况判断是否显示吸顶表头
  const headerOpacity = headerAffixedTop ? Number(showAffixHeader) : 1;
  const affixHeaderWrapHeightStyle = {
    width: `${tableWidth}px`,
    height: `${affixHeaderWrapHeight}px`,
    opacity: headerOpacity,
    marginTop: onlyVirtualScrollBordered ? `${borderWidth}px` : 0,
  };
  const affixedHeader = Boolean(props.headerAffixedTop && tableWidth) && (
    <div
      ref={affixHeaderRef}
      style={{ width: `${tableWidth - 1}px`, opacity: headerOpacity }}
      className={classNames(['scrollbar', { [tableBaseClass.affixedHeaderElm]: props.headerAffixedTop || isVirtual }])}
    >
      <table className={classNames(tableElmClasses)} style={{ ...tableElementStyles, width: `${tableElmWidth}px` }}>
        {colgroup}
        <THead
          isFixedHeader={isFixedHeader}
          rowAndColFixedPosition={rowAndColFixedPosition}
          isMultipleHeader={isMultipleHeader}
          bordered={props.bordered}
          spansAndLeafNodes={spansAndLeafNodes}
          thList={thList}
          thWidthList={thWidthList}
          resizable={props.resizable}
          columnResizeParams={columnResizeParams}
        />
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

  /**
   * Affixed Footer
   */
  let marginScrollbarWidth = isWidthOverflow ? scrollbarWidth : 0;
  if (bordered) {
    marginScrollbarWidth += 1;
  }
  // Hack: Affix 组件，marginTop 临时使用 负 margin 定位位置
  const affixedFooter = Boolean(props.footerAffixedBottom && props.footData?.length && tableWidth) && (
    <Affix
      className={tableBaseClass.affixedFooterWrap}
      onFixedChange={onFixedChange}
      offsetBottom={marginScrollbarWidth || 0}
      {...getAffixProps(props.footerAffixedBottom)}
      style={{ marginTop: `${-1 * (tableFootHeight + marginScrollbarWidth)}px` }}
    >
      <div
        ref={affixFooterRef}
        style={{ width: `${tableWidth}px`, opacity: Number(showAffixFooter) }}
        className={classNames([
          'scrollbar',
          { [tableBaseClass.affixedFooterElm]: props.footerAffixedBottom || isVirtual },
        ])}
      >
        <table className={tableElmClasses} style={{ ...tableElementStyles, width: `${tableElmWidth}px` }}>
          {colgroup}
          <TFoot
            rowKey={props.rowKey}
            isFixedHeader={isFixedHeader}
            rowAndColFixedPosition={rowAndColFixedPosition}
            footData={props.footData}
            columns={spansAndLeafNodes?.leafColumns || columns}
            rowAttributes={props.rowAttributes}
            rowClassName={props.rowClassName}
            thWidthList={thWidthList}
          ></TFoot>
        </table>
      </div>
    </Affix>
  );

  const translate = `translate(0, ${0}px)`;
  const virtualStyle = {
    transform: translate,
    '-ms-transform': translate,
    '-moz-transform': translate,
    '-webkit-transform': translate,
  };
  const tableBodyProps = {
    rowAndColFixedPosition,
    showColumnShadow,
    // data: isVirtual ? visibleData : data,
    data: newData,
    columns: spansAndLeafNodes?.leafColumns || columns,
    tableElm: tableRef.current,
    tableContentElm: tableContentRef.current,
    tableWidth,
    isWidthOverflow,
    rowKey: props.rowKey || 'id',
    // 虚拟滚动相关属性
    // isVirtual,
    // translateY: translateY,
    // scrollType: scrollType,
    // rowHeight: rowHeight,
    // trs: trs,
    // bufferSize: bufferSize,
    scroll: props.scroll,
    // handleRowMounted: handleRowMounted,
    renderExpandedRow: props.renderExpandedRow,
    ...pick(props, extendTableProps),
  };
  const tableContent = (
    <div
      ref={tableContentRef}
      className={tableBaseClass.content}
      style={tableContentStyles}
      onScroll={onInnerVirtualScroll}
    >
      {isVirtual && <div className={virtualScrollClasses.cursor} style={virtualStyle} />}
      <table ref={tableElmRef} className={classNames(tableElmClasses)} style={tableElementStyles}>
        {colgroup}
        <THead
          isFixedHeader={isFixedHeader}
          rowAndColFixedPosition={rowAndColFixedPosition}
          isMultipleHeader={isMultipleHeader}
          bordered={props.bordered}
          spansAndLeafNodes={spansAndLeafNodes}
          thList={thList}
          resizable={props.resizable}
          columnResizeParams={columnResizeParams}
        />
        <TBody {...tableBodyProps} />
        <TFoot
          rowKey={props.rowKey}
          isFixedHeader={isFixedHeader}
          rowAndColFixedPosition={rowAndColFixedPosition}
          footData={props.footData}
          columns={spansAndLeafNodes?.leafColumns || columns}
          rowAttributes={props.rowAttributes}
          rowClassName={props.rowClassName}
        ></TFoot>
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
    <div ref={paginationRef} style={{ opacity: Number(showAffixPagination) }}>
      {renderPagination()}
    </div>
  );
  const bottom = !!bottomContent && <div className={tableBaseClass.bottomContent}>{bottomContent}</div>;

  return (
    <div ref={tableRef} className={classNames(dynamicBaseTableClasses)} style={{ position: 'relative', ...style }}>
      {!!topContent && <div className={tableBaseClass.topContent}>{topContent}</div>}

      {!!(isVirtual || props.headerAffixedTop) &&
        (props.headerAffixedTop ? (
          <Affix
            offsetTop={0}
            {...getAffixProps(props.headerAffixedTop, props.headerAffixProps)}
            onFixedChange={onFixedChange}
          >
            {affixHeaderWithWrap}
          </Affix>
        ) : (
          isFixedHeader && affixHeaderWithWrap
        ))}

      {tableContent}

      {affixedFooter}

      {loadingContent}

      {showRightDivider && (
        <div
          className={tableBaseClass.scrollbarDivider}
          style={{
            right: `${scrollbarWidth}px`,
            height: `${tableContentRef.current?.getBoundingClientRect().height}px`,
          }}
        ></div>
      )}

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
              width: `${tableWidth}px`,
              overflow: 'auto',
              opacity: Number(showAffixFooter),
            }}
          >
            <div style={{ width: `${tableElmWidth}px`, height: '5px' }}></div>
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

export default BaseTable;
