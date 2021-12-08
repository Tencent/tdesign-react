import React, { forwardRef } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { TdPrimaryTableProps } from '../type';
import useConfig from '../../_util/useConfig';
import TableRow from './TableRow';
import { ExpandProps } from './Table';

export interface RowSkipTdSpanColIndexsMap {
  [key: number]: number[];
}

type RowEventName =
  | 'onClick'
  | 'onDoubleClick'
  | 'onMouseOver'
  | 'onMouseDown'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseUp';
type APIRowEventName =
  | 'onRowClick'
  | 'onRowDbClick'
  | 'onRowHover'
  | 'onRowMousedown'
  | 'onRowMouseenter'
  | 'onRowMouseleave'
  | 'onRowMouseup';
export type RowEvents = Record<RowEventName, Function> | {};

const rowEventsMap: Record<RowEventName, APIRowEventName> = {
  onClick: 'onRowClick',
  onDoubleClick: 'onRowDbClick',
  onMouseOver: 'onRowHover',
  onMouseDown: 'onRowMousedown',
  onMouseEnter: 'onRowMouseenter',
  onMouseLeave: 'onRowMouseleave',
  onMouseUp: 'onRowMouseup',
};

const TableBody = forwardRef(
  (props: TdPrimaryTableProps & ExpandProps, ref: React.Ref<HTMLTableSectionElement>): any => {
    const { classPrefix } = useConfig();
    const {
      data = [],
      rowKey,
      rowClassName,
      expandedRow,
      expandOnRowClick = false,
      onTrClick,
      rowspanAndColspan,
      renderExpandRow,
    } = props;
    const rowSkipTdSpanColIndexsMap: RowSkipTdSpanColIndexsMap = {}; // 引用，不可重置。eg: { 0: [1, 3] } 表示第1行，第2、4列两个cell不渲染
    const isRowspanAndColspanFn = isFunction(rowspanAndColspan);

    const rowEvents = getRowEvents();

    // ==================== render ====================
    const rows = data.map((row, index) => {
      const rowKeyValue = get(row, rowKey) || index;

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
            rowEvents={rowEvents}
          />
          {expandedRow ? renderExpandRow(row, index, rowKeyValue) : null}
        </React.Fragment>
      );
    });

    function getRowEvents(): RowEvents {
      const rowEventProps = {};
      Object.keys(rowEventsMap).forEach((eventName) => {
        const apiEventName = rowEventsMap[eventName];
        const apiEvent = props[apiEventName];
        if (apiEvent) {
          rowEventProps[eventName] = apiEvent;
        }
      });
      return rowEventProps;
    }

    return (
      <tbody ref={ref} className={`${classPrefix}-table__body`}>
        {rows}
      </tbody>
    );
  },
);

export default TableBody;
