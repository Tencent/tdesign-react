import React, { useMemo, useState, ReactNode, useRef } from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import useUpdateEffect from '../../_util/useUpdateEffect';
import useConfig from '../../_util/useConfig';
import useLayoutEffect from '../../_util/useLayoutEffect';
import { DragSortInnerProps } from '../../_util/useDragSorter';
import { DataType, TdPrimaryTableProps } from '../type';
import { StyledProps } from '../../common';
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
import { useEnhancedTableContext } from '../enhanced/TableContext';

export interface ExpandInnerProps {
  handleExpandChange?: Function;
  renderExpandRow?: Function;
}
export interface BaseTableProps<RowData extends DataType = DataType>
  extends TdPrimaryTableProps<RowData>,
    StyledProps,
    ExpandInnerProps,
    DragSortInnerProps {}

export default function BaseTable<D extends DataType = DataType>(props: BaseTableProps<D> & ExpandInnerProps) {
  const { classPrefix } = useConfig();

  const {
    className,
    style,
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
    onScrollX,
    onScrollY,
    asyncLoading,
  } = props;

  const [columns, flattenColumns] = useColumns(props);

  // ==================== 翻页 ====================
  const hasPagination = pagination ? (pagination.total || data.length) > 0 : false;
  const [innerCurrent, setInnerCurrentPagination] = useState<number>(
    pagination?.current || pagination?.defaultCurrent || 1,
  );
  const [innerPageSize, setInnerPageSize] = useState<number>(pagination?.pageSize || pagination?.defaultPageSize || 10);
  const isControlledPagination =
    typeof pagination?.current !== 'undefined' && typeof pagination?.pageSize !== 'undefined';

  useUpdateEffect(() => {
    if (isControlledPagination) {
      setInnerCurrentPagination(pagination?.current);
      setInnerPageSize(pagination?.pageSize);
    }
  }, [pagination]);

  const onPageSizeChange = (pageSize: number, pageInfo: PageInfo) => {
    pagination?.onPageSizeChange?.(pageSize, pageInfo);
  };

  const onInnerPaginationChange = (pageInfo: PageInfo) => {
    const { current, pageSize } = pageInfo;

    const newDataSource = data.slice((current - 1) * pageSize, current * pageSize);
    onPageChange?.(pageInfo, newDataSource);
    // 处理pagination参数的事件回调
    pagination?.onChange?.(pageInfo);

    if (!isControlledPagination) {
      setInnerCurrentPagination(current);
      setInnerPageSize(pageSize);
    }
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

  // ==================== 固定表头、固定列 ====================
  const [scrollBarWidth, setScrollBarWidth] = useState(0);
  const fixedHeader = height > 0 || maxHeight > 0;
  const hasFixedColumns = columns.some(({ fixed }) => ['left', 'right'].includes(fixed));
  const scrollHeaderRef = useRef<HTMLDivElement>();
  const scrollBodyRef = useRef<HTMLDivElement>();
  const tableRef = useRef<HTMLTableElement>();
  const tableContentRef = useRef<HTMLDivElement>();
  const [scrollableToLeft, setScrollableToLeft] = useState(false);
  const [scrollableToRight, setScrollableToRight] = useState(false);
  const [isHasScrollbar, setIsHasScrollbar] = useState(false);

  // ==================== Context ====================
  const { useFlattenData } = useEnhancedTableContext();
  const flattenData = useFlattenData?.(pageData);
  const tableContextValue = useMemo(
    () => ({ fixedHeader, flattenColumns, flattenData, pageData }),
    [fixedHeader, flattenColumns, flattenData, pageData],
  );

  useLayoutEffect(() => {
    if (fixedHeader) {
      setStateScrollBarWidth();
    }
  }, [fixedHeader]);
  useLayoutEffect(() => {
    if (fixedHeader) {
      const limitHeight = height || maxHeight;
      const tableNode = tableRef.current;
      const isHasScrollbarNew = tableNode.offsetHeight > limitHeight;
      setIsHasScrollbar(isHasScrollbarNew);
    }
  }, [pageData]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
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
  }, [hasFixedColumns]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <TableBody {...props} data={pageData} />
      );
    }
    // eslint-disable-next-line
    if (!!asyncLoading) {
      return (
        <>
          <TableBody {...props} data={pageData} />
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

    return <TableBody {...props} data={pageData} />;
  }

  let paginationNode: ReactNode;
  if (hasPagination) {
    paginationNode = (
      <div className={`${classPrefix}-table__pagination`}>
        <Pagination
          total={data?.length}
          {...pagination}
          current={innerCurrent}
          pageSize={innerPageSize}
          onChange={onInnerPaginationChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    );
  }

  function getTable(params?: { enableHeader?: boolean; enableBody?: boolean }): ReactNode {
    const { enableHeader = true, enableBody = true } = params || {};
    return (
      <table ref={tableRef} style={{ tableLayout, height: '100%' }}>
        <TableColGroup columns={columns} />
        {enableHeader ? <TableHeader<D> columns={columns} /> : null}
        {enableBody ? renderTableBodyAndTableFooter() : null}
      </table>
    );
  }

  function getTableWithFixedHeader(): ReactNode {
    let style = {};
    if (isHasScrollbar) {
      style = { ...style, paddingRight: scrollBarWidth };
    }
    const fixedHeaderRN = (
      <div ref={scrollHeaderRef} className={`${classPrefix}-table__header`} style={style}>
        {getTable({ enableBody: false })}
      </div>
    );

    const throttleScroll = throttle((e) => {
      checkScrollableToLeftOrRight();
      onScrollXOrY(e);
      headerScroll(e);
    }, 10);

    function headerScroll(e) {
      const { scrollLeft } = e.target;
      scrollHeaderRef.current.scrollLeft = scrollLeft;
    }

    function onScroll(e) {
      e.persist();
      throttleScroll(e);
    }

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

  // ==================== functions ====================
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

  function checkScrollableToLeftOrRight() {
    if (!hasFixedColumns) return;
    const scrollContainer = fixedHeader ? scrollBodyRef.current : tableContentRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const scrollableToLeft = scrollLeft > 0;
    setScrollableToLeft(scrollableToLeft);
    const scrollableToRight = scrollLeft + clientWidth < scrollWidth;
    setScrollableToRight(scrollableToRight);
  }

  function onScrollXOrY(e) {
    const { scrollLeft, scrollTop } = e.target;
    const direction = getScrollDirection(scrollLeft, scrollTop);
    if (direction !== ScrollDirection.UNKNOWN) {
      const scrollListenerFn = direction === ScrollDirection.X ? onScrollX : onScrollY;
      const scrollParams = { e };
      scrollListenerFn?.(scrollParams);
    }
  }

  const throttleScroll = throttle((e) => {
    checkScrollableToLeftOrRight();
    onScrollXOrY(e);
  }, 100);

  function onScroll(e) {
    e.persist(); // 处理：react 16及以下，event pooling导致异步获取event.target时为null. ref: https://reactjs.org/docs/legacy-event-pooling.html
    throttleScroll(e);
  }

  return (
    <div
      className={classNames(
        `${classPrefix}-table`,
        {
          [`${classPrefix}-table--striped`]: stripe,
          [`${classPrefix}-table--bordered`]: bordered,
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-table--hoverable`]: hover,
          [`${classPrefix}-table--align-${verticalAlign}`]: verticalAlign,
          [`${classPrefix}-table__header--fixed`]: fixedHeader,
          [`${classPrefix}-table__cell--fixed ${classPrefix}-table--has-fixed`]: hasFixedColumns,
        },
        className,
      )}
      style={style}
    >
      <TableContextProvider value={tableContextValue}>
        <Loading
          loading={!!loading}
          showOverlay
          indicator={loading === true}
          text={typeof loading !== 'boolean' ? <TableLoadingBody {...props} /> : null}
        >
          <div
            ref={tableContentRef}
            className={classNames(`${classPrefix}-table__content`, {
              [`${classPrefix}-table__content--scrollable-to-right`]: scrollableToRight,
              [`${classPrefix}-table__content--scrollable-to-left`]: scrollableToLeft,
            })}
            style={{ overflow: 'auto' }}
            {...(hasFixedColumns ? { onScroll } : {})}
          >
            {!fixedHeader ? getTable() : getTableWithFixedHeader()}
          </div>
        </Loading>
        {hasPagination && paginationNode}
      </TableContextProvider>
    </div>
  );
}
