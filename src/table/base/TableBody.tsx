import React, { forwardRef } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { TdPrimaryTableProps } from '../../_type/components/table';
import useConfig from '../../_util/useConfig';
import TableRow from './TableRow';
import { ExpandProps } from './Table';

export interface RowSkipTdSpanColIndexsMap {
  [key: number]: number[];
}

const TableBody = forwardRef(
  (props: TdPrimaryTableProps & ExpandProps, ref: React.Ref<HTMLTableSectionElement>): any => {
    const { classPrefix } = useConfig();
    const {
      data = [],
      rowKey,
      rowClassName,
      expandedRow,
      columns,
      expandOnRowClick = false,
      onTrClick,
      innerExpandedRowKeys,
      rowspanAndColspan,
    } = props;
    const rowSkipTdSpanColIndexsMap: RowSkipTdSpanColIndexsMap = {}; // 引用，不可重置。eg: { 0: [1, 3] } 表示第1行，第2、4列两个cell不渲染
    const isRowspanAndColspanFn = isFunction(rowspanAndColspan);

    // ==================== render ====================
    const rows = data.map((row, index) => {
      const rowKeyValue = get(row, rowKey);

      return (
        <React.Fragment key={rowKeyValue}>
          <TableRow
            record={row}
            rowIndex={index}
            rowClassName={rowClassName}
            {...(expandedRow && expandOnRowClick
              ? { onTrClick: () => onTrClick(row, rowKeyValue), expandOnRowClick }
              : {})}
            {...(isRowspanAndColspanFn
              ? {
                  isRowspanAndColspanFn,
                  rowspanAndColspan,
                  rowSkipTdSpanColIndexsMap,
                  dataLength: data.length,
                }
              : {})}
          />
          {expandedRow ? (
            <tr
              className={`${classPrefix}-table-expanded-cell`}
              style={innerExpandedRowKeys?.includes?.(rowKeyValue) ? {} : { display: 'none' }}
            >
              <td colSpan={columns?.length}>{expandedRow && expandedRow({ row, index })}</td>
            </tr>
          ) : null}
        </React.Fragment>
      );
    });

    return (
      <tbody ref={ref} className={`${classPrefix}-table__body`}>
        {rows}
      </tbody>
    );
  },
);

export default TableBody;
