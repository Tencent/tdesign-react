import React, { isValidElement } from 'react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import { DragSortInnerProps } from '../../_util/useDragSorter';
import { useTableContext } from './TableContext';
import TableCell from './TableCell';
import { DataType, TdBaseTableProps, RowspanColspan, RowspanAndColspanParams, TdPrimaryTableProps } from '../type';
import { RowSkipTdSpanColIndexsMap, RowEvents } from './TableBody';
import { ExpandInnerProps } from './Table';

interface MergeCellsProps {
  rowspanAndColspan?: TdBaseTableProps['rowspanAndColspan'];
  isRowspanAndColspanFn?: boolean;
  rowSkipTdSpanColIndexsMap?: RowSkipTdSpanColIndexsMap;
}
interface ExpandProps extends ExpandInnerProps {
  expandedRow?: TdPrimaryTableProps['expandedRow'];
  expandOnRowClick?: TdPrimaryTableProps['expandOnRowClick'];
}
interface DragRowProps extends DragSortInnerProps {
  sortOnRowDraggable?: TdPrimaryTableProps['sortOnRowDraggable'];
}
interface RowProps<D extends DataType> extends MergeCellsProps, ExpandProps, DragRowProps {
  record: D;
  rowClassName?: TdBaseTableProps['rowClassName'];
  rowIndex?: number;
  rowKey: TdBaseTableProps['rowKey'];
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
export type RowEvents = Record<RowEventName, React.MouseEventHandler<HTMLElement>> | { [key: string]: Function };

const rowEventsMap: Record<RowEventName, APIRowEventName> = {
  onClick: 'onRowClick',
  onDoubleClick: 'onRowDbClick',
  onMouseOver: 'onRowHover',
  onMouseDown: 'onRowMousedown',
  onMouseEnter: 'onRowMouseenter',
  onMouseLeave: 'onRowMouseleave',
  onMouseUp: 'onRowMouseup',
};

const TableRow = <D extends DataType>(props: RowProps<D>) => {
  const {
    record,
    rowClassName,
    rowIndex,
    rowKey,
    rowspanAndColspan,
    isRowspanAndColspanFn,
    rowSkipTdSpanColIndexsMap,
    expandedRow,
    expandOnRowClick,
    handleExpandChange,
    sortOnRowDraggable,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
  } = props;
  const { flattenColumns } = useTableContext();
  const baseRow = flattenColumns.map((column, colIndex) => {
    const { colKey, cell, render, ...restColumnProps } = column;

    const { isSkipRenderTd, rowspan, colspan, isFirstChildTdSetBorderWidth } = getRowspanAndColspanAndIsSkipRenderTd({
      isRowspanAndColspanFn,
      rowspanAndColspan,
      rowSkipTdSpanColIndexsMap,
      rowIndex,
      colIndex,
      col: column,
      row: record,
    });

    if (isSkipRenderTd) {
      return null;
    }

    const customRender = getCustomRender({ record, colKey, cell, render });

    return (
      <TableCell
        key={colKey || colIndex}
        type="cell"
        rowIndex={rowIndex}
        colIndex={colIndex}
        record={record}
        colKey={colKey}
        columns={flattenColumns}
        customRender={customRender}
        rowspan={rowspan}
        colspan={colspan}
        isFirstChildTdSetBorderWidth={isFirstChildTdSetBorderWidth}
        {...restColumnProps}
      />
    );
  });

  let classes = rowClassName as string;
  if (typeof rowClassName === 'function') {
    classes = rowClassName({ row: record, rowIndex });
  }

  const rowEvents = getRowEvents(record, rowIndex);

  function getCustomRender({ record, colKey, cell, render }) {
    if (typeof cell === 'string' || isValidElement(cell)) {
      return () => cell;
    }
    if (isFunction(cell)) {
      return cell;
    }
    if (isFunction(render)) {
      return render;
    }
    return () => get(record, colKey);
  }

  function getRowspanAndColspanAndIsSkipRenderTd({
    isRowspanAndColspanFn,
    rowspanAndColspan,
    rowSkipTdSpanColIndexsMap,
    rowIndex,
    colIndex,
    col,
    row,
  }: MergeCellsProps & RowspanAndColspanParams<DataType>): {
    rowspan: number | undefined;
    colspan: number | undefined;
    isSkipRenderTd: boolean;
    isFirstChildTdSetBorderWidth: boolean;
  } {
    let rowspan;
    let colspan;
    let isSkipRenderTd = false;
    let isFirstChildTdSetBorderWidth = false;

    if (isRowspanAndColspanFn) {
      const rowspanAndColspanValue: RowspanColspan = rowspanAndColspan({
        rowIndex,
        colIndex,
        col,
        row,
      });

      const isRowspanAndColspanValueValid = !!(rowspanAndColspanValue?.rowspan || rowspanAndColspanValue?.colspan);
      if (isRowspanAndColspanValueValid) {
        rowspan = rowspanAndColspanValue.rowspan || 1;
        colspan = rowspanAndColspanValue.colspan || 1;

        // 跨列时，存储要跳过渲染的单元格
        if (colspan && colspan > 1) {
          const minIndex = colIndex + 1;
          const maxIndex = colIndex + colspan;
          const rowSkipTdSpanColIndexs = getRowSkipTdSpanColIndexs({
            minIndex,
            maxIndex,
            rowSkipTdSpanColIndexsMap,
            rowIndex,
          });
          rowSkipTdSpanColIndexsMap[rowIndex] = rowSkipTdSpanColIndexs; // eslint-disable-line
        }

        // 跨行时，存储要跳过渲染的单元格
        if (rowspan && rowspan > 1) {
          const minRowIndex = rowIndex + 1;
          const maxRowIndex = rowIndex + rowspan;
          const minIndex = colIndex;
          const maxIndex = colIndex + colspan;
          Array.from(new Array(maxRowIndex - minRowIndex)).forEach((item, index) => {
            const skipRowIndex = index + minRowIndex;
            const rowSkipTdSpanColIndexs = getRowSkipTdSpanColIndexs({
              minIndex,
              maxIndex,
              rowSkipTdSpanColIndexsMap,
              rowIndex: skipRowIndex,
            });
            rowSkipTdSpanColIndexsMap[skipRowIndex] = rowSkipTdSpanColIndexs; // eslint-disable-line
          });
        }
      }
      isSkipRenderTd = rowSkipTdSpanColIndexsMap[rowIndex]?.includes(colIndex);
      isFirstChildTdSetBorderWidth = getIsFirstChildTdSetBorderWidth({ rowSkipTdSpanColIndexsMap, rowIndex });
    }

    return {
      rowspan,
      colspan,
      isSkipRenderTd,
      isFirstChildTdSetBorderWidth,
    };
  }

  function getRowSkipTdSpanColIndexs({ minIndex, maxIndex, rowSkipTdSpanColIndexsMap, rowIndex }): number[] {
    const rowSkipTdSpanColIndexs = rowSkipTdSpanColIndexsMap[rowIndex] || [];

    Array.from(new Array(maxIndex - minIndex)).forEach((item, index) => {
      const skipColIndex = index + minIndex;
      if (!rowSkipTdSpanColIndexs.includes(skipColIndex)) {
        rowSkipTdSpanColIndexs.push(skipColIndex);
      }
    });

    return rowSkipTdSpanColIndexs;
  }

  /**
   * 行的第一列td css设置borderWidth为0（其余列默认为1）上一行第一列存在跨行时，需补回该borderWidth为1
   */
  function getIsFirstChildTdSetBorderWidth({ rowSkipTdSpanColIndexsMap, rowIndex }) {
    if (rowIndex > 0) {
      const rowSkipTdSpanColIndexs = rowSkipTdSpanColIndexsMap?.[rowIndex];
      // 简化条件判断：rowSkipTdSpanColIndexs对应第一列td不渲染时，说明上一行存在跨行，当前行所有列borderWidth都设为1
      if (rowSkipTdSpanColIndexs && rowSkipTdSpanColIndexs[0] === 0) {
        return true;
      }
    }
    return false;
  }

  function getExpandOnClickEvent() {
    if (expandOnRowClick && expandedRow) {
      const apiEvent = rowEvents.onClick;
      const rowKeyValue = get(record, rowKey) || rowIndex;
      let onClick;
      if (apiEvent) {
        onClick = (e) => {
          apiEvent(e);
          handleExpandChange(record, rowKeyValue);
        };
      } else {
        onClick = () => {
          handleExpandChange(record, rowKeyValue);
        };
      }

      return {
        onClick,
      };
    }
    return {};
  }

  function getDragProps() {
    if (sortOnRowDraggable) {
      return {
        draggable: true,
        onDragStart: (e) => {
          onDragStart(e, rowIndex, record);
        },
        onDragOver: (e) => {
          onDragOver(e, rowIndex, record);
        },
        onDrop: (e) => {
          onDrop(e, rowIndex, record);
        },
        onDragEnd: (e) => {
          onDragEnd(e, rowIndex, record);
        },
      };
    }
    return {};
  }

  function getRowEvents(row, index): RowEvents {
    const rowEventProps = {};
    Object.keys(rowEventsMap).forEach((eventName) => {
      const apiEventName = rowEventsMap[eventName];
      const apiEvent = props[apiEventName];
      if (apiEvent) {
        rowEventProps[eventName] = (e) => {
          apiEvent({
            row,
            index,
            e,
          });
        };
      }
    });
    return rowEventProps;
  }

  return (
    <tr className={classes} {...rowEvents} {...getExpandOnClickEvent()} {...getDragProps()}>
      {baseRow}
    </tr>
  );
};

export default TableRow;
