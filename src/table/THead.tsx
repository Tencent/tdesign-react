import React, { useRef, MutableRefObject, CSSProperties, useMemo } from 'react';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import { getColumnFixedStyles } from './hooks/useFixed';
import { RowAndColFixedPosition } from './interface';
import { TableColumns, ThRowspanAndColspan } from './hooks/useMultiHeader';
import useClassName from './hooks/useClassName';
import { BaseTableCol, TableRowData, TdBaseTableProps } from './type';
import { renderTitle } from './hooks/useTableHeader';
import TEllipsis from './Ellipsis';
import { formatClassNames } from './utils';

export interface TheadProps {
  classPrefix: string;
  ellipsisOverlayClassName: string;
  // 是否固定表头
  isFixedHeader: boolean;
  maxHeight?: TdBaseTableProps['maxHeight'];
  height?: TdBaseTableProps['height'];
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
  const { columnResizeParams, classPrefix } = props;
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const classnames = useClassName();
  const { tableHeaderClasses, tableBaseClass } = classnames;
  const theadClasses = [
    tableHeaderClasses.header,
    {
      [tableHeaderClasses.fixed]: Boolean(props.maxHeight || props.height),
      [tableBaseClass.bordered]: props.bordered && props.isMultipleHeader,
      [tableHeaderClasses.multipleHeader]: props.isMultipleHeader,
    },
  ];

  // 单行表格合并
  const colspanSkipMap = useMemo(() => {
    const map: { [key: string]: boolean } = {};
    const list = props.thList[0];
    for (let i = 0, len = list.length; i < len; i++) {
      const item = list[i];
      if (item.colspan > 1) {
        for (let j = i + 1; j < i + item.colspan; j++) {
          if (list[j]) {
            map[list[j].colKey] = true;
          }
        }
      }
    }
    return map;
  }, [props.thList]);

  const getTableNode = (thead: HTMLElement) => {
    let parent = thead;
    while (parent) {
      parent = parent.parentNode as HTMLElement;
      if (parent?.classList?.contains(`${props.classPrefix}-table`)) {
        break;
      }
    }
    return parent;
  };

  const renderThNodeList = (rowAndColFixedPosition: RowAndColFixedPosition, thWidthList: TheadProps['thWidthList']) => {
    // thBorderMap: rowspan 会影响 tr > th 是否为第一列表头，从而影响边框
    const thBorderMap = new Map<any, boolean>();
    const thRowspanAndColspan = props.spansAndLeafNodes.rowspanAndColspanMap;
    return props.thList.map((row, rowIndex) => {
      const thRow = row.map((col: TableColumns[0], index: number) => {
        // 因合并单行表头，跳过
        if (colspanSkipMap[col.colKey]) return null;
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
        const customClasses = formatClassNames(col.className, { ...colParams, type: 'th' });
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
        const isEllipsis = col.ellipsisTitle !== undefined ? Boolean(col.ellipsisTitle) : Boolean(col.ellipsis);
        const attrs = (isFunction(col.attrs) ? col.attrs({ ...colParams, type: 'th' }) : col.attrs) || {};
        if (col.colspan > 1) {
          attrs.colSpan = col.colspan;
        }
        return (
          <th
            key={col.colKey}
            data-colkey={col.colKey}
            className={classNames(thClasses)}
            style={styles}
            {...{ rowSpan: rowspanAndColspan.rowspan, colSpan: rowspanAndColspan.colspan }}
            {...attrs}
            {...resizeColumnListener}
          >
            <div className={tableBaseClass.thCellInner}>
              {isEllipsis ? (
                <TEllipsis
                  placement="bottom"
                  attach={theadRef.current ? () => getTableNode(theadRef.current) : undefined}
                  popupContent={content}
                  // @ts-ignore TODO 待类型完善后移除
                  tooltipProps={typeof col.ellipsisTitle === 'object' ? col.ellipsisTitle : undefined}
                  overlayClassName={props.ellipsisOverlayClassName}
                  classPrefix={props.classPrefix}
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
