import React, { CSSProperties } from 'react';
import isCallable from '../../_util/isCallable';
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

  return (
    <thead>
      {trsColumns.map((trsColumnsItem: CellProps<D>[], index) => (
        <tr key={index}>
          {trsColumnsItem.map((column: CellProps<D>) => {
            const { title, colKey, fixed, className, style = {}, rowSpan, colSpan } = column;
            let content: React.ReactNode | JSX.Element[] = title;

            if (isCallable(title)) {
              content = title({ col: column, colIndex: index });
            }

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
                colIndex={index}
                render={() => content}
                style={{ ...styleNew, ...style }}
                fixed={fixed}
                columns={columns}
                className={className}
                rowSpan={rowSpan}
                colSpan={colSpan}
              >
                {content as JSX.Element[]}
              </TableCell>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

export default TableHeader;
