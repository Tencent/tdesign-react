import React, { CSSProperties, isValidElement } from 'react';
import isFunction from 'lodash/isFunction';
import { BaseTableCol, DataType } from '../../_type/components/table';
import { useTableContext } from './TableContext';
import TableCell, { CellProps } from './TableCell';
import { Styles } from '../../_type/common';

interface TableHeaderProps<D extends DataType> {
  columns: (BaseTableCol<D> & { style?: Styles })[];
}

const TableHeader = <D extends DataType>(props: TableHeaderProps<D>) => {
  const { stickyHeader } = useTableContext();
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
      const { rowSpan, colSpan } = getRowSpanAndColSpan({ node: item, columnsDepth, currentDepth });
      const tdIndex = !currentTr ? 0 : currentTr.length;
      const currentTd = { colKey: `tr-${trIndex}_td-${tdIndex}`, ...rest, rowSpan, colSpan };
      if (!currentTr) {
        trsColumnsNew[trIndex] = [currentTd];
      } else {
        trsColumnsNew[trIndex] = [...currentTr, currentTd];
      }
    });
    return trsColumnsNew;
  }

  function getRowSpanAndColSpan({ node, columnsDepth, currentDepth }) {
    let rowSpan = 1;
    let colSpan = 1;
    if (node.children) {
      rowSpan = 1;
      colSpan = getLeafNodeCount(node.children);
    } else {
      rowSpan = columnsDepth - currentDepth + 1;
      colSpan = 1;
    }
    return {
      rowSpan,
      colSpan,
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

  return (
    <thead>
      {trsColumns.map((trsColumnsItem: CellProps<D>[], index) => (
        <tr key={index}>
          {trsColumnsItem.map((column: CellProps<D>, colIndex) => {
            const { title, colKey, fixed, className, style = {}, rowSpan, colSpan, render } = column;
            const customRender = getCustomRender({ title, render });

            const styleNew: CSSProperties = {};
            if (stickyHeader) {
              styleNew.position = 'sticky';
              styleNew.top = 0;
              styleNew.background = '#FFF';
              styleNew.zIndex = 1;
              styleNew.borderBottom = 'solid 1px #e7e7e7';
            }
            if (fixed) {
              styleNew.zIndex = ((styleNew.zIndex as number) || 0) + 1;
            }

            return (
              <TableCell
                type="title"
                key={colKey}
                colKey={colKey}
                colIndex={colIndex}
                customRender={customRender}
                style={{ ...styleNew, ...style }}
                fixed={fixed}
                columns={columns}
                className={className}
                rowSpan={rowSpan}
                colSpan={colSpan}
              ></TableCell>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

export default TableHeader;
