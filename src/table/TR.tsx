import React, { useMemo, useRef, MouseEvent, useEffect } from 'react';
import get from 'lodash/get';
import classnames from 'classnames';
import { formatRowAttributes, formatRowClassNames } from './utils';
import { getRowFixedStyles } from './hooks/useFixed';
import { RowAndColFixedPosition } from './interface';
import useClassName from './hooks/useClassName';
import { TableRowData, RowspanColspan, TdBaseTableProps } from './type';
import useLazyLoad from './hooks/useLazyLoad';
import { getCellKey, SkipSpansValue } from './hooks/useRowspanAndColspan';
import Cell from './Cell';
import { PaginationProps } from '../pagination';
import { VirtualScrollConfig } from '../hooks/useVirtualScroll';
import { InfinityScroll } from '../common';

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
  scroll?: InfinityScroll;
  tableElm?: HTMLDivElement;
  tableContentElm?: HTMLDivElement;
  pagination?: PaginationProps;
  virtualConfig?: VirtualScrollConfig;
  onRowMounted?: (data: any) => void;
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
    tableContentElm,
    rowAndColFixedPosition,
    virtualConfig,
    onRowMounted,
  } = props;

  const trRef = useRef<HTMLTableRowElement>();

  const classNames = useClassName();

  const trStyles = getRowFixedStyles(
    get(row, rowKey || 'id'),
    rowIndex,
    dataLength,
    fixedRows,
    rowAndColFixedPosition,
    classNames.tableRowFixedClasses,
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
  const { hasLazyLoadHolder, tRowHeight } = useLazyLoad(tableContentElm, trRef, useLazyLoadParams);

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
    if (props.skipSpansMap.size) {
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
        tableClassNames={classNames}
        rowspanAndColspan={props.rowspanAndColspan}
        onClick={onClick}
        tableElm={props.tableElm}
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
