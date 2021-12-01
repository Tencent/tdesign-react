import React, { CSSProperties, useRef, useLayoutEffect, useState, PropsWithChildren } from 'react';
import classnames from 'classnames';
import { BaseTableCol, DataType } from '../type';
import useConfig from '../../_util/useConfig';
import { useTableContext } from './TableContext';

export interface CellProps<D extends DataType> extends BaseTableCol<DataType> {
  columns?: BaseTableCol[];
  type?: 'cell' | 'title';
  record?: D;
  style?: CSSProperties;
  rowIndex?: number;
  colIndex?: number;
  rowSpan?: number;
  colSpan?: number;
  customRender: Function;
}

const TableCell = <D extends DataType>(props: PropsWithChildren<CellProps<D>>) => {
  const {
    style = {},
    width,
    type,
    record,
    colKey,
    customRender,
    colIndex,
    fixed,
    align,
    ellipsis,
    columns,
    rowIndex,
    className,
    rowSpan,
    colSpan,
  } = props;

  const { classPrefix } = useConfig();
  const { flattenColumns } = useTableContext();
  const [offset, setOffset] = useState(0);
  const [isBoundary, setIsBoundary] = useState(false);

  const ref = useRef<HTMLTableDataCellElement | HTMLTableHeaderCellElement>();

  useLayoutEffect(() => {
    if (ref.current) {
      let offset = 0;
      const { clientWidth } = ref.current;
      const fixedColumns = flattenColumns.filter((column) => column.fixed === fixed);
      const indexInFixedColumns = fixedColumns.findIndex(({ colKey: key }) => key === colKey);

      fixedColumns.forEach((_, cur) => {
        if ((fixed === 'right' && cur > indexInFixedColumns) || (fixed === 'left' && cur < indexInFixedColumns)) {
          offset += clientWidth;
        }
      });
      setOffset(offset);

      const isBoundary = fixed === 'left' ? indexInFixedColumns === fixedColumns.length - 1 : indexInFixedColumns === 0;
      setIsBoundary(isBoundary);
    }
  }, [ref, flattenColumns, colKey, fixed]);

  const cellNode = customRender({ type, row: record, rowIndex, col: columns?.[colIndex], colIndex });

  // ==================== styles ====================
  const cellStyle = { ...style };
  if (fixed) {
    cellStyle.position = 'sticky';
    cellStyle[fixed] = offset;
  }
  if (width) {
    style.overflow = 'hidden';
  }

  // 样式依靠 td，之后实现请改为 th
  // const Component = type === 'title' ? 'td' : 'td'; // codecc error
  const Component = 'td';
  return (
    <Component
      ref={ref}
      style={cellStyle}
      className={classnames({
        [`${classPrefix}-table__cell--fixed-${fixed}`]: fixed,
        [`${classPrefix}-table__cell--fixed-${fixed}-${fixed === 'left' ? 'last' : 'first'}`]: fixed && isBoundary,
        [`align-${align}`]: align,
        'text-ellipsis': ellipsis,
        [`${className}`]: !!className,
      })}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {cellNode}
    </Component>
  );
};

export default TableCell;
