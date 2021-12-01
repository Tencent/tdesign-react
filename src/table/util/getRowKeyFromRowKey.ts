import { TdBaseTableProps } from '../type';

export default function getRowKeyFromRowKey(rowKey: TdBaseTableProps['rowKey']): any {
  let getRowKey = null;
  if (typeof rowKey === 'function') {
    getRowKey = rowKey;
  } else if (typeof rowKey === 'string') {
    getRowKey = (record) => record[rowKey];
  }
  return getRowKey;
}
