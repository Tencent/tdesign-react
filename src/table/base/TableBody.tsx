import React, { forwardRef } from 'react';
import { TdBaseTableProps } from '../../_type/components/base-table';
import useConfig from '../../_util/useConfig';
import getRowKeyFromRowKey from '../util/getRowKeyFromRowKey';

import TableRow from './TableRow';

const TableBody = forwardRef((props: TdBaseTableProps, ref: React.Ref<HTMLTableSectionElement>): any => {
  const { classPrefix } = useConfig();
  const { data = [], rowKey, rowClassName } = props;

  // 键值的获取方式
  const getRowKey = getRowKeyFromRowKey(rowKey);

  // ==================== render ====================
  const rows = data.map((record, index) => {
    const rowKey = getRowKey(record, index);
    return <TableRow record={record} index={index} key={rowKey} rowClassName={rowClassName} />;
  });

  return (
    <tbody ref={ref} className={`${classPrefix}-table__body`}>
      {rows}
    </tbody>
  );
});

export default TableBody;
