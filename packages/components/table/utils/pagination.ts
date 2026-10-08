import type { PaginationProps } from '../../pagination';
import type { TableRowData } from '../type';

/** 本地分页默认页码 */
export const TABLE_DEFAULT_PAGE_CURRENT = 1;

/** 本地分页默认每页条数 */
export const TABLE_DEFAULT_PAGE_SIZE = 10;

export function isControlledPagination(pagination?: PaginationProps) {
  return pagination?.current !== undefined;
}

export function getPaginationCurrent(pagination?: PaginationProps, isControlled?: boolean) {
  if (!pagination) return TABLE_DEFAULT_PAGE_CURRENT;
  const controlled = isControlled ?? isControlledPagination(pagination);
  if (controlled) {
    return pagination.current || TABLE_DEFAULT_PAGE_CURRENT;
  }
  return pagination.defaultCurrent || TABLE_DEFAULT_PAGE_CURRENT;
}

export function getPaginationPageSize(pagination?: PaginationProps, isControlled?: boolean) {
  if (!pagination) return TABLE_DEFAULT_PAGE_SIZE;
  const controlled = isControlled ?? isControlledPagination(pagination);
  if (controlled) {
    return pagination.pageSize ?? TABLE_DEFAULT_PAGE_SIZE;
  }
  return pagination.defaultPageSize ?? TABLE_DEFAULT_PAGE_SIZE;
}

/**
 * 按受控和非受控模式解析页码
 */
export function resolvePaginationPageInfo(pagination?: PaginationProps) {
  const isControlled = isControlledPagination(pagination);
  return {
    isControlled,
    current: getPaginationCurrent(pagination, isControlled),
    pageSize: getPaginationPageSize(pagination, isControlled),
  };
}

/**
 * 获取当前实际生效的页码信息，不区分受控和非受控模式
 *
 * 优先级：`current` > `defaultCurrent` > 内置默认值
 */
export function getEffectivePaginationPageInfo(pagination?: PaginationProps) {
  if (!pagination) {
    return {
      current: TABLE_DEFAULT_PAGE_CURRENT,
      pageSize: TABLE_DEFAULT_PAGE_SIZE,
    };
  }
  return {
    current: pagination.current ?? pagination.defaultCurrent ?? TABLE_DEFAULT_PAGE_CURRENT,
    pageSize: pagination.pageSize ?? pagination.defaultPageSize ?? TABLE_DEFAULT_PAGE_SIZE,
  };
}

export function shouldEnableLocalDataPagination(params: {
  data: TableRowData[];
  pageSize: number;
  disableDataPage?: boolean;
  pagination?: PaginationProps | null;
}): boolean {
  const { data, pageSize, disableDataPage, pagination } = params;
  return Boolean(pagination && !disableDataPage && data.length > pageSize);
}

export function shouldSliceLocalData(params: {
  data: TableRowData[];
  pageSize: number;
  disableDataPage?: boolean;
}): boolean {
  const { data, pageSize, disableDataPage } = params;
  return Boolean(!disableDataPage && data.length > pageSize);
}

export function getLocalPaginatedData(
  data: TableRowData[],
  current: number,
  pageSize: number,
  options: {
    disableDataPage?: boolean;
    requirePagination?: boolean;
    pagination?: PaginationProps | null;
  } = {},
) {
  const { disableDataPage, requirePagination = false, pagination } = options;
  const shouldPaginate = requirePagination
    ? shouldEnableLocalDataPagination({
        data,
        pageSize,
        disableDataPage,
        pagination,
      })
    : shouldSliceLocalData({ data, pageSize, disableDataPage });

  if (shouldPaginate) {
    const start = (current - 1) * pageSize;
    const end = current * pageSize;
    return { newData: [...data.slice(start, end)], shouldPaginate: true };
  }
  return { newData: data, shouldPaginate: false };
}

/**
 * 本地分页表格中，将当前页 rowIndex 转为 data 全量下标
 */
export function getLocalPaginationRowIndex(
  index: number,
  data: TableRowData[],
  pagination: PaginationProps,
  disableDataPage?: boolean,
) {
  const { current, pageSize } = getEffectivePaginationPageInfo(pagination);
  if (
    shouldEnableLocalDataPagination({
      data,
      pageSize,
      disableDataPage,
      pagination,
    })
  ) {
    return pageSize * (current - 1) + index;
  }
  return index;
}
