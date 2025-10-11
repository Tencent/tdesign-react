import { ReactNode } from 'react';
import { TableTreeDataMap } from '@tdesign/common-js/table/tree-store';
import { ScrollToElementParams, StyledProps } from '../common';
import { UseTreeDataReturnType } from './hooks/useTreeData';
import {
  BaseTableCol,
  PrimaryTableRowValidateContext,
  PrimaryTableValidateContext,
  RowspanColspan,
  TableExpandedRowParams,
  TableRowData,
  TdBaseTableProps,
  TdEnhancedTableProps,
  TdPrimaryTableProps,
} from './type';

export interface BaseTableProps<T extends TableRowData = TableRowData> extends TdBaseTableProps<T>, StyledProps {
  /**
   * 渲染展开行。非公开属性，请勿在业务中使用
   */
  renderExpandedRow?: (params: TableExpandedRowParams<TableRowData>) => ReactNode;
  /**
   * 多级表头场景，叶子结点变化时执行。非公开属性，请勿在业务中使用
   */
  onLeafColumnsChange?: (columns: BaseTableColumns) => void;
  /**
   * 表头是否可拖拽。非公开属性，请勿在业务中使用
   */
  thDraggable?: boolean;
}

/**
 * SimpleTable is going to be deprecated, use BaseTableProps instead.
 */
export type SimpleTableProps<T extends TableRowData = TableRowData> = BaseTableProps<T>;

export interface PrimaryTableProps<T extends TableRowData = TableRowData> extends TdPrimaryTableProps<T>, StyledProps {
  /**
   * 多级表头滚动时是否启用粘性定位效果，让上级表头在滚动时保持可见
   * @default true
   */
  stickyMultiHeader?: boolean;
}
export interface EnhancedTableProps<T extends TableRowData = TableRowData>
  extends TdEnhancedTableProps<T>,
    StyledProps {}
export type TableProps<T extends TableRowData = TableRowData> = PrimaryTableProps<T>;

export interface BaseTableRef {
  tableElement: HTMLDivElement;
  tableHtmlElement: HTMLTableElement;
  tableContentElement: HTMLDivElement;
  affixHeaderElement: HTMLDivElement;
  refreshTable: () => void;
  scrollToElement: (params: ScrollToElementParams) => void;
  scrollColumnIntoView: (columnIndex: string) => void;
  updateTableWidthOnColumnChange: (colKeys: string[]) => void;
}

export interface PrimaryTableRef extends BaseTableRef {
  validateRowData: <T extends TableRowData = TableRowData>(rowValue: any) => Promise<PrimaryTableRowValidateContext<T>>;
  validateTableData: <T extends TableRowData = TableRowData>(
    props: PrimaryTableProps<T>,
  ) => Promise<PrimaryTableValidateContext>;
  clearValidateData: () => void;
}

export interface EnhancedTableRef extends PrimaryTableRef, UseTreeDataReturnType {
  treeDataMap: TableTreeDataMap;
}

export type ThRowspanAndColspan = Map<any, RowspanColspan>;

export type BaseTableColumns<T extends TableRowData = TableRowData> = TdBaseTableProps<T>['columns'];

export interface ColumnStickyLeftAndRight {
  left: number[];
  right: number[];
  top: number[];
  bottom?: number[];
}

export interface TableColFixedClasses {
  left: string;
  right: string;
  lastLeft: string;
  firstRight: string;
  leftShadow: string;
  rightShadow: string;
}

export interface TableRowFixedClasses {
  top: string;
  bottom: string;
  firstBottom: string;
  withoutBorderBottom: string;
}

export interface FixedColumnInfo<T extends TableRowData = TableRowData> {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  parent?: FixedColumnInfo;
  children?: string[];
  width?: number;
  height?: number;
  col?: BaseTableCol<T>;
  index?: number;
  lastLeftFixedCol?: boolean;
  firstRightFixedCol?: boolean;
}

// 固定表头和固定列 具体的固定位置（left/top/right/bottom）
export type RowAndColFixedPosition<T extends TableRowData = TableRowData> = Map<string | number, FixedColumnInfo<T>>;

export type TableTreeExpandType = 'expand-all' | 'fold-all' | 'user-reaction-change' | 'props-change';
