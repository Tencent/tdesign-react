import { useState } from 'react';
import { PageInfo, PaginationProps } from '../../pagination';

type InnerPagination = {
  current?: number;
  pageSize?: number;
};

function usePagination(
  pagination: PaginationProps,
  onChange?: (pagination: InnerPagination) => void,
): [PaginationProps, (current?: number, pageSize?: number) => void] {
  const [innerPagination, setInnerPagination] = useState<InnerPagination>({
    current: pagination?.current || pagination?.defaultCurrent || 1,
    pageSize: pagination?.pageSize || pagination?.defaultPageSize || 10,
  });

  const refreshPagination = (current?: number, pageSize?: number) => {
    setInnerPagination({
      current: current ?? 1,
      pageSize: pageSize || innerPagination.pageSize,
    });
  };

  const onPagintionChange = (pageInfo: PageInfo) => {
    if (pagination) {
      pagination?.onChange?.(pageInfo);
    }
    refreshPagination(pageInfo.current, pageInfo.pageSize);
    onChange?.({
      current: pageInfo.current,
      pageSize: pageInfo.pageSize || innerPagination.pageSize,
    });
  };

  if (!pagination) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return [{}, () => {}];
  }

  return [{ ...innerPagination, onChange: onPagintionChange }, refreshPagination];
}

export default usePagination;
