import { createContext, useContext } from 'react';
import { BaseTableCol } from '../../_type/components/table';

export interface TableContextValue {
  /**
   * 表头是否固定
   */
  stickyHeader: boolean;
  /**
   * 扁平后的Columns
   */
  flattenColumns: BaseTableCol[];
}

export const TableContext = createContext<TableContextValue>({
  stickyHeader: false,
  flattenColumns: [],
});

export const useTableContext = () => useContext(TableContext);
export const TableContextProvider = TableContext.Provider;
