import React, { isValidElement } from 'react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import { useTableContext } from './TableContext';
import TableCell from './TableCell';
import { DataType, TdBaseTableProps, RowspanColspan, RowspanAndColspanParams, TdPrimaryTableProps } from '../type';
import { RowSkipTdSpanColIndexsMap, RowEvents } from './TableBody';
import { ExpandInnerProps } from './Table';

interface MergeCellsProps {
  rowspanAndColspan?: TdBaseTableProps['rowspanAndColspan'];
  isRowspanAndColspanFn?: boolean;
  rowSkipTdSpanColIndexsMap?: RowSkipTdSpanColIndexsMap;
  dataLength?: number;
}
interface ExpandProps extends ExpandInnerProps {
  expandedRow?: TdPrimaryTableProps['expandedRow'];
  expandOnRowClick?: TdPrimaryTableProps['expandOnRowClick'];
}
interface RowProps<D extends DataType> extends MergeCellsProps, ExpandProps {
  record: D;
  rowClassName?: TdBaseTableProps['rowClassName'];
  rowIndex?: number;
  rowEvents?: RowEvents;
  rowKey: TdBaseTableProps['rowKey'];
}

const TableRow = <D extends DataType>(props: RowProps<D>) => {
  const {
    record,
    rowClassName,
    rowIndex,
    rowKey,
    rowspanAndColspan,
    isRowspanAndColspanFn,
    rowSkipTdSpanColIndexsMap,
    dataLength,
    rowEvents = {},
    expandedRow,
    expandOnRowClick,
    handleExpandChange,
  } = props;
  const { flattenColumns } = useTableContext();
  const flattenColumnsLength = flattenColumns?.length;
  const baseRow = flattenColumns.map((column, colIndex) => {
    const { colKey, cell, render, ...restColumnProps } = column;

    const { isSkipRenderTd, rowSpan, colSpan, isFirstChildTdSetBorderWidth } = getRowSpanAndColSpanAndIsSkipRenderTd({
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
        isFirstChildTdSetBorderWidth={isFirstChildTdSetBorderWidth}
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
    isFirstChildTdSetBorderWidth: boolean;
  } {
    let rowSpan;
    let colSpan;
    let isSkipRenderTd = false;
    let isFirstChildTdSetBorderWidth = false;

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
      isFirstChildTdSetBorderWidth = getIsFirstChildTdSetBorderWidth({ rowSkipTdSpanColIndexsMap, rowIndex });
    }

    return {
      rowSpan,
      colSpan,
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

  return (
    <tr className={classes} {...rowEvents} {...getExpandOnClickEvent()}>
      {baseRow}
    </tr>
  );
};

export default TableRow;
