import _SimpleTable, { BaseTableProps } from './base/Table';
import _PrimaryTable, { PrimaryTableProps } from './primary/Table';
// import _EnhancedTable from './enhanced/Table';

import './style/index.js';

export type { BaseTableProps, PrimaryTableProps };
export * from '../_type/components/table';

export const SimpleTable = _SimpleTable;
export const Table = _PrimaryTable;
// export const EnhancedTable = _EnhancedTable;

export default Table;
// export default EnhancedTabled;
