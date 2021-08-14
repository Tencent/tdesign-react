import React, { useMemo, useState, useCallback, ReactNode } from 'react';
import classNames from 'classnames';
import useUpdateEffect from '../../_util/useUpdateEffect';
import useConfig from '../../_util/useConfig';
import { TdBaseTableProps, DataType } from '../../_type/components/table';
import Pagination, { PageInfo } from '../../pagination';
import { useColumns } from '../hooks/useColumns';

import TableEmptyBody from './TableEmptyBody';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableLoadingBody from './TableLoadingBody';
import { TableContextProvider } from './TableContext';
import { TableColGroup } from './TableColGroup';
import TableFooter from './TableFooter';

export interface BaseTableProps<RowData extends DataType = DataType> extends TdBaseTableProps<RowData> {}

export default function BaseTable<D extends DataType = DataType>(props: BaseTableProps<D>) {
  const { classPrefix } = useConfig();

  const {
    bordered = false,
    stripe = false,
    hover = false,
    tableLayout = 'fixed',
    verticalAlign = 'center',
    size = 'medium',
    maxHeight,
    loading,
    empty,
    data = [],
    pagination,
    onPageChange,
  } = props;

  const [columns, flattenColumns] = useColumns(props);

  // ==================== 翻页 ====================
  let hasPagination = false;
  const [innerCurrent, setInnerCurrentPagination] = useState<number>(pagination?.current ?? 0);
  const [innerPageSize, setInnerPageSize] = useState(pagination?.pageSize ?? 10);

  useUpdateEffect(() => {
    setInnerPageSize(pagination?.current);
    setInnerPageSize(pagination?.pageSize);
  }, [pagination]);

  const onInnerPaginationChange = useCallback(
    (pageInfo: PageInfo) => {
      setInnerCurrentPagination(pageInfo.current);
      setInnerPageSize(pageInfo.pageSize);
      onPageChange?.(pageInfo);
    },
    [onPageChange],
  );

  const onPageSizeChange = (pageSize: number) => {
    setInnerPageSize(pageSize);
  };

  if (pagination) {
    const { total, showJumper } = pagination;
    hasPagination = total > innerPageSize || (showJumper && total <= innerPageSize);
  }
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
  const isEmpty = !data.length;

  // ==================== 固定头 ====================
  const stickyHeader = maxHeight && maxHeight !== 0;

  // ==================== render ====================
  let tableBodyContent: ReactNode;
  switch (true) {
    case loading: {
      tableBodyContent = (
        <TableFooter>
          <TableLoadingBody />
        </TableFooter>
      );
      break;
    }
    case isEmpty: {
      tableBodyContent = (
        <TableFooter>
          <TableEmptyBody empty={empty} />
        </TableFooter>
      );
      break;
    }
    default: {
      tableBodyContent = <TableBody {...props} data={pageData} />;
    }
  }

  let paginationNode: React.ReactNode;

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

  const table = useMemo(() => ({ stickyHeader, flattenColumns }), [stickyHeader, flattenColumns]);
  const hasFixedColumns = columns.some(({ fixed }) => ~['left', 'right'].indexOf(fixed));

  return (
    <div
      className={classNames(`${classPrefix}-table`, `${classPrefix}-table--layout-${tableLayout}`, {
        [`${classPrefix}-table__header--fixed`]: maxHeight,
        [`${classPrefix}-table--striped`]: stripe,
        [`${classPrefix}-table--bordered`]: bordered,
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-table--hoverable`]: hover,
        [`${classPrefix}-table-valign__${verticalAlign}`]: verticalAlign,
        [`${classPrefix}-table__cell--fixed ${classPrefix}-table--has-fixed}`]: hasFixedColumns,
      })}
    >
      <TableContextProvider value={table}>
        <div className={`${classPrefix}-table-content`} style={{ maxHeight: maxHeight ?? 'auto', overflow: 'auto' }}>
          <table>
            <TableColGroup columns={columns} />
            <TableHeader<D> columns={columns} />
            {tableBodyContent}
          </table>
        </div>
        {hasPagination && paginationNode}
      </TableContextProvider>
    </div>
  );
}
