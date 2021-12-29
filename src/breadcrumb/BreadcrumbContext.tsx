import { createContext } from 'react';

export interface BreadcrumbContextType {
  maxItemWidthInContext;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  maxItemWidthInContext: '',
});
