import React, { useMemo, useRef, MouseEvent } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import classnames from 'classnames';
import { formatRowAttributes, formatRowClassNames } from './utils';
import { getRowFixedStyles, getColumnFixedStyles, RowAndColFixedPosition } from './hooks/useFixed';
import useClassName from './hooks/useClassName';
import TEllipsis from './Ellipsis';
import { BaseTableCellParams, TableRowData, RowspanColspan, TdBaseTableProps, TableScroll } from './type';
import useLazyLoad from './hooks/useLazyLoad';

export interface RenderTdExtra {
  rowAndColFixedPosition: RowAndColFixedPosition;
  columnLength: number;
  dataLength: number;
  cellSpans: RowspanColspan;
}

export interface RenderEllipsisCellParams {
  cellNode: any;
}

export type TrCommonProps = Pick<TdBaseTableProps, TrPropsKeys>;

export const TABLE_PROPS = [
  'rowKey',
  'rowClassName',
  'columns',
  'fixedRows',
  'footData',
  'rowAttributes',
  'rowspanAndColspan',
  'scroll',
  'onCellClick',
  'onRowClick',
  'onRowDblclick',
  'onRowMouseover',
  'onRowMousedown',
  'onRowMouseenter',
  'onRowMouseleave',
  'onRowMouseup',
] as const;

export type TrPropsKeys = typeof TABLE_PROPS[number];

export interface TrProps extends TrCommonProps {
  rowKey: string;
  row?: TableRowData;
  rowIndex?: number;
  dataLength?: number;
  rowAndColFixedPosition?: RowAndColFixedPosition;
  // 属性透传，引用传值，可内部改变
  skipSpansMap?: Map<any, boolean>;
  scrollType?: string;
  isVirtual?: boolean;
  rowHeight?: number;
  trs?: Map<number, object>;
  bufferSize?: number;
  scroll?: TableScroll;
  tableElm?: HTMLDivElement;
  tableContentElm?: HTMLDivElement;
  onRowMounted?: () => void;
  onTrRowspanOrColspan?: (params: BaseTableCellParams<TableRowData>, cellSpans: RowspanColspan) => void;
}

export const ROW_LISTENERS = ['click', 'dblclick', 'mouseover', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup'];

export function renderCell(params: BaseTableCellParams<TableRowData>) {
  const { col, row } = params;
  if (isFunction(col.cell)) {
    return col.cell(params);
  }
  if (isFunction(col.render)) {
    return col.render({ ...params, type: 'cell' });
  }
  return col.cell || col.render || get(row, col.colKey);
}

// 表格行组件
export default function TR(props: TrProps) {
  const {
    row,
    rowKey,
    rowIndex,
    rowClassName,
    rowAttributes,
    dataLength,
    fixedRows,
    scroll,
    tableContentElm,
    rowAndColFixedPosition,
  } = props;

  const trRef = useRef<HTMLTableRowElement>();

  const {
    tdEllipsisClass,
    tableBaseClass,
    tableColFixedClasses,
    tableRowFixedClasses,
    tdAlignClasses,
    tableDraggableClasses,
  } = useClassName();

  const trStyles = getRowFixedStyles(
    get(row, rowKey || 'id'),
    rowIndex,
    dataLength,
    fixedRows,
    rowAndColFixedPosition,
    tableRowFixedClasses,
  );

  const trAttributes = useMemo(
    () => formatRowAttributes(rowAttributes, { row, rowIndex, type: 'body' }) || {},
    [row, rowAttributes, rowIndex],
  );

  const classes = useMemo(() => {
    const customClasses = formatRowClassNames(rowClassName, { row, rowIndex, type: 'body' }, rowKey || 'id');
    return [trStyles?.classes, customClasses];
  }, [row, rowClassName, rowIndex, rowKey, trStyles?.classes]);

  const useLazyLoadParams = useMemo(() => ({ ...scroll, rowIndex }), [scroll, rowIndex]);
  const { hasLazyLoadHolder, tRowHeight } = useLazyLoad(tableContentElm, trRef.current, useLazyLoadParams);

  function renderEllipsisCell(cellParams: BaseTableCellParams<TableRowData>, params: RenderEllipsisCellParams) {
    const { cellNode } = params;
    const { col, colIndex } = cellParams;
    // 前两列左对齐显示
    const placement = colIndex < 2 ? 'top-left' : 'top-right';
    const content = isFunction(col.ellipsis) ? col.ellipsis(cellParams) : undefined;
    const tableElement = props.tableElm;
    return (
      <TEllipsis
        placement={placement}
        attach={tableElement ? () => tableElement : undefined}
        popupContent={content}
        popupProps={typeof col.ellipsis === 'object' ? col.ellipsis : undefined}
      >
        {cellNode}
      </TEllipsis>
    );
  }

  function renderTd(params: BaseTableCellParams<TableRowData>, extra: RenderTdExtra) {
    const { col, colIndex, rowIndex } = params;
    const { cellSpans, dataLength, rowAndColFixedPosition } = extra;
    const cellNode = renderCell(params);
    const tdStyles = getColumnFixedStyles(col, colIndex, rowAndColFixedPosition, tableColFixedClasses);
    const customClasses = isFunction(col.className) ? col.className({ ...params, type: 'td' }) : col.className;
    const classes = [
      tdStyles.classes,
      customClasses,
      {
        [tdEllipsisClass]: col.ellipsis,
        [tableBaseClass.tdLastRow]: rowIndex + cellSpans.rowspan === dataLength,
        [tableBaseClass.tdFirstCol]: colIndex === 0 && props.rowspanAndColspan,
        [tdAlignClasses[col.align]]: col.align && col.align !== 'left',
        // 标记可拖拽列
        [tableDraggableClasses.handle]: col.colKey === 'drag',
      },
    ];
    const onClick = (e: MouseEvent<HTMLTableCellElement>) => {
      const p = { ...params, e };
      props.onCellClick?.(p);
    };
    const attrs = { ...col.attrs, rowSpan: cellSpans.rowspan, colSpan: cellSpans.colspan };
    if (!col.colKey) return null;
    return (
      <td key={col.colKey} className={classnames(classes)} style={tdStyles.style} {...attrs} onClick={onClick}>
        {col.ellipsis ? renderEllipsisCell(params, { cellNode }) : cellNode}
      </td>
    );
  }

  // const { row, rowIndex, dataLength, rowAndColFixedPosition, scrollType, isInit } = props;
  // const hasHolder = scrollType === 'lazy' && !isInit;
  // const rowHeightRef: Ref = inject('rowHeightRef');
  const columnVNodeList = props.columns?.map((col, colIndex) => {
    const cellSpans: RowspanColspan = {};
    const params = {
      row,
      col,
      rowIndex,
      colIndex,
    };
    if (isFunction(props.rowspanAndColspan)) {
      const o = props.rowspanAndColspan(params);
      o?.rowspan > 1 && (cellSpans.rowspan = o.rowspan);
      o?.colspan > 1 && (cellSpans.colspan = o.colspan);
      props.onTrRowspanOrColspan?.(params, cellSpans);
    }
    const skipped = props.skipSpansMap?.get([rowIndex, colIndex].join());
    if (skipped) return null;
    return renderTd(params, {
      dataLength,
      rowAndColFixedPosition,
      columnLength: props.columns.length,
      cellSpans,
    });
  });

  const rowParams = { row, index: rowIndex };
  return (
    <tr
      ref={trRef}
      {...trAttributes}
      style={trStyles?.style}
      className={classnames(classes)}
      onClick={(e) => props.onRowClick?.({ ...rowParams, e })}
      onDoubleClick={(e) => props.onRowDblclick?.({ ...rowParams, e })}
      onMouseDown={(e) => props.onRowMousedown?.({ ...rowParams, e })}
      onMouseEnter={(e) => props.onRowMouseenter?.({ ...rowParams, e })}
      onMouseLeave={(e) => props.onRowMouseleave?.({ ...rowParams, e })}
      onMouseUp={(e) => props.onRowMouseup?.({ ...rowParams, e })}
      onMouseOver={(e) => props.onRowMouseover?.({ ...rowParams, e })}
    >
      {hasLazyLoadHolder
        ? [<td key={rowIndex} style={{ height: `${tRowHeight}px`, border: 'none' }} />]
        : columnVNodeList}
    </tr>
  );
}

TR.displayName = 'TR';
