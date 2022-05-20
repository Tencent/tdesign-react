import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import pick from 'lodash/pick';
import classNames from 'classnames';

import Loading from '../loading';
import TBody, { extendTableProps } from './TBody';
import { Affix } from '../affix';
import { ROW_LISTENERS } from './TR';
import THead from './THead';
import TFoot from './TFoot';

import useTableHeader from './hooks/useTableHeader';
import useFixed from './hooks/useFixed';
import usePagination from './hooks/usePagination';
import { BaseTableProps } from './interface';
import useStyle, { formatCSSUnit } from './hooks/useStyle';
import useClassName from './hooks/useClassName';

import { StyledProps } from '../common';

export const BASE_TABLE_EVENTS = ['page-change', 'cell-click', 'scroll', 'scrollX', 'scrollY'];
export const BASE_TABLE_ALL_EVENTS = ROW_LISTENERS.map((t) => `row-${t}`).concat(BASE_TABLE_EVENTS);

export interface TableListeners {
  [key: string]: Function;
}

export interface TBaseTableProps extends BaseTableProps, StyledProps {}

const BaseTable = forwardRef((props: TBaseTableProps, ref) => {
  const { tableLayout, height, data, columns, style } = props;
  const tableRef = useRef<HTMLDivElement>();
  const tableElmRef = useRef<HTMLTableElement>();
  const { tableLayoutClasses, tableBaseClass, tableColFixedClasses } = useClassName();
  // 表格基础样式类
  const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
  // const [global] = useLocaleReceiver('table');
  // 固定表头和固定列逻辑
  const {
    affixHeaderRef,
    scrollbarWidth,
    // virtualScrollHeaderPos,
    tableWidth,
    tableContentRef,
    isFixedHeader,
    isWidthOverflow,
    isFixedColumn,
    thWidthList,
    showColumnShadow,
    showAffixHeader,
    rowAndColFixedPosition,
    // refreshTable,
    onTableContentScroll,
    updateHeaderScroll,
  } = useFixed(props);
  const { isMultipleHeader, spansAndLeafNodes, thList } = useTableHeader({ columns: props.columns });
  const { dataSource, isPaginateData, renderPagination } = usePagination(props);

  const dynamicBaseTableClasses = classNames(
    tableClasses.concat({
      [tableBaseClass.headerFixed]: isFixedHeader,
      [tableBaseClass.columnFixed]: isFixedColumn,
      [tableBaseClass.widthOverflow]: isWidthOverflow,
      [tableBaseClass.multipleHeader]: isMultipleHeader,
      [tableColFixedClasses.leftShadow]: showColumnShadow.left,
      [tableColFixedClasses.rightShadow]: showColumnShadow.right,
    }),
  );

  const tableElmClasses = classNames([
    [tableLayoutClasses[tableLayout || 'fixed']],
    { [tableBaseClass.fullHeight]: height },
  ]);

  // const isVirtual = computed(() => type === 'virtual' && props.data?.length > (props.scroll?.threshold || 100));

  const showRightDivider = useMemo(
    () => props.bordered && isFixedHeader && ((isMultipleHeader && isWidthOverflow) || !isMultipleHeader),
    [isFixedHeader, isMultipleHeader, isWidthOverflow, props.bordered],
  );

  useImperativeHandle(ref, () => ({
    tableElement: tableRef.current,
    tableHtmlElement: tableElmRef.current,
    tableContentElement: tableContentRef.current,
  }));

  const onFixedChange = () => {
    const timer = setTimeout(() => {
      updateHeaderScroll();
      clearTimeout(timer);
    }, 0);
  };

  // const { type, rowHeight, bufferSize = 20, isFixedRowHeight = false } = props.scroll || {};
  // const { data } = toRefs<any>(props);

  // let lastScrollY = -1;
  const onInnerScroll = onTableContentScroll;

  const newData = isPaginateData ? dataSource : data;

  const defaultColWidth = props.tableLayout === 'fixed' && isWidthOverflow ? '100px' : undefined;
  const colgroup = (
    <colgroup>
      {(spansAndLeafNodes?.leafColumns || columns).map((col, index) => (
        <col key={col.colKey || index} style={{ width: formatCSSUnit(col.width) || defaultColWidth }}></col>
      ))}
    </colgroup>
  );

  const affixedHeader = Boolean(props.headerAffixedTop && tableWidth) && (
    <div
      ref={affixHeaderRef}
      style={{ width: `${tableWidth}px`, opacity: Number(showAffixHeader) }}
      className={classNames({ [tableBaseClass.affixedHeaderElm]: props.headerAffixedTop })}
    >
      <table className={classNames(tableElmClasses)} style={{ ...tableElementStyles, width: `${tableWidth}px` }}>
        {colgroup}
        <THead
          isFixedHeader={isFixedHeader}
          rowAndColFixedPosition={rowAndColFixedPosition}
          isMultipleHeader={isMultipleHeader}
          bordered={props.bordered}
          spansAndLeafNodes={spansAndLeafNodes}
          thList={thList}
          thWidthList={thWidthList}
        />
      </table>
    </div>
  );

  // const translate = `translate(0, ${this.scrollHeight}px)`;
  // const virtualStyle = {
  //   transform: translate,
  //   '-ms-transform': translate,
  //   '-moz-transform': translate,
  //   '-webkit-transform': translate,
  // };
  const tableBodyProps = {
    rowAndColFixedPosition,
    showColumnShadow,
    // data: isVirtual ? visibleData : data,
    data: newData,
    columns: spansAndLeafNodes.leafColumns,
    scroll: props.scroll,
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
    // handleRowMounted: handleRowMounted,
    renderExpandedRow: props.renderExpandedRow,
    ...pick(props, extendTableProps),
  };
  const tableContent = (
    <div ref={tableContentRef} className={tableBaseClass.content} style={tableContentStyles} onScroll={onInnerScroll}>
      {/* {this.isVirtual && <div className={this.virtualScrollClasses.cursor} style={virtualStyle} />} */}
      <table ref={tableElmRef} className={classNames(tableElmClasses)} style={tableElementStyles}>
        {colgroup}
        <THead
          isFixedHeader={isFixedHeader}
          rowAndColFixedPosition={rowAndColFixedPosition}
          isMultipleHeader={isMultipleHeader}
          bordered={props.bordered}
          spansAndLeafNodes={spansAndLeafNodes}
          thList={thList}
        />
        <TBody {...tableBodyProps} />
        <TFoot
          rowKey={props.rowKey}
          isFixedHeader={isFixedHeader}
          rowAndColFixedPosition={rowAndColFixedPosition}
          footData={props.footData}
          columns={columns}
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
      {...loadingProps}
    ></Loading>
  );

  const { topContent, bottomContent } = props;
  return (
    <div ref={tableRef} className={classNames(dynamicBaseTableClasses)} style={{ position: 'relative', ...style }}>
      {!!topContent && <div className={tableBaseClass.topContent}>{topContent}</div>}
      {!!props.headerAffixedTop &&
        (props.headerAffixedTop ? (
          <Affix offsetTop={0} {...props.headerAffixProps} onFixedChange={onFixedChange}>
            {affixedHeader}
          </Affix>
        ) : (
          isFixedHeader && affixedHeader
        ))}
      {tableContent}
      {loadingContent}
      {showRightDivider && (
        <div
          className={tableBaseClass.scrollbarDivider}
          style={{ right: `${scrollbarWidth}px`, height: `${tableContentRef.current?.offsetHeight}px` }}
        ></div>
      )}
      {!!bottomContent && <div className={tableBaseClass.bottomContent}>{bottomContent}</div>}
      {renderPagination()}
    </div>
  );
});

BaseTable.displayName = 'BaseTable';

export default BaseTable;
