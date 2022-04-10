import React, { ReactNode, useMemo } from 'react';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import { TdBaseTableProps } from '../type';
import { TableColumns, getThRowspanAndColspan, getThList } from './useMultiHeader';
import useClassName from './useClassName';

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

  const renderTitleWidthIcon = ([title, sortIcon, filterIcon]: ReactNode[]) => {
    const classes = {
      [tableSortClasses.sortable]: !!sortIcon,
      [tableFilterClasses.filterable]: !!filterIcon,
    };
    return (
      <div className={classNames(classes)}>
        <div className={tableSortClasses.title}>
          <div>{title}</div>
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
