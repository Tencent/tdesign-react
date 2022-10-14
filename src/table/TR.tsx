import React, { useMemo, useRef, MouseEvent } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import classnames from 'classnames';
import { formatClassNames, formatRowAttributes, formatRowClassNames } from './utils';
import { getRowFixedStyles, getColumnFixedStyles } from './hooks/useFixed';
import { RowAndColFixedPosition } from './interface';
import useClassName from './hooks/useClassName';
import TEllipsis from './Ellipsis';
import { BaseTableCellParams, TableRowData, RowspanColspan, TdBaseTableProps, TableScroll } from './type';
import useLazyLoad from './hooks/useLazyLoad';
import { getCellKey, SkipSpansValue } from './hooks/useRowspanAndColspan';

export interface RenderTdExtra {
  rowAndColFixedPosition: RowAndColFixedPosition;
  columnLength: number;
  dataLength: number;
  cellSpans: RowspanColspan;
  cellEmptyContent: TdBaseTableProps['cellEmptyContent'];
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
  'cellEmptyContent',
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
  ellipsisOverlayClassName: string;
  classPrefix: string;
  dataLength?: number;
  rowAndColFixedPosition?: RowAndColFixedPosition;
  skipSpansMap?: Map<string, SkipSpansValue>;
  scrollType?: string;
  isVirtual?: boolean;
  rowHeight?: number;
  trs?: Map<number, object>;
  bufferSize?: number;
  scroll?: TableScroll;
  tableElm?: HTMLDivElement;
  tableContentElm?: HTMLDivElement;
  onRowMounted?: () => void;
}

export const ROW_LISTENERS = ['click', 'dblclick', 'mouseover', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup'];

export function renderCell(
  params: BaseTableCellParams<TableRowData>,
  extra?: {
    cellEmptyContent?: TdBaseTableProps['cellEmptyContent'];
  },
) {
  const { col, row, rowIndex } = params;
  // support serial number column
  if (col.colKey === 'serial-number') {
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
    const { col } = cellParams;
    let content = isFunction(col.ellipsis) ? col.ellipsis(cellParams) : undefined;
    if (typeof col.ellipsis === 'object' && isFunction(col.ellipsis.content)) {
      content = col.ellipsis.content(cellParams);
    }
    let tooltipProps = {};
    if (typeof col.ellipsis === 'object') {
      tooltipProps = 'props' in col.ellipsis ? col.ellipsis.props : col.ellipsis || undefined;
    }
    const tableElement = props.tableElm;
    return (
      <TEllipsis
        placement={'top'}
        attach={tableElement ? () => tableElement : undefined}
        popupContent={content}
        tooltipProps={tooltipProps}
        overlayClassName={props.ellipsisOverlayClassName}
        classPrefix={props.classPrefix}
      >
        {cellNode}
      </TEllipsis>
    );
  }

  function renderTd(params: BaseTableCellParams<TableRowData>, extra: RenderTdExtra) {
    const { col, colIndex, rowIndex } = params;
    const { cellSpans, dataLength, rowAndColFixedPosition } = extra;
    const cellNode = renderCell(params, { cellEmptyContent: props.cellEmptyContent });
    const tdStyles = getColumnFixedStyles(col, colIndex, rowAndColFixedPosition, tableColFixedClasses);
    const customClasses = formatClassNames(col.className, { ...params, type: 'td' });
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
    const normalAttrs = isFunction(col.attrs) ? col.attrs({ ...params, type: 'td' }) : col.attrs;
    const attrs = { ...normalAttrs, rowSpan: cellSpans.rowspan, colSpan: cellSpans.colspan };
    return (
      <td
        key={col.colKey || colIndex}
        className={classnames(classes)}
        style={tdStyles.style}
        {...attrs}
        onClick={onClick}
      >
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
    let spanState = null;
    if (props.skipSpansMap.size) {
      const cellKey = getCellKey(row, props.rowKey, col.colKey, colIndex);
      spanState = props.skipSpansMap.get(cellKey) || {};
      spanState?.rowspan > 1 && (cellSpans.rowspan = spanState.rowspan);
      spanState?.colspan > 1 && (cellSpans.colspan = spanState.colspan);
      if (spanState.skipped) return null;
    }
    return renderTd(params, {
      dataLength,
      rowAndColFixedPosition,
      columnLength: props.columns.length,
      cellSpans,
      cellEmptyContent: props.cellEmptyContent,
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
