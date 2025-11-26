import React, { MouseEvent, MutableRefObject, useEffect, useMemo, useRef } from 'react';

import classnames from 'classnames';
import { get } from 'lodash-es';

import Cell from './Cell';
import useClassName from './hooks/useClassName';
import { getRowFixedStyles } from './hooks/useFixed';
import useLazyLoad from './hooks/useLazyLoad';
import { getCellKey, SkipSpansValue } from './hooks/useRowspanAndColspan';

import { formatRowAttributes, formatRowClassNames } from './utils';

import type { TScroll } from '../common';
import type { RowMountedParams, VirtualScrollConfig } from '../hooks/useVirtualScroll';
import type { PaginationProps } from '../pagination';
import type { RowAndColFixedPosition } from './interface';
import type { RowspanColspan, TableRowData, TdBaseTableProps } from './type';

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

export type TrPropsKeys = (typeof TABLE_PROPS)[number];

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
  scroll?: TScroll;
  tableRef?: MutableRefObject<HTMLDivElement>;
  tableContentRef?: MutableRefObject<HTMLDivElement>;
  pagination?: PaginationProps;
  virtualConfig?: VirtualScrollConfig;
  onRowMounted?: (params: RowMountedParams) => void;
}

export const ROW_LISTENERS = ['click', 'dblclick', 'mouseover', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup'];

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
    tableContentRef,
    rowAndColFixedPosition,
    virtualConfig,
    onRowMounted,
  } = props;

  const trRef = useRef<HTMLTableRowElement>(null);

  const classNames = useClassName();

  const trStyles = getRowFixedStyles(
    get(row, rowKey),
    rowIndex,
    dataLength,
    fixedRows,
    rowAndColFixedPosition,
    classNames.tableRowFixedClasses,
    virtualConfig.isVirtualScroll ? virtualConfig.translateY : 0,
  );

  const trAttributes = useMemo(
    () => formatRowAttributes(rowAttributes, { row, rowIndex, type: 'body' }) || {},
    [row, rowAttributes, rowIndex],
  );

  const classes = useMemo(() => {
    const customClasses = formatRowClassNames(rowClassName, { row, rowIndex, rowKey, type: 'body' }, rowKey);
    return [trStyles?.classes, customClasses];
  }, [row, rowClassName, rowIndex, rowKey, trStyles?.classes]);

  const useLazyLoadParams = useMemo(() => ({ ...scroll, rowIndex }), [scroll, rowIndex]);
  const { hasLazyLoadHolder, tRowHeight } = useLazyLoad(tableContentRef.current, trRef, useLazyLoadParams);

  useEffect(() => {
    if (virtualConfig.isVirtualScroll && trRef.current) {
      onRowMounted?.({
        ref: trRef.current,
        data: row,
      });
    }
    // eslint-disable-next-line
  }, [virtualConfig.isVirtualScroll, trRef, row]);

  const columnVNodeList = props.columns?.map((col, colIndex) => {
    const cellSpans: RowspanColspan = {};
    const params = {
      row,
      col,
      rowIndex,
      colIndex,
    };
    let spanState = null;
    if (props.skipSpansMap?.size) {
      const cellKey = getCellKey(row, props.rowKey, col.colKey, colIndex);
      spanState = props.skipSpansMap.get(cellKey) || {};
      spanState?.rowspan > 1 && (cellSpans.rowspan = spanState.rowspan);
      spanState?.colspan > 1 && (cellSpans.colspan = spanState.colspan);
      if (spanState.skipped) return null;
    }
    const onClick = (e: MouseEvent<HTMLTableCellElement>) => {
      const p = { ...params, e };
      if (col.stopPropagation) {
        e.stopPropagation();
      }
      props.onCellClick?.(p);
    };
    return (
      <Cell
        key={params.col.colKey}
        cellParams={params}
        dataLength={dataLength}
        rowAndColFixedPosition={rowAndColFixedPosition}
        columnLength={props.columns.length}
        cellSpans={cellSpans}
        cellEmptyContent={props.cellEmptyContent}
        rowspanAndColspan={props.rowspanAndColspan}
        onClick={onClick}
        tableRef={props.tableRef}
        classPrefix={props.classPrefix}
        overlayClassName={props.ellipsisOverlayClassName}
        pagination={props.pagination}
      />
    );
  });

  const rowParams = { row, index: rowIndex };
  return (
    <tr
      ref={trRef}
      {...trAttributes}
      style={trStyles?.style}
      className={classnames(classes) || undefined}
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
