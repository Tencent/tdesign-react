import { ReactFragment } from 'react';
import { StyledProps } from '../common';
import {
  TdBaseTableProps,
  TableExpandedRowParams,
  TableRowData,
  TdPrimaryTableProps,
  TdEnhancedTableProps,
} from './type';

export interface BaseTableProps extends TdBaseTableProps, StyledProps {
  /**
   * 渲染展开行，非公开属性，请勿在业务中使用
   */
  renderExpandedRow?: (params: TableExpandedRowParams<TableRowData>) => ReactFragment;
}

/**
 * SimpleTable is going to be deprecated, use BaseTableProps instead.
 */
export type SimpleTableProps = BaseTableProps;

export interface PrimaryTableProps extends TdPrimaryTableProps, StyledProps {}
export interface EnhancedTableProps extends TdEnhancedTableProps, StyledProps {}
export type TableProps = PrimaryTableProps;
