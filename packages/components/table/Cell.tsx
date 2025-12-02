import React, { MouseEvent, MutableRefObject, ReactNode } from 'react';
import classNames from 'classnames';
import { get, isFunction } from 'lodash-es';

import TEllipsis from './Ellipsis';
import useClassName from './hooks/useClassName';
import { getColumnFixedStyles } from './hooks/useFixed';
import { formatClassNames } from './utils';

import type { PaginationProps } from '../pagination';
import type { TooltipProps } from '../tooltip';
import type { RowAndColFixedPosition } from './interface';
import type { BaseTableCellParams, RowspanColspan, TableRowData, TdBaseTableProps } from './type';

export interface RenderEllipsisCellParams {
  cellNode: ReactNode;
  tableElm?: HTMLDivElement;
  columnLength: number;
  classPrefix?: string;
  overlayClassName?: string;
}

export interface CellProps {
  cellParams: BaseTableCellParams<TableRowData>;
  rowAndColFixedPosition: RowAndColFixedPosition;
  columnLength: number;
  dataLength: number;
  cellSpans: RowspanColspan;
  cellEmptyContent: TdBaseTableProps['cellEmptyContent'];
  tableRef?: MutableRefObject<HTMLDivElement>;
  classPrefix?: string;
  overlayClassName?: string;
  pagination?: PaginationProps;
  rowspanAndColspan: TdBaseTableProps['rowspanAndColspan'];
  onClick?: (e: MouseEvent<HTMLTableCellElement>) => void;
}

export function renderCell(
  params: BaseTableCellParams<TableRowData>,
  extra?: {
    cellEmptyContent?: TdBaseTableProps['cellEmptyContent'];
    pagination?: PaginationProps;
  },
) {
  const { col, row, rowIndex } = params;
  // support serial number column
  if (col.colKey === 'serial-number') {
    const { current, pageSize, defaultCurrent, defaultPageSize } = extra?.pagination || {};
    const tCurrent = current || defaultCurrent;
    const tPageSize = pageSize || defaultPageSize;
    if (tPageSize && tCurrent) {
      return tPageSize * (tCurrent - 1) + rowIndex + 1;
    }
    return rowIndex + 1;
  }
  if (isFunction(col.cell)) {
    return col.cell(params);
  }
  if (isFunction(col.render)) {
    return col.render({ ...params, type: 'cell' });
  }
  const r = col.cell || col.render || get(row, col.colKey);
  // 0 和 false 属于正常可用之，不能使用兜底逻辑 cellEmptyContent
  if (![undefined, '', null].includes(r)) return r;
  if (extra?.cellEmptyContent) return extra.cellEmptyContent;
  return r;
}

function renderEllipsisCell(cellParams: BaseTableCellParams<TableRowData>, params: RenderEllipsisCellParams) {
  const { cellNode, tableElm, columnLength, classPrefix, overlayClassName } = params;
  const { col, colIndex } = cellParams;
  let content = isFunction(col.ellipsis) ? col.ellipsis(cellParams) : undefined;
  if (typeof col.ellipsis === 'object' && 'content' in col.ellipsis && isFunction(col.ellipsis.content)) {
    content = col.ellipsis.content(cellParams);
  }
  let tooltipProps = {};
  if (typeof col.ellipsis === 'object') {
    tooltipProps = 'props' in col.ellipsis ? col.ellipsis.props : col.ellipsis || undefined;
  }
  const tableElement = tableElm;
  let placement: TooltipProps['placement'] = colIndex === 0 ? 'top-left' : 'top';
  placement = colIndex === columnLength - 1 ? 'top-right' : placement;
  return (
    <TEllipsis
      placement={placement}
      attach={tableElement ? () => tableElement : undefined}
      popupContent={content}
      tooltipProps={tooltipProps}
      overlayClassName={overlayClassName}
      classPrefix={classPrefix}
    >
      {cellNode}
    </TEllipsis>
  );
}

const Cell = (props: CellProps) => {
  const { cellParams, tableRef, columnLength, classPrefix, overlayClassName, pagination } = props;
  const { col, colIndex, rowIndex } = cellParams;
  const { cellSpans, dataLength, rowAndColFixedPosition, cellEmptyContent, rowspanAndColspan, onClick } = props;
  const { tableColFixedClasses, tdEllipsisClass, tableBaseClass, tdAlignClasses, tableDraggableClasses } =
    useClassName();

  const cellNode = renderCell(cellParams, { cellEmptyContent, pagination });
  const tdStyles = getColumnFixedStyles(col, colIndex, rowAndColFixedPosition, tableColFixedClasses);
  const customClasses = formatClassNames(col.className, { ...cellParams, type: 'td' });
  const classes = [
    tdStyles.classes,
    customClasses,
    {
      [tdEllipsisClass]: col.ellipsis,
      [tableBaseClass.tdLastRow]: rowIndex + cellSpans.rowspan === dataLength,
      [tableBaseClass.tdFirstCol]: colIndex === 0 && rowspanAndColspan,
      [tdAlignClasses[col.align]]: col.align && col.align !== 'left',
      // 标记可拖拽列
      [tableDraggableClasses.handle]: col.colKey === 'drag',
    },
  ];
  const normalAttrs = isFunction(col.attrs) ? col.attrs({ ...cellParams, type: 'td' }) : col.attrs;
  const attrs = { ...normalAttrs, rowSpan: cellSpans.rowspan, colSpan: cellSpans.colspan };
  return (
    <td
      key={col.colKey || colIndex}
      className={classNames(classes) || undefined}
      style={tdStyles.style}
      {...attrs}
      onClick={onClick}
    >
      {col.ellipsis
        ? renderEllipsisCell(cellParams, {
            cellNode,
            tableElm: tableRef.current,
            columnLength,
            classPrefix,
            overlayClassName,
          })
        : cellNode}
    </td>
  );
};

Cell.displayName = 'Cell';

export default Cell;
