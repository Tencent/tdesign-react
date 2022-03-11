import { createContext } from 'react';

export interface BreadcrumbContextType {
  maxItemWidthInContext;
  theme: string;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  maxItemWidthInContext: '',
  theme: 'light',
});
