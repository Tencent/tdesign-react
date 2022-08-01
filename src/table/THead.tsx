import React, { useRef, MutableRefObject, CSSProperties } from 'react';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import { getColumnFixedStyles } from './hooks/useFixed';
import { RowAndColFixedPosition } from './interface';
import { TableColumns, ThRowspanAndColspan } from './hooks/useMultiHeader';
import useClassName from './hooks/useClassName';
import useConfig from '../hooks/useConfig';
import { BaseTableCol, TableRowData } from './type';
import { renderTitle } from './hooks/useTableHeader';
import TEllipsis from './Ellipsis';

export interface TheadProps {
  // 是否固定表头
  isFixedHeader: boolean;
  // 固定列 left/right 具体值
  rowAndColFixedPosition: RowAndColFixedPosition;
  // 虚拟滚动单独渲染表头；表头吸顶单独渲染表头
  thWidthList?: { [colKey: string]: number };
  bordered: boolean;
  isMultipleHeader: boolean;
  spansAndLeafNodes: {
    rowspanAndColspanMap: ThRowspanAndColspan;
    leafColumns: BaseTableCol<TableRowData>[];
  };
  thList: BaseTableCol<TableRowData>[][];
  resizable?: boolean;
  columnResizeParams?: {
    resizeLineRef: MutableRefObject<HTMLDivElement>;
    resizeLineStyle: CSSProperties;
    onColumnMouseover: (e: MouseEvent, col: BaseTableCol<TableRowData>) => void;
    onColumnMousedown: (e: MouseEvent, col: BaseTableCol<TableRowData>) => void;
  };
}

export default function THead(props: TheadProps) {
  const { columnResizeParams } = props;
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const classnames = useClassName();
  const { tableHeaderClasses, tableBaseClass } = classnames;
  const { classPrefix } = useConfig();
  const theadClasses = [
    tableHeaderClasses.header,
    {
      [tableHeaderClasses.fixed]: props.isFixedHeader,
      [tableBaseClass.bordered]: props.bordered && props.isMultipleHeader,
      [tableHeaderClasses.multipleHeader]: props.isMultipleHeader,
    },
  ];

  const renderThNodeList = (rowAndColFixedPosition: RowAndColFixedPosition, thWidthList: TheadProps['thWidthList']) => {
    // thBorderMap: rowspan 会影响 tr > th 是否为第一列表头，从而影响边框
    const thBorderMap = new Map<any, boolean>();
    const thRowspanAndColspan = props.spansAndLeafNodes.rowspanAndColspanMap;
    return props.thList.map((row, rowIndex) => {
      const thRow = row.map((col: TableColumns[0], index: number) => {
        const rowspanAndColspan = thRowspanAndColspan.get(col);
        if (index === 0 && rowspanAndColspan.rowspan > 1) {
          for (let j = rowIndex + 1; j < rowIndex + rowspanAndColspan.rowspan; j++) {
            thBorderMap.set(props.thList[j][0], true);
          }
        }
        const thStyles = getColumnFixedStyles(col, index, rowAndColFixedPosition, classnames.tableColFixedClasses);
        const colParams = {
          col,
          colIndex: index,
          row: {},
          rowIndex: -1,
        };
        const customClasses = isFunction(col.className) ? col.className({ ...colParams, type: 'th' }) : col.className;
        const thClasses = [
          thStyles.classes,
          customClasses,
          {
            // 受 rowspan 影响，部分 tr > th:first-child 需要补足左边框
            [tableHeaderClasses.thBordered]: thBorderMap.get(col),
            [`${classPrefix}-table__th-${col.colKey}`]: col.colKey,
            [classnames.tdAlignClasses[col.align]]: col.align && col.align !== 'left',
          },
        ];
        const withoutChildren = !col.children?.length;
        const width = withoutChildren && thWidthList?.[col.colKey] ? `${thWidthList?.[col.colKey]}px` : undefined;
        const styles = { ...(thStyles.style || {}), width };
        const innerTh = renderTitle(col, index);
        if (!col.colKey) return null;
        const resizeColumnListener = props.resizable
          ? {
              onMouseDown: (e) => columnResizeParams?.onColumnMousedown?.(e, col),
              onMouseMove: (e) => columnResizeParams?.onColumnMouseover?.(e, col),
            }
          : {};
        const content = isFunction(col.ellipsisTitle) ? col.ellipsisTitle({ col, colIndex: index }) : undefined;
        return (
          <th
            key={col.colKey}
            data-colkey={col.colKey}
            className={classNames(thClasses)}
            style={styles}
            {...{ rowSpan: rowspanAndColspan.rowspan, colSpan: rowspanAndColspan.colspan }}
            {...resizeColumnListener}
          >
            <div className={tableBaseClass.thCellInner}>
              {col.ellipsis && col.ellipsisTitle !== false && col.ellipsisTitle !== null ? (
                <TEllipsis
                  placement="bottom"
                  attach={theadRef.current ? () => theadRef.current.parentNode.parentNode as HTMLElement : undefined}
                  popupContent={content}
                  popupProps={typeof col.ellipsisTitle === 'object' ? col.ellipsisTitle : undefined}
                >
                  {innerTh}
                </TEllipsis>
              ) : (
                innerTh
              )}
            </div>
          </th>
        );
      });
      return <tr key={rowIndex}>{thRow}</tr>;
    });
  };

  return (
    <thead ref={theadRef} className={classNames(theadClasses)}>
      {renderThNodeList(props.rowAndColFixedPosition, props.thWidthList)}
    </thead>
  );
}
