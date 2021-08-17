import { TdBaseTableProps } from '../../_type/components/table';

export default function getRowKeyFromRowKey(rowKey: TdBaseTableProps['rowKey']): any {
  let getRowKey = null;
  if (typeof rowKey === 'function') {
    getRowKey = rowKey;
  } else if (typeof rowKey === 'string') {
    getRowKey = (record) => String(record[rowKey]);
  }
  return getRowKey;
}
