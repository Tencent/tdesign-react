import React, { useMemo, useState, ReactNode, useLayoutEffect, useRef } from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import useUpdateEffect from '../../_util/useUpdateEffect';
import useConfig from '../../_util/useConfig';
import { DataType, TdPrimaryTableProps } from '../../_type/components/table';
import Pagination, { PageInfo } from '../../pagination';
import { useColumns } from '../hooks/useColumns';
import { getScrollDirection, ScrollDirection } from '../util';
import TableEmptyBody from './TableEmptyBody';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableLoadingBody from './TableLoadingBody';
import TableAsyncLoadingBody from './TableAsyncLoadingBody';

import { TableContextProvider } from './TableContext';
import { TableColGroup } from './TableColGroup';
import TableFooter from './TableFooter';
import Loading from '../../loading';

export interface ExpandProps {
  onTrClick?: Function;
  renderExpandRow?: Function;
}

export type BaseTableProps<RowData extends DataType = DataType> = TdPrimaryTableProps<RowData>;

export default function BaseTable<D extends DataType = DataType>(props: BaseTableProps<D> & ExpandProps) {
  const { classPrefix } = useConfig();

  const {
    bordered = false,
    stripe = false,
    hover = false,
    tableLayout = 'fixed',
    verticalAlign = 'center',
    size = 'medium',
    maxHeight,
    height,
    loading,
    empty,
    data = [],
    pagination,
    onPageChange,
    onTrClick,
    renderExpandRow,
    onScrollX,
    onScrollY,
    asyncLoading,
  } = props;

  const [columns, flattenColumns] = useColumns(props);

  // ==================== 固定表头、固定列 ====================
  const [scrollBarWidth, setScrollBarWidth] = useState(0);
  const fixedHeader = height > 0 || maxHeight > 0;
  const table = useMemo(() => ({ fixedHeader, flattenColumns }), [fixedHeader, flattenColumns]);
  const hasFixedColumns = columns.some(({ fixed }) => ['left', 'right'].includes(fixed));
  const scrollHeaderRef = useRef<HTMLDivElement>();
  const scrollBodyRef = useRef<HTMLDivElement>();
  const tableContentRef = useRef<HTMLDivElement>();
  const [scrollableToLeft, setScrollableToLeft] = useState(false);
  const [scrollableToRight, setScrollableToRight] = useState(false);

  useLayoutEffect(() => {
    if (fixedHeader) {
      setStateScrollBarWidth();
    }

    let checkScrollableToLeftOrRightDebounce: EventListenerOrEventListenerObject | undefined;
    if (hasFixedColumns) {
      checkScrollableToLeftOrRight();
      checkScrollableToLeftOrRightDebounce = debounce(checkScrollableToLeftOrRight);
      window.addEventListener('resize', checkScrollableToLeftOrRightDebounce);
    }

    return () => {
      if (hasFixedColumns) {
        window.removeEventListener('resize', checkScrollableToLeftOrRightDebounce);
      }
    };
  }, [fixedHeader, hasFixedColumns]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==================== 翻页 ====================
  let hasPagination = false;
  const [innerCurrent, setInnerCurrentPagination] = useState<number>(pagination?.current ?? 0);
  const [innerPageSize, setInnerPageSize] = useState(pagination?.pageSize ?? 10);

  useUpdateEffect(() => {
    setInnerPageSize(pagination?.current);
    setInnerPageSize(pagination?.pageSize);
  }, [pagination]);

  const onPageSizeChange = (pageSize: number, pageInfo: PageInfo) => {
    setInnerPageSize(pageSize);
    const { current } = pageInfo;
    const newDataSource = data.slice((current - 1) * pageSize, current * pageSize);
    onPageChange?.(pageInfo, newDataSource);
    // 处理pagination参数的事件回调

    pagination?.onPageSizeChange?.(pageSize, pageInfo);
  };

  if (pagination) {
    const { total, showJumper } = pagination;
    hasPagination = total > innerPageSize || (showJumper && total <= innerPageSize);
  }

  const onInnerPaginationChange = (pageInfo: PageInfo) => {
    const { current, pageSize } = pageInfo;
    setInnerCurrentPagination(current);
    setInnerPageSize(pageSize);
    const newDataSource = data.slice((current - 1) * innerPageSize, current * innerPageSize);
    onPageChange?.(pageInfo, newDataSource);
    // 处理pagination参数的事件回调
    pagination?.onChange?.(pageInfo);
  };

  // ==================== 数据 ====================
  const pageData = useMemo(() => {
    if (!hasPagination) return data;
    if (data.length > innerPageSize) {
      const pageStart = (innerCurrent - 1) * innerPageSize;
      const pageEnd = innerCurrent * innerPageSize;
      return data.slice(pageStart, pageEnd);
    }
    return data;
  }, [data, innerPageSize, hasPagination, innerCurrent]);

  // ==================== render ====================
  const isEmpty = !data.length;
  function renderTableBodyAndTableFooter() {
    // eslint-disable-next-line
    if (!!loading) {
      return isEmpty ? (
        <TableFooter>
          <TableEmptyBody empty={null} />
        </TableFooter>
      ) : (
        <TableBody {...props} data={pageData} onTrClick={onTrClick} renderExpandRow={renderExpandRow} />
      );
    }
    // eslint-disable-next-line
    if (!!asyncLoading) {
      return (
        <>
          <TableBody {...props} data={pageData} onTrClick={onTrClick} renderExpandRow={renderExpandRow} />
          <TableFooter colspan={columns.length}>
            <TableAsyncLoadingBody {...props} />
          </TableFooter>
        </>
      );
    }
    if (isEmpty) {
      return (
        <TableFooter>
          <TableEmptyBody empty={empty} />
        </TableFooter>
      );
    }

    return <TableBody {...props} data={pageData} onTrClick={onTrClick} renderExpandRow={renderExpandRow} />;
  }

  let paginationNode: ReactNode;

  if (hasPagination) {
    paginationNode = (
      <div className={`${classPrefix}-table-pagination`}>
        <Pagination
          {...pagination}
          current={innerCurrent}
          pageSize={innerPageSize}
          onChange={onInnerPaginationChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    );
  }

  function setStateScrollBarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = `
      width: 99px;
      height: 99px;
      overflow: scroll;
      position: absolute;
      top: -9999px;`;
    scrollDiv.classList.add('scrollbar');
    document.body.appendChild(scrollDiv);
    const scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    setScrollBarWidth(scrollBarWidth);
    document.body.removeChild(scrollDiv);
  }

  function getTable(params?: { enableHeader?: boolean; enableBody?: boolean }): ReactNode {
    const { enableHeader = true, enableBody = true } = params || {};
    return (
      <table style={{ tableLayout, height: '100%' }}>
        <TableColGroup columns={columns} />
        {enableHeader ? <TableHeader<D> columns={columns} /> : null}
        {enableBody ? renderTableBodyAndTableFooter() : null}
      </table>
    );
  }

  function getTableWithFixedHeader(): ReactNode {
    const fixedHeaderRN = (
      <div ref={scrollHeaderRef} className={`${classPrefix}-table__header`} style={{ paddingRight: scrollBarWidth }}>
        {getTable({ enableBody: false })}
      </div>
    );

    const onScroll = throttle((e) => {
      const { scrollLeft } = e.target;
      scrollHeaderRef.current.scrollLeft = scrollLeft;
      handleScroll(e);
    }, 10);

    const fixedBodyRN = (
      <div
        ref={scrollBodyRef}
        className={`${classPrefix}-table__body`}
        style={{
          height: isNaN(Number(height)) ? height : `${Number(height)}px`,
          maxHeight: isNaN(Number(maxHeight)) ? maxHeight : `${Number(maxHeight)}px`,
          width: hasFixedColumns ? '100%' : undefined,
        }}
        {...(hasFixedColumns ? { onScroll } : {})}
      >
        {getTable({ enableHeader: false })}
      </div>
    );

    return (
      <>
        {fixedHeaderRN}
        {fixedBodyRN}
      </>
    );
  }

  function checkScrollableToLeftOrRight() {
    const scrollContainer = fixedHeader ? scrollBodyRef.current : tableContentRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const scrollableToLeft = scrollLeft > 0;
    setScrollableToLeft(scrollableToLeft);
    const scrollableToRight = scrollLeft + clientWidth < scrollWidth;
    setScrollableToRight(scrollableToRight);
  }
  function handleScroll(e) {
    checkScrollableToLeftOrRight();

    const { scrollLeft, scrollTop } = e.target;
    const direction = getScrollDirection(scrollLeft, scrollTop);
    if (direction !== ScrollDirection.UNKNOWN) {
      const scrollListenerFn = direction === ScrollDirection.X ? onScrollX : onScrollY;
      const scrollParams = { e };
      scrollListenerFn?.(scrollParams);
    }
  }

  return (
    <div
      className={classNames(`${classPrefix}-table`, {
        [`${classPrefix}-table--striped`]: stripe,
        [`${classPrefix}-table--bordered`]: bordered,
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-table--hoverable`]: hover,
        [`${classPrefix}-table-valign__${verticalAlign}`]: verticalAlign,
        [`${classPrefix}-table__header--fixed`]: fixedHeader,
        [`${classPrefix}-table__cell--fixed ${classPrefix}-table--has-fixed`]: hasFixedColumns,
      })}
    >
      <TableContextProvider value={table}>
        <Loading
          loading={!!loading}
          showOverlay
          indicator={loading === true}
          text={typeof loading !== 'boolean' ? <TableLoadingBody {...props} /> : null}
        >
          <div
            ref={tableContentRef}
            className={classNames(`${classPrefix}-table-content`, {
              [`${classPrefix}-table-content--scrollable-to-right`]: scrollableToRight,
              [`${classPrefix}-table-content--scrollable-to-left`]: scrollableToLeft,
            })}
            style={{ overflow: 'auto' }}
            {...(hasFixedColumns ? { onScroll: throttle(handleScroll, 100) } : {})}
          >
            {!fixedHeader ? getTable() : getTableWithFixedHeader()}
          </div>
        </Loading>
        {hasPagination && paginationNode}
      </TableContextProvider>
    </div>
  );
}
