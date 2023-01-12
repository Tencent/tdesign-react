/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdBaseTableProps, TdPrimaryTableProps } from './type';

export const baseTableDefaultProps: TdBaseTableProps = {
  bordered: false,
  columns: [],
  data: [],
  disableDataPage: false,
  empty: '',
  footData: [],
  footerAffixedBottom: false,
  headerAffixedTop: false,
  hover: false,
  loading: undefined,
  resizable: false,
  rowKey: 'id',
  showHeader: true,
  size: 'medium',
  stripe: false,
  tableLayout: 'fixed',
  verticalAlign: 'middle',
};

export const primaryTableDefaultProps: Pick<
  TdPrimaryTableProps,
  | 'columnControllerVisible'
  | 'columns'
  | 'expandIcon'
  | 'defaultExpandedRowKeys'
  | 'multipleSort'
  | 'reserveSelectedRowOnPaginate'
  | 'defaultSelectedRowKeys'
  | 'showSortColumnBgColor'
  | 'sortOnRowDraggable'
> = {
  columnControllerVisible: undefined,
  columns: [],
  expandIcon: true,
  defaultExpandedRowKeys: [],
  multipleSort: false,
  reserveSelectedRowOnPaginate: true,
  defaultSelectedRowKeys: [],
  showSortColumnBgColor: false,
  sortOnRowDraggable: false,
};
