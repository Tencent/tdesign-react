import React, { useCallback, useEffect, useState } from 'react';
import useConfig from '../../hooks/useConfig';
import Pagination, { PageInfo, PaginationProps } from '../../pagination';
import type { TableRowData, TdBaseTableProps } from '../type';

// 分页功能包含：远程数据排序受控、远程数据排序非受控、本地数据排序受控、本地数据排序非受控 等 4 类功能
export default function usePagination(props: TdBaseTableProps, tableContentRef: React.RefObject<HTMLDivElement>) {
  const { pagination, data, disableDataPage } = props;
  const { classPrefix } = useConfig();
  const [innerPagination, setInnerPagination] = useState<PaginationProps>(props.pagination);

  const [dataSource, setDataSource] = useState<TableRowData[]>([]);
  const [isPaginateData, setIsPaginateData] = useState(false);

  const isControlled = pagination?.current !== undefined;

  const calculatePaginatedData = useCallback(
    (current = 1, pageSize = 10) => {
      // data 数据数量超出分页大小时，则自动启动本地数据分页
      const shouldPaginate = Boolean(!disableDataPage && data.length > pageSize);
      let newData: TableRowData[] = [];
      if (shouldPaginate) {
        const start = (current - 1) * pageSize;
        const end = current * pageSize;
        newData = [...data.slice(start, end)];
      } else {
        newData = data;
      }
      return { newData, shouldPaginate };
    },
    [data, disableDataPage],
  );

  const updateDataSourceAndPaginate = useCallback(
    (current = 1, pageSize = 10) => {
      const { newData, shouldPaginate } = calculatePaginatedData(current, pageSize);
      setIsPaginateData(shouldPaginate);
      setDataSource(newData);
      return newData;
    },
    [calculatePaginatedData],
  );

  useEffect(() => {
    if (!pagination) {
      setIsPaginateData(false);
    }
  }, [pagination]);

  // 受控情况
  useEffect(() => {
    if (!pagination || !isControlled) return;
    const [current, pageSize] = [pagination?.current || 1, pagination?.pageSize ?? 10];
    updateDataSourceAndPaginate(current, pageSize);
    setInnerPagination({ current, pageSize });
  }, [pagination, isControlled, updateDataSourceAndPaginate]);

  // 非受控情况
  useEffect(() => {
    if (!pagination || isControlled) return;
    const [current, pageSize] = [pagination?.defaultCurrent || 1, pagination?.defaultPageSize ?? 10];
    updateDataSourceAndPaginate(current, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled, updateDataSourceAndPaginate]);

  const renderPagination = () => {
    if (!pagination) return null;
    return (
      <div className={`${classPrefix}-table__pagination`}>
        <Pagination
          {...pagination}
          onChange={(pageInfo: PageInfo) => {
            props.pagination?.onChange?.(pageInfo);
            if (isControlled) {
              const { newData } = calculatePaginatedData(pageInfo.current, pageInfo.pageSize);
              props.onPageChange?.(pageInfo, newData);
            } else {
              setInnerPagination(pageInfo);
              const newData = updateDataSourceAndPaginate(pageInfo.current, pageInfo.pageSize);
              props.onPageChange?.(pageInfo, newData);
            }

            // 当切换分页时，内容区域滚动到顶部
            const ref = tableContentRef.current;
            if (ref.scrollTo) {
              ref.scrollTo({ top: 0, left: 0 });
            } else {
              // 兼容测试环境或旧浏览器
              ref.scrollTop = 0;
              ref.scrollLeft = 0;
            }
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
