import React, { forwardRef } from 'react';
import isFunction from 'lodash/isFunction';
import { TdBaseTableProps } from '../../_type/components/table';
import useConfig from '../../_util/useConfig';
import getRowKeyFromRowKey from '../util/getRowKeyFromRowKey';

import TableRow from './TableRow';

export interface RowSkipTdSpanColIndexsMap {
  [key: number]: number[];
}

const TableBody = forwardRef((props: TdBaseTableProps, ref: React.Ref<HTMLTableSectionElement>): any => {
  const { classPrefix } = useConfig();
  const { data = [], rowKey, rowClassName, rowspanAndColspan } = props;
  const rowSkipTdSpanColIndexsMap = {}; // 引用，不可重置。eg: { 0: [1, 3] } 表示第1行，第2、4列两个cell不渲染
  const isRowspanAndColspanFn = isFunction(rowspanAndColspan);

  // 键值的获取方式
  const getRowKey = getRowKeyFromRowKey(rowKey);

  // ==================== render ====================
  const rows = data.map((record, index) => {
    const rowKey = getRowKey(record, index);

    return (
      <TableRow
        record={record}
        rowIndex={index}
        key={rowKey}
        rowClassName={rowClassName}
        {...(isRowspanAndColspanFn
          ? {
              isRowspanAndColspanFn,
              rowspanAndColspan,
              rowSkipTdSpanColIndexsMap,
              dataLength: data.length,
            }
          : {})}
      />
    );
  });

  return (
    <tbody ref={ref} className={`${classPrefix}-table__body`}>
      {rows}
    </tbody>
  );
});

export default TableBody;
