import React, { useMemo } from 'react';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import pick from 'lodash/pick';
import classNames from 'classnames';
import TR, { ROW_LISTENERS, TABLE_PROPS } from './TR';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import useClassName from './hooks/useClassName';
import useRowspanAndColspan from './hooks/useRowspanAndColspan';
import { BaseTableProps, RowAndColFixedPosition } from './interface';
import { TdBaseTableProps } from './type';

export const ROW_AND_TD_LISTENERS = ROW_LISTENERS.concat('cell-click');
export interface TableBodyProps extends BaseTableProps {
  classPrefix: string;
  ellipsisOverlayClassName: string;
  // 固定列 left/right 具体值
  rowAndColFixedPosition?: RowAndColFixedPosition;
  showColumnShadow?: { left: boolean; right: boolean };
  tableElm?: HTMLDivElement;
  tableContentElm?: HTMLDivElement;
  cellEmptyContent: TdBaseTableProps['cellEmptyContent'];
  tableWidth?: number;
  isWidthOverflow?: boolean;

  // 以下内容为虚拟滚动所需参数
  translateY?: number;
  scrollType?: string;
  isVirtual?: boolean;
  rowHeight?: number;
  trs?: Map<number, object>;
  bufferSize?: number;
  handleRowMounted?: () => void;
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
  const { data, columns, rowKey, firstFullRow, lastFullRow } = props;
  const [global, t] = useLocaleReceiver('table');
  const { tableFullRowClasses, tableBaseClass } = useClassName();
  const { skipSpansMap } = useRowspanAndColspan(data, columns, rowKey, props.rowspanAndColspan);

  const tbodyClasses = useMemo(() => [tableBaseClass.body], [tableBaseClass.body]);
  const hasFullRowConfig = useMemo(() => firstFullRow || lastFullRow, [firstFullRow, lastFullRow]);

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
            style={isFixedToLeft ? { width: `${props.tableWidth}px` } : {}}
          >
            <div className={tableFullRowClasses.innerFullElement}>{fullRowNode}</div>
          </div>
        </td>
      </tr>
    );
  };

  const columnLength = columns.length;
  const dataLength = data.length;
  const trNodeList = [];

  const properties = [
    'classPrefix',
    'ellipsisOverlayClassName',
    'rowAndColFixedPosition',
    'scroll',
    'tableElm',
    'tableContentElm',
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
      rowIndex,
      dataLength,
      skipSpansMap,
      classPrefix: props.classPrefix,
      ellipsisOverlayClassName: props.ellipsisOverlayClassName,
      ...pick(props, properties),
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
        tableWidth: props.tableWidth,
        isWidthOverflow: props.isWidthOverflow,
      };
      const expandedContent = props.renderExpandedRow(p);
      expandedContent && trNodeList.push(expandedContent);
    }
  });

  const list = (
    <>
      {getFullRow(columnLength, 'first-full-row')}
      {trNodeList}
      {getFullRow(columnLength, 'last-full-row')}
    </>
  );
  const isEmpty = !data?.length && !props.loading && !hasFullRowConfig;

  const translate = `translate(0, ${props.translateY}px)`;
  const posStyle = {
    transform: translate,
    '-ms-transform': translate,
    '-moz-transform': translate,
    '-webkit-transform': translate,
  };

  return (
    <tbody className={classNames(tbodyClasses)} style={props.isVirtual && { ...posStyle }}>
      {isEmpty ? renderEmpty(columns) : list}
    </tbody>
  );
}

TBody.displayName = 'TBody';
