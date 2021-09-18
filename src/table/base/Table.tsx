import React, { useMemo, useState, ReactNode } from 'react';
import classNames from 'classnames';
import useUpdateEffect from '../../_util/useUpdateEffect';
import useConfig from '../../_util/useConfig';
import { DataType, TdPrimaryTableProps } from '../../_type/components/table';
import Pagination, { PageInfo } from '../../pagination';
import { useColumns } from '../hooks/useColumns';

import TableEmptyBody from './TableEmptyBody';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableLoadingBody from './TableLoadingBody';
import { TableContextProvider } from './TableContext';
import { TableColGroup } from './TableColGroup';
import TableFooter from './TableFooter';

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
    loading,
    empty,
    data = [],
    pagination,
    onPageChange,
    onTrClick,
    renderExpandRow,
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

  const onPageSizeChange = (pageSize: number, pageInfo: PageInfo) => {
    setInnerPageSize(pageSize);
    // 处理pagination参数的事件回调
    pagination?.onChange?.(pageInfo);
    pagination?.onPageSizeChange?.(pageSize, pageInfo);
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

  const onInnerPaginationChange = (pageInfo: PageInfo) => {
    const { current, pageSize } = pageInfo;
    setInnerCurrentPagination(current);
    setInnerPageSize(pageSize);
    const newDataSource = data.slice((current - 1) * innerPageSize, current * innerPageSize);
    onPageChange?.(pageInfo, newDataSource);
    // 处理pagination参数的事件回调
    pagination?.onChange?.(pageInfo);
  };

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
      tableBodyContent = (
        <TableBody {...props} data={pageData} onTrClick={onTrClick} renderExpandRow={renderExpandRow} />
      );
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
