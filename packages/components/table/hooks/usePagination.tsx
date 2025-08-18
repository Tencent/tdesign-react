import React, { useState, useEffect, useCallback } from 'react';
import useConfig from '../../hooks/useConfig';
import Pagination, { PageInfo, PaginationProps } from '../../pagination';
import { TdBaseTableProps, TableRowData } from '../type';

// 分页功能包含：远程数据排序受控、远程数据排序非受控、本地数据排序受控、本地数据排序非受控 等 4 类功能
export default function usePagination(props: TdBaseTableProps, tableContentRef: React.RefObject<HTMLDivElement>) {
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

  useEffect(() => {
    if (!pagination) {
      setIsPaginateData(false);
    }
  }, [pagination]);

  // 受控情况，只有 pagination.current 或者 pagination.pageSize 变化，才对数据进行排序
  useEffect(() => {
    if (!pagination || !pagination.current) return;
    const [current, pageSize] = [pagination?.current, pagination?.pageSize ?? 10];
    updateDataSourceAndPaginate(current, pageSize);
    setInnerPagination({ current, pageSize });
  }, [pagination, updateDataSourceAndPaginate]);

  // 非受控情况
  useEffect(() => {
    if (!pagination || !pagination.defaultCurrent) return;
    // 存在受控属性时，立即返回不再执行后续内容
    const isControlled = Boolean(pagination.current);
    if (isControlled) return;
    updateDataSourceAndPaginate(
      innerPagination.current ?? pagination.defaultCurrent,
      innerPagination.pageSize ?? pagination.defaultPageSize,
    );
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

            // 当切换分页时，内容区域滚动到顶部
            const ref = tableContentRef.current;
            if (ref.scrollTo) {
              ref.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
