import { createContext, useContext } from 'react';

export interface EnhancedTableContextValue {
  useTreeData?: any;
  [k: string]: any;
}

export const EnhancedTableContext = createContext<EnhancedTableContextValue>({});

export const useEnhancedTableContext = () => useContext(EnhancedTableContext);
export const EnhancedTableContextProvider = EnhancedTableContext.Provider;
