import _BaseTable from './BaseTable';
import _PrimaryTable from './PrimaryTable';
import _EnhancedTable from './EnhancedTable';

import './style/index.js';

export * from './type';
export * from './interface';

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
