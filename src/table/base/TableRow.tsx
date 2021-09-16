import React from 'react';
import { useTableContext } from './TableContext';
import TableCell from './TableCell';
import { DataType, TdBaseTableProps, RowspanColspan, RowspanAndColspanParams } from '../../_type/components/table';
import { RowSkipTdSpanColIndexsMap } from './TableBody';

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
  } = props;
  const { flattenColumns } = useTableContext();
  const flattenColumnsLength = flattenColumns?.length;

  const baseRow = flattenColumns.map((column, colIndex) => {
    const { colKey, ...restColumnProps } = column;

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

    return (
      <TableCell
        key={colKey}
        rowIndex={rowIndex}
        colIndex={colIndex}
        record={record}
        colKey={colKey}
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

  return <tr className={classes}>{baseRow}</tr>;
};

export default TableRow;
