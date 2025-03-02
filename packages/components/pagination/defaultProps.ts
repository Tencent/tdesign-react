/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdPaginationProps, TdPaginationMiniProps } from './type';

export const paginationDefaultProps: TdPaginationProps = {
  defaultCurrent: 1,
  foldedMaxPageBtn: 5,
  maxPageBtn: 10,
  pageEllipsisMode: 'mid',
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  showFirstAndLastPageBtn: false,
  showJumper: false,
  showPageNumber: true,
  showPageSize: true,
  showPreviousAndNextBtn: true,
  size: 'medium',
  theme: 'default',
  total: 0,
  totalContent: true,
};

export const paginationMiniDefaultProps: TdPaginationMiniProps = {
  layout: 'horizontal',
  showCurrent: true,
  size: 'medium',
  variant: 'text',
};
