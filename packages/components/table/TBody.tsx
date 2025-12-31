/* eslint-disable no-underscore-dangle */
import classNames from 'classnames';
import { camelCase, get, pick } from 'lodash-es';
import React, { type CSSProperties, type MutableRefObject, type ReactNode, useMemo } from 'react';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TableClassName } from './hooks/useClassName';
import useRowspanAndColspan from './hooks/useRowspanAndColspan';
import TR, { ROW_LISTENERS, TABLE_PROPS, type TrProps } from './TR';

import type { RowMountedParams, VirtualScrollConfig } from '../hooks/useVirtualScroll';
import type { PaginationProps } from '../pagination';
import type { BaseTableProps, RowAndColFixedPosition } from './interface';
import type { TableRowData, TdBaseTableProps } from './type';

export interface TableBodyProps extends BaseTableProps {
  classPrefix: string;
  ellipsisOverlayClassName: string;
  // 固定列 left/right 具体值
  rowAndColFixedPosition?: RowAndColFixedPosition;
  showColumnShadow?: { left: boolean; right: boolean };
  tableRef?: MutableRefObject<HTMLDivElement>;
  tableContentRef?: MutableRefObject<HTMLDivElement>;
  cellEmptyContent: TdBaseTableProps['cellEmptyContent'];
  tableWidth?: number;
  isWidthOverflow?: boolean;
  virtualConfig: VirtualScrollConfig;
  pagination?: PaginationProps;
  allTableClasses?: TableClassName;
  handleRowMounted?: (params: RowMountedParams) => void;
}

export const ROW_AND_TD_LISTENERS = ROW_LISTENERS.concat('cell-click');

// table 到 body 的相同属性
export const extendTableProps = [
  'rowKey',
  'rowClassName',
  'rowAttributes',
  'loading',
  'empty',
  'fixedRows',
  'firstFullRow',
  'lastFullRow',
  'rowspanAndColspan',
  'scroll',
  'cellEmptyContent',
  'onCellClick',
  'onPageChange',
  'onRowClick',
  'onRowDblclick',
  'onRowMouseover',
  'onRowMousedown',
  'onRowMouseenter',
  'onRowMouseleave',
  'onRowMouseup',
  'onScroll',
  'onScrollX',
  'onScrollY',
];

const trProperties = [
  'classPrefix',
  'ellipsisOverlayClassName',
  'rowAndColFixedPosition',
  'scroll',
  'tableRef',
  'tableContentRef',
  'trs',
  'bufferSize',
  'isVirtual',
  'rowHeight',
  'scrollType',
];

export default function TBody(props: TableBodyProps) {
  // 如果不是变量复用，没必要对每一个参数进行解构（解构过程需要单独的内存空间存储临时变量）
  const { data, columns, rowKey, firstFullRow, lastFullRow, virtualConfig, allTableClasses } = props;

  const { isVirtualScroll } = virtualConfig;
  const renderData = isVirtualScroll ? virtualConfig.visibleData : data;

  const [global, t] = useLocaleReceiver('table');

  const { skipSpansMap } = useRowspanAndColspan(data, columns, rowKey, props.rowspanAndColspan);
  const isSkipSnapsMapNotFinish = Boolean(props.rowspanAndColspan && !skipSpansMap.size);

  const { tableFullRowClasses, tableBaseClass } = allTableClasses;
  const tbodyClasses = useMemo(() => [tableBaseClass.body], [tableBaseClass.body]);
  const hasFullRowConfig = useMemo(() => firstFullRow || lastFullRow, [firstFullRow, lastFullRow]);

  const isEmpty = !data?.length && !props.loading && !hasFullRowConfig;

  const renderEmpty = (columns: TableBodyProps['columns']) => (
    <tr className={classNames([tableBaseClass.emptyRow, { [tableFullRowClasses.base]: props.isWidthOverflow }])}>
      <td colSpan={columns.length}>
        <div
          className={classNames([tableBaseClass.empty, { [tableFullRowClasses.innerFullRow]: props.isWidthOverflow }])}
          style={props.isWidthOverflow ? { width: `${props.tableWidth}px` } : {}}
        >
          {props.empty || t(global.empty)}
        </div>
      </td>
    </tr>
  );

  const renderFullRow = (type: 'first-full-row' | 'last-full-row') => {
    const fullRowNode = {
      'first-full-row': firstFullRow,
      'last-full-row': lastFullRow,
    }[type];
    if (!fullRowNode) return null;

    const rowProps: React.ComponentProps<'tr'> = {};
    if (isVirtualScroll) {
      const fullRowIndex = {
        'first-full-row': 0,
        'last-full-row': data.length - 1,
      }[type];
      const rowVisible = renderData.some((item) => item.__VIRTUAL_SCROLL_INDEX === fullRowIndex);
      if (!rowVisible) return null;
      rowProps.ref = (ref) => {
        if (ref) {
          // 首尾行的高度可能不固定
          props?.handleRowMounted({
            ref,
            data: data[fullRowIndex],
          });
        }
      };
    }

    const isFixedToLeft = props.isWidthOverflow && columns.find((col) => col.fixed === 'left');
    const tType = camelCase(type);
    const classes = [tableFullRowClasses.base, tableFullRowClasses[tType]];

    /** innerFullRow 和 innerFullElement 同时存在，是为了保证固定列时，当前行不随内容进行横向滚动 */
    return (
      <tr key={type} className={classNames(classes)} {...rowProps}>
        <td colSpan={columns.length}>
          <div
            className={classNames({ [tableFullRowClasses.innerFullRow]: isFixedToLeft }) || undefined}
            style={isFixedToLeft ? { width: `${props.tableWidth}px` } : {}}
          >
            <div className={tableFullRowClasses.innerFullElement}>{fullRowNode}</div>
          </div>
        </td>
      </tr>
    );
  };

  const renderExpandedRows = (row: TableRowData, rowIndex: number) => {
    const p = {
      row,
      index: rowIndex,
      columns,
      tableWidth: props.tableWidth,
      isWidthOverflow: props.isWidthOverflow,
    };
    return props.renderExpandedRow?.(p);
  };

  const renderTRNodeList = () => {
    if (isSkipSnapsMapNotFinish) return null;

    const trNodeList: ReactNode[] = [];

    // 首行数据
    const firstFullRowNode = renderFullRow('first-full-row');
    firstFullRowNode && trNodeList.push(firstFullRowNode);

    // body 数据
    renderData?.forEach((row, rowIndex) => {
      if (row.__VIRTUAL_FAKE_DATA) return;

      const getRowIndex = () => {
        const virtualIndex = row.__VIRTUAL_SCROLL_INDEX;
        if (isVirtualScroll && firstFullRow && virtualIndex) {
          // 确保 serial-number 索引不受到首行 FAKE 数据影响
          return virtualIndex - 1;
        }
        return virtualIndex ?? rowIndex;
      };

      const trProps = {
        ...pick(props, TABLE_PROPS),
        rowKey: props.rowKey || 'id',
        row,
        columns,
        rowIndex: getRowIndex(),
        dataLength: data.length,
        skipSpansMap,
        virtualConfig,
        classPrefix: props.classPrefix,
        ellipsisOverlayClassName: props.ellipsisOverlayClassName,
        ...pick(props, trProperties),
        pagination: props.pagination,
      } as TrProps;
      if (props.onCellClick) {
        trProps.onCellClick = props.onCellClick;
      }

      const trNode = (
        <TR key={get(row, props.rowKey || 'id') || rowIndex} {...trProps} onRowMounted={props.handleRowMounted}></TR>
      );
      trNodeList.push(trNode);

      // 展开行数据
      const expandedRowNode = renderExpandedRows(row, rowIndex);
      expandedRowNode && trNodeList.push(expandedRowNode);
    });

    // 尾行数据
    const lastFullRowNode = renderFullRow('last-full-row');
    lastFullRowNode && trNodeList.push(lastFullRowNode);
    return trNodeList;
  };

  // 垫上隐藏的 tr 元素高度
  const translate = `translateY(${virtualConfig.translateY}px)`;
  const posStyle: CSSProperties = isVirtualScroll
    ? ({
        transform: translate,
        msTransform: translate,
        MozTransform: translate,
        WebkitTransform: translate,
      } as CSSProperties)
    : undefined;

  return (
    <tbody className={classNames(tbodyClasses) || undefined} style={{ ...posStyle }}>
      {isEmpty ? renderEmpty(columns) : renderTRNodeList()}
    </tbody>
  );
}

TBody.displayName = 'TBody';
