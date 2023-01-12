import React, { useState, useEffect, useCallback } from 'react';
import useConfig from '../../hooks/useConfig';
import Pagination, { PageInfo, PaginationProps } from '../../pagination';
import { TdBaseTableProps, TableRowData } from '../type';

// 分页功能包含：远程数据排序受控、远程数据排序非受控、本地数据排序受控、本地数据排序非受控 等 4 类功能
export default function usePagination(props: TdBaseTableProps) {
  const { pagination, data, disableDataPage } = props;
  const { classPrefix } = useConfig();
  const [innerPagination, setInnerPagination] = useState<PaginationProps>(props.pagination);

  const [dataSource, setDataSource] = useState<TableRowData[]>([]);
  const [isPaginateData, setIsPaginateData] = useState(false);

  const updateDataSourceAndPaginate = useCallback(
    (current = 1, pageSize = 10) => {
      // data 数据数量超出分页大小时，则自动启动本地数据分页
      const isPaginateData = Boolean(!disableDataPage && data.length > pageSize);
      setIsPaginateData(isPaginateData);
      let newData: TableRowData[] = [];
      if (isPaginateData) {
        const start = (current - 1) * pageSize;
        const end = current * pageSize;
        newData = [...data.slice(start, end)];
      } else {
        newData = data;
      }
      setDataSource(newData);
      return newData;
    },
    [data, disableDataPage],
  );

  // 受控情况，只有 pagination.current 或者 pagination.pageSize 变化，才对数据进行排序
  useEffect(() => {
    if (!pagination || !pagination.current) return;
    updateDataSourceAndPaginate(pagination.current, pagination.pageSize);
  }, [pagination, updateDataSourceAndPaginate]);

  // 非受控情况
  useEffect(() => {
    if (!pagination || !pagination.defaultCurrent) return;
    updateDataSourceAndPaginate(pagination.defaultCurrent, pagination.defaultPageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDataSourceAndPaginate]);

  const renderPagination = () => {
    if (!pagination) return null;
    return (
      <div className={`${classPrefix}-table__pagination`}>
        <Pagination
          {...pagination}
          onChange={(pageInfo: PageInfo) => {
            props.pagination?.onChange?.(pageInfo);
            setInnerPagination(pageInfo);
            const newData = updateDataSourceAndPaginate(pageInfo.current, pageInfo.pageSize);
            props.onPageChange?.(pageInfo, newData);
          }}
        />
      </div>
    );
  };

  return {
    isPaginateData,
    dataSource,
    innerPagination,
    renderPagination,
  };
}
