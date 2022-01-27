import { createContext, useContext } from 'react';
import { BaseTableCol, TdBaseTableProps } from '../type';

type Data = TdBaseTableProps['data'];

export interface TableContextValue {
  /**
   * 表头是否固定
   */
  fixedHeader: boolean;
  /**
   * 扁平后的Columns
   */
  flattenColumns: BaseTableCol[];
  flattenData: Data;
  pageData: Data;
}

export const TableContext = createContext<TableContextValue>({
  fixedHeader: false,
  flattenColumns: [],
  flattenData: [],
  pageData: [],
});

export const useTableContext = () => useContext(TableContext);
export const TableContextProvider = TableContext.Provider;
