import { TableProps } from '../TableProps';

export default function getRowKeyFromRowKey(rowKey: TableProps['rowKey']): any {
  let getRowKey: Exclude<typeof rowKey, string> = null;
  if (typeof rowKey === 'function') {
    getRowKey = rowKey;
  } else if (typeof rowKey === 'string') {
    getRowKey = (record) => String(record[rowKey]);
  }
  return getRowKey;
}
