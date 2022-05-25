import { createContext } from 'react';
import { TdBreadcrumbProps } from './type';

export interface BreadcrumbContextType {
  maxItemWidthInContext;
  separator: TdBreadcrumbProps['separator'];
}

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  maxItemWidthInContext: '',
  separator: null,
});
