/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdBaseTableProps, TdPrimaryTableProps } from './type';

export const baseTableDefaultProps: TdBaseTableProps = {
  bordered: false,
  columns: [],
  data: [],
  disableDataPage: false,
  footData: [],
  footerAffixedBottom: false,
  headerAffixedTop: false,
  hover: false,
  loading: undefined,
  resizable: false,
  rowKey: 'id',
  size: 'medium',
  stripe: false,
  tableLayout: 'fixed',
  verticalAlign: 'middle',
};

export const primaryTableDefaultProps: Pick<
  TdPrimaryTableProps,
  | 'columnControllerVisible'
  | 'columns'
  | 'defaultExpandedRowKeys'
  | 'expandIcon'
  | 'multipleSort'
  | 'defaultSelectedRowKeys'
  | 'sortOnRowDraggable'
> = {
  columnControllerVisible: undefined,
  columns: [],
  defaultExpandedRowKeys: [],
  expandIcon: true,
  multipleSort: false,
  defaultSelectedRowKeys: [],
  sortOnRowDraggable: false,
};
