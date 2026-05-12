import type { StyledProps } from '../common';
import type { TdBreadcrumbItemProps, TdBreadcrumbProps } from './type';
import type React from 'react';

export interface BreadcrumbProps extends StyledProps, React.PropsWithChildren<TdBreadcrumbProps> {}

export interface BreadcrumbItemProps extends StyledProps, React.PropsWithChildren<TdBreadcrumbItemProps> {
  separator?: TdBreadcrumbProps['separator'];
  maxItemWidth?: TdBreadcrumbProps['maxItemWidth'];
  readOnly?: boolean;
}
