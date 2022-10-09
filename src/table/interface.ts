import { ReactFragment } from 'react';
import { StyledProps } from '../common';
import { TableTreeDataMap } from './hooks/tree-store';
import { UseTreeDataReturnType } from './hooks/useTreeData';
import {
  TdBaseTableProps,
  TableExpandedRowParams,
  TableRowData,
  TdPrimaryTableProps,
  TdEnhancedTableProps,
  RowspanColspan,
  BaseTableCol,
  PrimaryTableRowValidateContext,
  PrimaryTableValidateContext,
} from './type';

export interface BaseTableProps<T extends TableRowData = TableRowData> extends TdBaseTableProps<T>, StyledProps {
  /**
   * 渲染展开行。非公开属性，请勿在业务中使用
   */
  renderExpandedRow?: (params: TableExpandedRowParams<TableRowData>) => ReactFragment;
  /**
   * 多级表头场景，叶子结点变化时执行。非公开属性，请勿在业务中使用
   */
  onLeafColumnsChange?: (columns: BaseTableColumns) => void;
}

/**
 * SimpleTable is going to be deprecated, use BaseTableProps instead.
 */
export type SimpleTableProps<T extends TableRowData = TableRowData> = BaseTableProps<T>;

export interface PrimaryTableProps<T extends TableRowData = TableRowData> extends TdPrimaryTableProps<T>, StyledProps {}
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

// 允许修改列宽时，重新计算各列宽度的函数声明
export interface RecalculateColumnWidthFunc<T extends TableRowData = TableRowData> {
  (
    columns: BaseTableCol<T>[],
    thWidthList: { [colKey: string]: number },
    tableLayout: string,
    tableElmWidth: number,
  ): void;
}
