import { createContext, useContext } from 'react';

export interface EnhancedTableContextValue {
  getFlattenData?: Function;
  getFlattenRowData?: Function;
  getFlattenPageData?: Function;
  checkStrictly?: undefined | boolean;
  childrenKey?: string;
  [k: string]: any;
}

export const EnhancedTableContext = createContext<EnhancedTableContextValue>({
  checkStrictly: true,
  childrenKey: 'children',
});

export const useEnhancedTableContext = () => useContext(EnhancedTableContext);
export const EnhancedTableContextProvider = EnhancedTableContext.Provider;
