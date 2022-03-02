import React, { isValidElement } from 'react';
import isFunction from 'lodash/isFunction';
import { BaseTableCol, DataType } from '../type';
import TableCell, { CellProps } from './TableCell';
import { Styles } from '../../common';

interface TableHeaderProps<D extends DataType> {
  columns: (BaseTableCol<D> & { style?: Styles })[];
}

const TableHeader = <D extends DataType>(props: TableHeaderProps<D>) => {
  const { columns } = props;
  const columnsDepth = getNodeDepth(columns);
  const trsColumns = getTrsColumns(columns, columnsDepth);

  function getTrsColumns(nodes, columnsDepth, currentDepth = 1, trsColumns = []): CellProps<D>[][] {
    let trsColumnsNew = trsColumns;
    nodes.forEach((item) => {
      const { children, ...rest } = item;
      if (item.children) {
        trsColumnsNew = getTrsColumns(children, columnsDepth, currentDepth + 1, trsColumnsNew);
      }
      const trIndex = currentDepth - 1;
      const currentTr = trsColumns[trIndex];
      const { rowspan, colspan } = getRowspanAndColspan({ node: item, columnsDepth, currentDepth });
      const tdIndex = !currentTr ? 0 : currentTr.length;
      const currentTd = { colKey: `tr-${trIndex}_td-${tdIndex}`, ...rest, rowspan, colspan };
      if (!currentTr) {
        trsColumnsNew[trIndex] = [currentTd];
      } else {
        trsColumnsNew[trIndex] = [...currentTr, currentTd];
      }
    });
    return trsColumnsNew;
  }

  function getRowspanAndColspan({ node, columnsDepth, currentDepth }) {
    let rowspan = 1;
    let colspan = 1;
    if (node.children) {
      rowspan = 1;
      colspan = getLeafNodeCount(node.children);
    } else {
      rowspan = columnsDepth - currentDepth + 1;
      colspan = 1;
    }
    return {
      rowspan,
      colspan,
    };
  }

  function getNodeDepth(nodes, currentDepth = 1, depth = 1) {
    let depthNew = depth;
    let currentDepthNew = currentDepth;
    nodes?.forEach(({ children }) => {
      if (children) {
        currentDepthNew += 1;
        if (currentDepthNew > depthNew) {
          depthNew = currentDepthNew;
        }
        depthNew = getNodeDepth(children, currentDepthNew, depthNew);
      }
    });
    return depthNew;
  }

  function getLeafNodeCount(nodes, count = 0) {
    let countNew = count;
    nodes.forEach(({ children }) => {
      if (children) {
        countNew = getLeafNodeCount(children, countNew);
      } else {
        countNew += 1;
      }
    });
    return countNew;
  }

  function getCustomRender({ title, render }) {
    if (typeof title === 'string' || isValidElement(title)) {
      return () => title;
    }
    if (isFunction(title)) {
      return title;
    }
    if (isFunction(render)) {
      return render;
    }
    return () => null;
  }

  /**
   * 行的第一列td css设置borderWidth为0（其余列默认为1），上一行第一列存在跨行时，需补回该borderWidth为1
   */
  function getIsFirstChildTdSetBorderWidth({ trsColumns, rowIndex, colIndex }) {
    if (colIndex === 0 && rowIndex > 0) {
      const preRowColumns = trsColumns[rowIndex - 1];
      if (preRowColumns[0].rowspan > 1) {
        return true;
      }
    }
    return false;
  }

  return (
    <thead>
      {trsColumns.map((trsColumnsItem: CellProps<D>[], rowIndex) => (
        <tr key={rowIndex}>
          {trsColumnsItem.map((column: CellProps<D>, colIndex) => {
            const { title, colKey, rowspan, colspan, render, ...rest } = column;
            const customRender = getCustomRender({ title, render });
            const isFirstChildTdSetBorderWidth = getIsFirstChildTdSetBorderWidth({ trsColumns, rowIndex, colIndex });

            return (
              <TableCell
                type="title"
                key={colKey}
                colKey={colKey}
                colIndex={colIndex}
                customRender={customRender}
                rowspan={rowspan}
                colspan={colspan}
                isFirstChildTdSetBorderWidth={isFirstChildTdSetBorderWidth}
                {...rest}
              ></TableCell>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

export default TableHeader;
