import React, { ReactNode, useMemo } from 'react';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import { BaseTableCol, PrimaryTableCol, TableRowData, TdBaseTableProps } from '../type';
import { TableColumns, getThRowspanAndColspan, getThList } from './useMultiHeader';
import useClassName from './useClassName';
import TEllipsis from '../Ellipsis';

// 渲染表头的通用方法
export function renderTitle(col: TableColumns[0], index: number) {
  const params = { col, colIndex: index };
  if (isFunction(col.title)) {
    return col.title(params);
  }
  if (isFunction(col.render)) {
    return col.render({ ...params, row: {}, rowIndex: -1, type: 'title' });
  }
  return col.title;
}

export interface UseTableHeaderParams {
  columns: TdBaseTableProps['columns'];
}

export default function useTableHeader({ columns }: UseTableHeaderParams) {
  const { tableSortClasses, tableFilterClasses } = useClassName();
  // 一次性获取 colspan 和 rowspan 可以避免其他数据更新导致的重复计算
  const spansAndLeafNodes = useMemo(() => getThRowspanAndColspan(columns), [columns]);
  // 表头二维数据
  const thList = useMemo(() => getThList(columns), [columns]);
  const isMultipleHeader = useMemo(() => thList.length > 1, [thList]);

  const renderTitleWidthIcon = (
    [title, sortIcon, filterIcon]: ReactNode[],
    col: PrimaryTableCol<TableRowData>,
    colIndex: number,
    ellipsisTitle: BaseTableCol['ellipsisTitle'],
    attach: HTMLElement,
    extra?: {
      classPrefix: string;
      ellipsisOverlayClassName: string;
    },
  ) => {
    const classes = {
      [tableSortClasses.sortable]: !!sortIcon,
      [tableFilterClasses.filterable]: !!filterIcon,
    };
    const content = isFunction(ellipsisTitle) ? ellipsisTitle({ col, colIndex }) : undefined;
    const isEllipsis = ellipsisTitle !== undefined ? Boolean(ellipsisTitle) : Boolean(col.ellipsis);
    return (
      <div className={classNames(classes)}>
        <div className={tableSortClasses.title}>
          {isEllipsis ? (
            <TEllipsis
              placement="bottom"
              attach={attach ? () => attach : undefined}
              popupContent={content}
              // @ts-ignore TODO 待类型完善后移除
              tooltipProps={typeof ellipsisTitle === 'object' ? ellipsisTitle : undefined}
              classPrefix={extra?.classPrefix}
              overlayClassName={extra?.ellipsisOverlayClassName}
            >
              {title}
            </TEllipsis>
          ) : (
            <div>{title}</div>
          )}
          {Boolean(sortIcon || filterIcon) && (
            <div className={tableFilterClasses.iconWrap}>
              {sortIcon}
              {filterIcon}
            </div>
          )}
        </div>
      </div>
    );
  };

  return {
    thList,
    isMultipleHeader,
    spansAndLeafNodes,
    renderTitleWidthIcon,
  };
}
