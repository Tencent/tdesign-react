import React from 'react';
import { TdBreadcrumbItemProps, TdBreadcrumbProps } from '../_type/components/breadcrumb';

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.PropsWithChildren<TdBreadcrumbProps> {}

export interface BreadcrumbItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.PropsWithChildren<TdBreadcrumbItemProps> {
  theme?: TdBreadcrumbProps['theme'];
  separator?: TdBreadcrumbProps['separator'];
  maxItemWidth?: TdBreadcrumbProps['maxItemWidth'];
}
