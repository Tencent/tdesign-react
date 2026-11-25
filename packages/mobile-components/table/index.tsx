import './style';

import _BaseTable from './BaseTable';
import _PrimaryTable from './PrimaryTable';

export * from './interface';
export * from './type';

export const BaseTable = _BaseTable;
export const PrimaryTable = _PrimaryTable;
export const Table = PrimaryTable;

export default Table;
