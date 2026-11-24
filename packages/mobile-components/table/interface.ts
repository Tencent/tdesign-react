import { StyledProps } from '../common';
import { BaseTableCol, TableRowData, TdBaseTableProps, TdPrimaryTableProps } from './type';

export interface BaseTableProps<T extends TableRowData = TableRowData> extends TdBaseTableProps<T>, StyledProps {
  /**
   * 多级表头场景，叶子结点变化时执行。非公开属性，请勿在业务中使用
   */
  onLeafColumnsChange?: (columns: BaseTableColumns) => void;
  /**
   * 表头是否可拖拽。非公开属性，请勿在业务中使用
   */
  thDraggable?: boolean;
}

export interface PrimaryTableProps<T extends TableRowData = TableRowData> extends TdPrimaryTableProps<T>, StyledProps {}

/**
 * SimpleTable is going to be deprecated, use BaseTableProps instead.
 */
export type SimpleTableProps<T extends TableRowData = TableRowData> = BaseTableProps<T>;

export interface BaseTableRef {
  tableElement: HTMLDivElement;
  tableHtmlElement: HTMLTableElement;
  tableContentElement: HTMLDivElement;
  refreshTable: () => void;
}

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

export type PrimaryTableRef = BaseTableRef
