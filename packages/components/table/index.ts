import './style/index.js';

import _BaseTable from './BaseTable';
import _EnhancedTable from './EnhancedTable';
import _PrimaryTable from './PrimaryTable';

export * from './interface';
export * from './type';

/**
 * @deprecated
 * @description SimpleTable is going to be deprecated, use BaseTable instead.
 */
export const SimpleTable = _BaseTable;

export const BaseTable = _BaseTable;
export const PrimaryTable = _PrimaryTable;
export const Table = PrimaryTable;
export const EnhancedTable = _EnhancedTable;

export default Table;
