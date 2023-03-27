import React, { useEffect, useState, MutableRefObject } from 'react';
import isFunction from 'lodash/isFunction';
import useClassName from './useClassName';
import TButton from '../../button';
import { TdPrimaryTableProps, PrimaryTableCol, TableRowData, FilterValue } from '../type';
import useControlled from '../../hooks/useControlled';
import TableFilterController from '../FilterController';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

function isFilterValueExist(value: any) {
  const isArrayTrue = value instanceof Array && value.length;
  const isObject = typeof value === 'object' && !(value instanceof Array);
  const isObjectTrue = isObject && Object.keys(value).length;
  return isArrayTrue || isObjectTrue || !['null', '', 'undefined'].includes(String(value));
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

export default function useFilter(props: TdPrimaryTableProps, primaryTableRef: MutableRefObject<any>) {
  const [locale, t] = useLocaleReceiver('table');
  const { tableFilterClasses, isFocusClass } = useClassName();
  const [isTableOverflowHidden, setIsTableOverflowHidden] = useState<boolean>();

  // unControl and control
  const [tFilterValue, setTFilterValue] = useControlled(props, 'filterValue', props.onFilterChange);

  // 过滤内部值
  const [innerFilterValue, setInnerFilterValue] = useState<FilterValue>(tFilterValue);

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
      emitFilterChange(filterValue, column);
    }
  }

  function emitFilterChange(filterValue: FilterValue, column?: PrimaryTableCol) {
    setTFilterValue(filterValue, { col: column });
    props.onChange?.({ filter: filterValue }, { trigger: 'filter' });
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
    emitFilterChange(filterValue, column);
  }

  function onResetAll() {
    emitFilterChange({}, undefined);
  }

  function onConfirm(column: PrimaryTableCol) {
    emitFilterChange(innerFilterValue, column);
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
        onVisibleChange={onPopupVisibleChange}
      ></TableFilterController>
    );
  }

  function onPopupVisibleChange(visible: boolean) {
    if (visible && !isTableOverflowHidden) {
      setIsTableOverflowHidden(!visible);
    }
  }

  return {
    hasEmptyCondition,
    isTableOverflowHidden,
    renderFilterIcon,
    renderFirstFilterRow,
  };
}
