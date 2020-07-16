import { createContext } from 'react';

export interface TableContextValue {
  /**
   * thead、tbody是否放入到不同的table当中
   */
  separate: boolean;
}

export const TableContext = createContext<TableContextValue>({
  separate: false,
});
