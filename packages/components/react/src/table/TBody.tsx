import React, { CSSProperties, MutableRefObject, ReactNode, useMemo } from 'react';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import pick from 'lodash/pick';
import classNames from 'classnames';
import TR, { ROW_LISTENERS, TABLE_PROPS } from './TR';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TableClassName } from './hooks/useClassName';
import useRowspanAndColspan from './hooks/useRowspanAndColspan';
import { BaseTableProps, RowAndColFixedPosition } from './interface';
import { TdBaseTableProps } from './type';
import { PaginationProps } from '../pagination';
import { VirtualScrollConfig } from '../hooks/useVirtualScroll';

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
  handleRowMounted?: (rowData: any) => void;
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
  const [global, t] = useLocaleReceiver('table');
  const { tableFullRowClasses, tableBaseClass } = allTableClasses;
  const { skipSpansMap } = useRowspanAndColspan(data, columns, rowKey, props.rowspanAndColspan);
  const columnLength = columns.length;
  const dataLength = data?.length;

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

  const getFullRow = (columnLength: number, type: 'first-full-row' | 'last-full-row') => {
    const tType = camelCase(type);
    const fullRowNode = {
      'first-full-row': firstFullRow,
      'last-full-row': lastFullRow,
    }[type];

    if (!fullRowNode) return null;
    const isFixedToLeft = props.isWidthOverflow && columns.find((col) => col.fixed === 'left');
    const classes = [tableFullRowClasses.base, tableFullRowClasses[tType]];
    /** innerFullRow 和 innerFullElement 同时存在，是为了保证 固定列时，当前行不随内容进行横向滚动 */
    return (
      <tr className={classNames(classes)}>
        <td colSpan={columnLength}>
          <div
            className={classNames({ [tableFullRowClasses.innerFullRow]: isFixedToLeft })}
            style={isFixedToLeft ? { width: `${props.tableWidth.current}px` } : {}}
          >
            <div className={tableFullRowClasses.innerFullElement}>{fullRowNode}</div>
          </div>
        </td>
      </tr>
    );
  };

  const firstFullRowNode = useMemo(
    () => getFullRow(columnLength, 'first-full-row'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [firstFullRow, columnLength, getFullRow],
  );

  const lastFullRowNode = useMemo(
    () => getFullRow(columnLength, 'last-full-row'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastFullRow, columnLength, getFullRow],
  );

  const isSkipSnapsMapNotFinish = Boolean(props.rowspanAndColspan && !skipSpansMap.size);

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
    data?.forEach((row, rowIndex) => {
      const trProps = {
        ...pick(props, TABLE_PROPS),
        rowKey: props.rowKey || 'id',
        row,
        columns,
        // eslint-disable-next-line
        rowIndex: row.__VIRTUAL_SCROLL_INDEX || rowIndex,
        dataLength,
        skipSpansMap,
        virtualConfig,
        classPrefix: props.classPrefix,
        ellipsisOverlayClassName: props.ellipsisOverlayClassName,
        ...pick(props, properties),
        pagination: props.pagination,
      };
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
    return trNodeList;
  };

  const isEmpty = !data?.length && !props.loading && !hasFullRowConfig;

  // 垫上隐藏的 tr 元素高度
  const translate = `translateY(${virtualConfig.translateY}px)`;
  const posStyle: CSSProperties = virtualConfig.isVirtualScroll
    ? ({
        transform: translate,
        msTransform: translate,
        MozTransform: translate,
        WebkitTransform: translate,
      } as CSSProperties)
    : undefined;

  const list = (
    <>
      {firstFullRowNode}
      {getTRNodeList()}
      {lastFullRowNode}
    </>
  );

  return (
    <tbody className={classNames(tbodyClasses)} style={{ ...posStyle }}>
      {isEmpty ? renderEmpty(columns) : list}
    </tbody>
  );
}

TBody.displayName = 'TBody';
