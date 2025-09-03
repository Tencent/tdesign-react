/* eslint-disable no-underscore-dangle */
import React, { CSSProperties, MutableRefObject, ReactNode, useMemo } from 'react';

import classNames from 'classnames';
import { camelCase, get, pick } from 'lodash-es';

import { useLocaleReceiver } from '../locale/LocalReceiver';
import { PaginationProps } from '../pagination';
import { TableClassName } from './hooks/useClassName';
import useRowspanAndColspan from './hooks/useRowspanAndColspan';
import TR, { ROW_LISTENERS, TABLE_PROPS, type TrProps } from './TR';

import type { RowMountedParams, VirtualScrollConfig } from '../hooks/useVirtualScroll';
import type { BaseTableProps, RowAndColFixedPosition } from './interface';
import type { TdBaseTableProps } from './type';

export const ROW_AND_TD_LISTENERS = ROW_LISTENERS.concat('cell-click');
export interface TableBodyProps extends BaseTableProps {
  classPrefix: string;
  ellipsisOverlayClassName: string;
  // 固定列 left/right 具体值
  rowAndColFixedPosition?: RowAndColFixedPosition;
  showColumnShadow?: { left: boolean; right: boolean };
  tableRef?: MutableRefObject<HTMLDivElement>;
  tableContentRef?: MutableRefObject<HTMLDivElement>;
  cellEmptyContent: TdBaseTableProps['cellEmptyContent'];
  tableWidth?: MutableRefObject<number>;
  isWidthOverflow?: boolean;
  virtualConfig: VirtualScrollConfig;
  pagination?: PaginationProps;
  allTableClasses?: TableClassName;
  handleRowMounted?: (params: RowMountedParams) => void;
}

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

export default function TBody(props: TableBodyProps) {
  // 如果不是变量复用，没必要对每一个参数进行解构（解构过程需要单独的内存空间存储临时变量）
  const { data, columns, rowKey, firstFullRow, lastFullRow, virtualConfig, allTableClasses } = props;
  const { isVirtualScroll } = virtualConfig;
  const { tableFullRowClasses, tableBaseClass } = allTableClasses;
  const columnLength = columns.length;

  const [global, t] = useLocaleReceiver('table');

  const { skipSpansMap } = useRowspanAndColspan(data, columns, rowKey, props.rowspanAndColspan);
  const isSkipSnapsMapNotFinish = Boolean(props.rowspanAndColspan && !skipSpansMap.size);

  const tbodyClasses = useMemo(() => [tableBaseClass.body], [tableBaseClass.body]);
  const hasFullRowConfig = useMemo(() => firstFullRow || lastFullRow, [firstFullRow, lastFullRow]);

  const renderEmpty = (columns: TableBodyProps['columns']) => (
    <tr className={classNames([tableBaseClass.emptyRow, { [tableFullRowClasses.base]: props.isWidthOverflow }])}>
      <td colSpan={columns.length}>
        <div
          className={classNames([tableBaseClass.empty, { [tableFullRowClasses.innerFullRow]: props.isWidthOverflow }])}
          style={props.isWidthOverflow ? { width: `${props.tableWidth.current}px` } : {}}
        >
          {props.empty || t(global.empty)}
        </div>
      </td>
    </tr>
  );

  const getFullRow = (columnLength: number, type: 'first-full-row' | 'last-full-row', virtualIndex?: number) => {
    const tType = camelCase(type);
    const fullRowNode = {
      'first-full-row': firstFullRow,
      'last-full-row': lastFullRow,
    }[type];

    if (!fullRowNode) return null;
    const isFixedToLeft = props.isWidthOverflow && columns.find((col) => col.fixed === 'left');
    const classes = [tableFullRowClasses.base, tableFullRowClasses[tType]];

    const rowProps: React.ComponentProps<'tr'> = {};
    let rowKey: string | undefined;
    if (isVirtualScroll && virtualIndex !== undefined) {
      rowProps.ref = (ref) => {
        if (ref) {
          props?.handleRowMounted({
            ref,
            data: {
              __VIRTUAL_SCROLL_INDEX: virtualIndex,
              [`__VIRTUAL_${type.toUpperCase().replace('-', '_')}__`]: true,
            },
          });
        }
      };
      // React 不允许通过 spread 操作符传递 key 属性，需要单独处理
      rowKey = `${type}-${virtualIndex}`;
    }

    /** innerFullRow 和 innerFullElement 同时存在，是为了保证固定列时，当前行不随内容进行横向滚动 */
    return (
      <tr key={rowKey} className={classNames(classes)} {...rowProps}>
        <td colSpan={columnLength}>
          <div
            className={classNames({ [tableFullRowClasses.innerFullRow]: isFixedToLeft }) || undefined}
            style={isFixedToLeft ? { width: `${props.tableWidth.current}px` } : {}}
          >
            <div className={tableFullRowClasses.innerFullElement}>{fullRowNode}</div>
          </div>
        </td>
      </tr>
    );
  };

  const getTRNodeList = () => {
    if (isSkipSnapsMapNotFinish) return null;
    const trNodeList: ReactNode[] = [];
    const properties = [
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

    const renderData = isVirtualScroll ? virtualConfig.visibleData : data;

    if (!isVirtualScroll && firstFullRow) {
      const firstFullRowNode = getFullRow(columnLength, 'first-full-row');
      trNodeList.push(firstFullRowNode);
    } else if (firstFullRow && renderData?.[0]?.__VIRTUAL_FIRST_FULL_ROW__) {
      const firstFullRowNode = getFullRow(columnLength, 'first-full-row', renderData[0]?.__VIRTUAL_SCROLL_INDEX);
      trNodeList.push(firstFullRowNode);
    }

    renderData?.forEach((row, rowIndex) => {
      if (row.__VIRTUAL_FIRST_FULL_ROW__ || row.__VIRTUAL_LAST_FULL_ROW__) return;

      const getRowIndex = () => {
        const virtualIndex = row.__VIRTUAL_SCROLL_INDEX;
        if (isVirtualScroll && firstFullRow && virtualIndex) {
          // 确保 serial-number 索引不受到虚拟的 __VIRTUAL_FIRST_FULL_ROW__ 数据影响
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
        ...pick(props, properties),
        pagination: props.pagination,
      } as TrProps;
      if (props.onCellClick) {
        trProps.onCellClick = props.onCellClick;
      }

      const trNode = (
        <TR key={get(row, props.rowKey || 'id') || rowIndex} {...trProps} onRowMounted={props.handleRowMounted}></TR>
      );
      trNodeList.push(trNode);

      // 执行展开行渲染
      if (props.renderExpandedRow) {
        const p = {
          row,
          index: rowIndex,
          columns,
          tableWidth: props.tableWidth.current,
          isWidthOverflow: props.isWidthOverflow,
        };
        const expandedContent = props.renderExpandedRow(p);
        expandedContent && trNodeList.push(expandedContent);
      }
    });

    console.log('renderData', isVirtualScroll, renderData);
    if (!isVirtualScroll && lastFullRow) {
      const lastFullRowNode = getFullRow(columnLength, 'last-full-row');
      trNodeList.push(lastFullRowNode);
    } else if (isVirtualScroll && lastFullRow) {
      // 在虚拟滚动模式下，检查是否有 lastFullRow 的虚拟数据在当前可视区域内
      const lastFullRowData = renderData?.find((row) => row.__VIRTUAL_LAST_FULL_ROW__);
      if (lastFullRowData) {
        console.log('render last full row');
        const lastFullRowNode = getFullRow(columnLength, 'last-full-row', lastFullRowData.__VIRTUAL_SCROLL_INDEX);
        trNodeList.push(lastFullRowNode);
      }
    }

    return trNodeList;
  };

  const isEmpty = !data?.length && !props.loading && !hasFullRowConfig;

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
      {isEmpty ? renderEmpty(columns) : getTRNodeList()}
    </tbody>
  );
}

TBody.displayName = 'TBody';
