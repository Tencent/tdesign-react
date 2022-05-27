/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdBaseTableProps, TdEnhancedTableProps, TdPrimaryTableProps } from './type';

export const baseTableDefaultProps: TdBaseTableProps = {
  allowResizeColumnWidth: false,
  bordered: false,
  columns: [],
  data: [],
  disableDataPage: false,
  footData: [],
  footerAffixedBottom: false,
  headerAffixedTop: false,
  hover: false,
  loading: undefined,
  rowKey: 'id',
  size: 'medium',
  stripe: false,
  tableLayout: 'fixed',
  verticalAlign: 'middle',
};

export const enhancedTableDefaultProps: Omit<TdEnhancedTableProps, 'rowKey'> = {};

export const primaryTableDefaultProps: Omit<TdPrimaryTableProps, 'rowKey'> = {
  columnControllerVisible: undefined,
  columns: [],
  expandedRowKeys: [],
  expandIcon: true,
  multipleSort: false,
  sortOnRowDraggable: false,
};
