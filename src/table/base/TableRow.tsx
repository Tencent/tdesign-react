import React, { isValidElement } from 'react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import { useTableContext } from './TableContext';
import TableCell from './TableCell';
import { DataType, TdBaseTableProps, RowspanColspan, RowspanAndColspanParams } from '../type';
import { RowSkipTdSpanColIndexsMap, RowEvents } from './TableBody';

interface MergeCellsProps {
  rowspanAndColspan?: TdBaseTableProps['rowspanAndColspan'];
  isRowspanAndColspanFn?: boolean;
  rowSkipTdSpanColIndexsMap?: RowSkipTdSpanColIndexsMap;
  dataLength?: number;
}

interface RowProps<D extends DataType> extends MergeCellsProps {
  record: D;
  rowClassName?: TdBaseTableProps['rowClassName'];
  rowIndex?: number;
  onTrClick?: () => void;
  expandOnRowClick?: boolean;
  rowEvents?: RowEvents;
}

const TableRow = <D extends DataType>(props: RowProps<D>) => {
  const {
    record,
    rowClassName,
    rowIndex,
    rowspanAndColspan,
    isRowspanAndColspanFn,
    rowSkipTdSpanColIndexsMap,
    dataLength,
    onTrClick,
    expandOnRowClick,
    rowEvents = {},
  } = props;
  const { flattenColumns } = useTableContext();
  const flattenColumnsLength = flattenColumns?.length;

  const baseRow = flattenColumns.map((column, colIndex) => {
    const { colKey, cell, render, ...restColumnProps } = column;

    const { isSkipRenderTd, rowSpan, colSpan } = getRowSpanAndColSpanAndIsSkipRenderTd({
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
        key={colKey}
        type="cell"
        rowIndex={rowIndex}
        colIndex={colIndex}
        record={record}
        colKey={colKey}
        columns={flattenColumns}
        customRender={customRender}
        rowSpan={rowSpan}
        colSpan={colSpan}
        {...restColumnProps}
      />
    );
  });

  let classes = rowClassName as string;
  if (typeof rowClassName === 'function') {
    classes = rowClassName({ row: record, rowIndex });
  }

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

  function getRowSpanAndColSpanAndIsSkipRenderTd({
    isRowspanAndColspanFn,
    rowspanAndColspan,
    rowSkipTdSpanColIndexsMap,
    rowIndex,
    colIndex,
    col,
    row,
  }: MergeCellsProps & RowspanAndColspanParams<DataType>): {
    rowSpan: number | undefined;
    colSpan: number | undefined;
    isSkipRenderTd: boolean;
  } {
    let rowSpan;
    let colSpan;
    let isSkipRenderTd = false;

    if (isRowspanAndColspanFn) {
      const rowspanAndColspanValue: RowspanColspan = rowspanAndColspan({
        rowIndex,
        colIndex,
        col,
        row,
      });

      const isRowspanAndColspanValueValid =
        rowspanAndColspanValue && (rowspanAndColspanValue.rowspan || rowspanAndColspanValue.colspan);
      if (isRowspanAndColspanValueValid) {
        rowSpan = rowspanAndColspanValue.rowspan;
        colSpan = rowspanAndColspanValue.colspan;

        if (colSpan && colSpan > 1 && colSpan < flattenColumnsLength) {
          const minIndex = colIndex + 1;
          const maxIndex = colIndex + colSpan;
          const rowSkipTdSpanColIndexs = getRowSkipTdSpanColIndexs({
            minIndex,
            maxIndex,
            rowSkipTdSpanColIndexsMap,
            rowIndex,
          });
          rowSkipTdSpanColIndexsMap[rowIndex] = rowSkipTdSpanColIndexs; // eslint-disable-line
        }

        if (rowSpan && rowSpan > 1 && rowSpan < dataLength) {
          const minRowIndex = rowIndex + 1;
          const maxRowIndex = rowIndex + rowSpan;
          const minIndex = colIndex;
          const maxIndex = colIndex + colSpan;
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
    }

    return {
      rowSpan,
      colSpan,
      isSkipRenderTd,
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

  return (
    <tr className={classes} {...rowEvents} {...(expandOnRowClick ? { onClick: onTrClick } : {})}>
      {baseRow}
    </tr>
  );
};

export default TableRow;
