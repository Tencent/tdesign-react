import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { isFunction } from 'lodash-es';

import TEllipsis from '../Ellipsis';
import useClassName from './useClassName';
import { resolveEllipsis } from '../utils';
import type { BaseTableCol, PrimaryTableCol, TableRowData, TdBaseTableProps } from '../type';

export type TableColumns = TdBaseTableProps['columns'];

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

function getThRowspanAndColspan(columns: TableColumns) {
  // 无多级表头时，不需要计算 span，直接返回空 Map + 原始列作为叶子列
  return {
    rowspanAndColspanMap: new Map(),
    leafColumns: columns,
  };
}

function getThList(columns: TableColumns): Array<TableColumns> {
  // 无多级表头时，只有一行表头
  return [columns];
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

  const renderTitleWidthIcon = (
    [title, sortIcon, filterIcon]: ReactNode[],
    col: PrimaryTableCol<TableRowData>,
    colIndex: number,
    ellipsisTitle: BaseTableCol['ellipsisTitle'],
    attach: HTMLElement,
    extra?: {
      classPrefix: string;
    },
  ) => {
    const classes = {
      [tableSortClasses.sortable]: !!sortIcon,
      [tableFilterClasses.filterable]: !!filterIcon,
    };
    // ellipsisTitle 优先级高于 ellipsis
    const resolved = resolveEllipsis(ellipsisTitle !== undefined ? ellipsisTitle : col.ellipsis, { col, colIndex });
    return (
      <div className={classNames(classes)}>
        <div className={tableSortClasses.title}>
          {resolved.enabled ? (
            <TEllipsis
              attach={attach ? () => attach : undefined}
              popupContent={resolved.content ?? title}
              popupProps={resolved.props}
              classPrefix={extra?.classPrefix}
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
    spansAndLeafNodes,
    renderTitleWidthIcon,
  };
}
