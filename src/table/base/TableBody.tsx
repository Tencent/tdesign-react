import React, { forwardRef, useMemo, useState } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { TdPrimaryTableProps } from '../type';
import useConfig from '../../_util/useConfig';
import { DragSortInnerProps } from '../../_util/useDragSorter';
import TableRow from './TableRow';
import { ExpandInnerProps } from './Table';
import { useTableContext } from './TableContext';

interface TableBodyProps extends TdPrimaryTableProps, ExpandInnerProps, DragSortInnerProps {}

export interface RowSkipTdSpanColIndexsMap {
  [key: number]: number[];
}

const TableBody = forwardRef((props: TableBodyProps, ref: React.Ref<HTMLTableSectionElement>): any => {
  const { classPrefix } = useConfig();
  const {
    data = [],
    rowKey,
    rowClassName,
    expandedRow,
    expandOnRowClick,
    handleExpandChange,
    renderExpandRow,
    innerExpandRowKeys,
    rowspanAndColspan,
    sortOnRowDraggable,
    dragging,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
  } = props;
  const { flattenData } = useTableContext();
  const flattenVisibleData = flattenData || data;
  const [rowSkipTdSpanColIndexsMap] = useState<RowSkipTdSpanColIndexsMap>({}); // 引用，不可重置。eg: { 0: [1, 3] } 表示第1行，第2、4列两个cell不渲染
  const isRowspanAndColspanFn = isFunction(rowspanAndColspan);

  // ==================== render ====================
  const rows = useMemo(
    () =>
      flattenVisibleData.map((row, index) => {
        const rowKeyValue = get(row, rowKey) || index;

        return (
          <React.Fragment key={rowKeyValue}>
            <TableRow
              record={row}
              rowIndex={index}
              rowKey={rowKey}
              rowClassName={rowClassName}
              expandedRow={expandedRow}
              expandOnRowClick={expandOnRowClick}
              handleExpandChange={handleExpandChange}
              {...(isRowspanAndColspanFn
                ? {
                    isRowspanAndColspanFn,
                    rowspanAndColspan,
                    rowSkipTdSpanColIndexsMap,
                  }
                : {})}
              {...(sortOnRowDraggable
                ? {
                    sortOnRowDraggable,
                    onDragStart,
                    onDragOver,
                    onDrop,
                    onDragEnd,
                  }
                : {})}
            />
            {expandedRow && innerExpandRowKeys ? renderExpandRow(row, index, rowKeyValue) : null}
          </React.Fragment>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flattenVisibleData, innerExpandRowKeys, onDragOver],
  );

  return (
    <tbody
      ref={ref}
      className={classNames(`${classPrefix}-table__body`, { [`${classPrefix}-table__body--dragging`]: dragging })}
    >
      {rows}
    </tbody>
  );
});

export default React.memo(TableBody);
