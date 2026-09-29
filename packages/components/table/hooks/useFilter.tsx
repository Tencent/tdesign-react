import React, { useEffect, useState } from 'react';
import { isFunction } from 'lodash-es';
import { getColumnsResetValue } from '@tdesign/common-js/table/utils';

import TButton from '../../button';
import useControlled from '../../hooks/useControlled';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import TableFilterController from '../FilterController';
import useClassName from './useClassName';

import type { FilterPopupOwner } from '../FilterController';
import type { PrimaryTableRef } from '../interface';
import type {
  FilterValue,
  PrimaryTableCol,
  TableFilterChangeContext,
  TableRowData,
  TdPrimaryTableProps,
} from '../type';

function isFilterValueExist(value: any) {
  const isArrayTrue = value instanceof Array && value.length;
  const isObject = typeof value === 'object' && !(value instanceof Array);
  const isObjectTrue = isObject && Object.keys(value || {}).length;
  return isArrayTrue || isObjectTrue || ![null, '', undefined].includes(value);
}

// 筛选条件不为空，才需要显示筛选结果行
function filterEmptyData(data: FilterValue) {
  const newFilterValue: FilterValue = {};
  Object.keys(data).forEach((key) => {
    const item = data[key];
    if (isFilterValueExist(item)) {
      newFilterValue[key] = item;
    }
  });
  return newFilterValue;
}

export default function useFilter(
  props: TdPrimaryTableProps,
  primaryTableRef: React.MutableRefObject<PrimaryTableRef>,
) {
  const { columns } = props;
  const [locale, t] = useLocaleReceiver('table');
  const { tableFilterClasses, isFocusClass } = useClassName();
  const [isTableOverflowHidden, setIsTableOverflowHidden] = useState<boolean>();

  // unControl and control
  const [tFilterValue, setTFilterValue] = useControlled(props, 'filterValue', props.onFilterChange);

  // 过滤内部值
  const [innerFilterValue, setInnerFilterValue] = useState<FilterValue>(tFilterValue);
  const [popupVisibilities, setPopupVisibilities] = useState<Record<string, boolean>>({});
  // 表头吸顶和虚拟滚动会额外渲染一份表头，同一列存在两个筛选控制器。
  // 记录浮层由哪一份表头持有，保证同一时刻同一列只存在一个浮层实例
  const [popupOwners, setPopupOwners] = useState<Record<string, FilterPopupOwner>>({});

  // 表头吸顶时，吸顶表头常驻且是用户实际点击的那一份，浮层交由它持有，滚动吸顶后浮层定位才正确。
  // 仅虚拟滚动时，吸顶表头会在过滤后数据量跨越 scroll.threshold 时被销毁，
  // 浮层改由常规表头持有（其为 sticky 定位，位置与吸顶表头重合），
  // 避免筛选过程中浮层连同自定义筛选组件的内部状态一起被销毁
  const defaultPopupOwner: FilterPopupOwner = props.headerAffixedTop ? 'affixed' : 'default';

  const hasEmptyCondition = (() => {
    const filterEmpty = filterEmptyData(tFilterValue || {});
    return !tFilterValue || !Object.keys(filterEmpty).length;
  })();

  useEffect(() => {
    setInnerFilterValue(tFilterValue);
  }, [tFilterValue]);

  function renderFirstFilterRow() {
    if (hasEmptyCondition) return null;
    const defaultNode = (
      <div className={tableFilterClasses.result}>
        <span>
          {/* 搜索 “{getFilterResultContent()}”， */}
          {/* 找到 {props.pagination?.total || props.data?.length} 条结果 */}
          {t(locale.searchResultText, {
            result: getFilterResultContent(),
            count: props.pagination?.total || props.data?.length,
          })}
        </span>
        <TButton theme="primary" variant="text" onClick={onResetAll}>
          {locale.clearFilterResultButtonText}
        </TButton>
      </div>
    );
    const filterContent = isFunction(props.filterRow) ? props.filterRow() : props.filterRow;
    if (filterContent === null) return null;
    const r = filterContent || defaultNode;
    if (!r) return null;
    return <div className={tableFilterClasses.inner}>{r}</div>;
  }

  // 获取搜索条件内容，存在 options 需要获取其 label 显示
  function getFilterResultContent(): string {
    const arr: string[] = [];
    props.columns
      .filter((col) => col.filter)
      .forEach((col) => {
        let value = tFilterValue[col.colKey];
        if (col.filter.list && !['null', '', 'undefined'].includes(String(value))) {
          const formattedValue = value instanceof Array ? value : [value];
          const label: string[] = [];
          col.filter.list.forEach((option) => {
            if (formattedValue.includes(option.value)) {
              label.push(option.label);
            }
          });
          value = label.join();
        }
        if (isFilterValueExist(value)) {
          arr.push(`${col.title}：${value}`);
        }
      });
    return arr.join('；');
  }

  function onInnerFilterChange(val: any, column: PrimaryTableCol) {
    const filterValue = {
      ...innerFilterValue,
      [column.colKey]: val,
    };
    setInnerFilterValue(filterValue);
    if (!column.filter.showConfirmAndReset) {
      emitFilterChange(filterValue, 'filter-change', column);
    }
  }

  function emitFilterChange(
    filterValue: FilterValue,
    trigger: TableFilterChangeContext<TableRowData>['trigger'],
    column?: PrimaryTableCol,
  ) {
    setTFilterValue(filterValue, { col: column, trigger });
    props.onChange?.({ filter: filterValue }, { trigger: 'filter' });
    // 重置表格滚动位置
    requestAnimationFrame(() => {
      primaryTableRef.current?.scrollToElement({
        index: -1,
      });
    });
  }

  function onReset(column: PrimaryTableCol) {
    const filterValue: FilterValue = {
      ...tFilterValue,
      [column.colKey]:
        {
          single: '',
          multiple: [],
          input: '',
        }[column.filter.type] ||
        column.filter.resetValue ||
        '',
    };
    emitFilterChange(filterValue, 'reset', column);
  }

  function onResetAll() {
    const resetValue: { [key: string]: any } = getColumnsResetValue(columns);
    emitFilterChange(resetValue, 'clear', undefined);
  }

  function onConfirm(column: PrimaryTableCol) {
    emitFilterChange(innerFilterValue, 'confirm', column);
  }

  function onPopupVisibleChange(visible: boolean, colKey: string, from: FilterPopupOwner = 'default') {
    setPopupVisibilities((prev) => ({
      ...prev,
      [colKey]: visible,
    }));
    if (visible) {
      const owner = from === 'affixed' && !props.headerAffixedTop ? 'default' : from;
      setPopupOwners((prev) => (prev[colKey] === owner ? prev : { ...prev, [colKey]: owner }));
    }
    if (visible && !isTableOverflowHidden) {
      setIsTableOverflowHidden(visible);
    }
  }

  // 图标：内置图标，组件自定义图标，全局配置图标
  function renderFilterIcon({ col, colIndex }: { col: PrimaryTableCol<TableRowData>; colIndex: number }) {
    return (
      <TableFilterController
        column={col}
        colIndex={colIndex}
        // @ts-ignore TODO 待类型完善后移除
        filterIcon={props.filterIcon}
        tFilterValue={tFilterValue}
        innerFilterValue={innerFilterValue}
        tableFilterClasses={tableFilterClasses}
        isFocusClass={isFocusClass}
        popupProps={col.filter.popupProps}
        onReset={onReset}
        onConfirm={onConfirm}
        onInnerFilterChange={onInnerFilterChange}
        primaryTableElement={primaryTableRef?.current?.tableElement}
        visible={popupVisibilities[col.colKey]}
        popupOwner={popupOwners[col.colKey] || defaultPopupOwner}
        onVisibleChange={onPopupVisibleChange}
      ></TableFilterController>
    );
  }

  return {
    hasEmptyCondition,
    isTableOverflowHidden,
    renderFilterIcon,
    renderFirstFilterRow,
  };
}
