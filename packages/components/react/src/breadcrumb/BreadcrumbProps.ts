import React from 'react';
import { StyledProps } from '../common';
import { TdBreadcrumbItemProps, TdBreadcrumbProps } from './type';

export interface BreadcrumbProps extends StyledProps, React.PropsWithChildren<TdBreadcrumbProps> {}

export interface BreadcrumbItemProps extends StyledProps, React.PropsWithChildren<TdBreadcrumbItemProps> {
  separator?: TdBreadcrumbProps['separator'];
  maxItemWidth?: TdBreadcrumbProps['maxItemWidth'];
}
