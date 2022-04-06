import { createContext } from 'react';
import { TdBreadcrumbProps } from './type';

export interface BreadcrumbContextType {
  maxItemWidthInContext;
  theme: string;
  separator: TdBreadcrumbProps['separator'];
}

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  maxItemWidthInContext: '',
  theme: 'light',
  separator: null,
});
