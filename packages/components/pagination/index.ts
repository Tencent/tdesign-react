import _Pagination from './Pagination';
import _PaginationMini from './PaginationMini';

import './style/index.js';

export type { PaginationProps } from './Pagination';
export type { PaginationMiniProps } from './PaginationMini';
export * from './type';

export const Pagination = _Pagination;
export const PaginationMini = _PaginationMini;
export default Pagination;
