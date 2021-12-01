import { createContext, useContext } from 'react';
import { BaseTableCol } from '../type';

export interface TableContextValue {
  /**
   * 表头是否固定
   */
  fixedHeader: boolean;
  /**
   * 扁平后的Columns
   */
  flattenColumns: BaseTableCol[];
}

export const TableContext = createContext<TableContextValue>({
  fixedHeader: false,
  flattenColumns: [],
});

export const useTableContext = () => useContext(TableContext);
export const TableContextProvider = TableContext.Provider;
