import React, { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { FilterIcon as TIconFilter } from 'tdesign-icons-react';
import { Popup } from '../../popup';
import { Radio } from '../../radio';
import { Checkbox } from '../../checkbox';
import { Input } from '../../input';
import { TElement } from '../../common';
import { TableColumnFilter, FilterValue, PrimaryTableCol, DataType, TdPrimaryTableProps } from '../type';
import useConfig from '../../_util/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

interface Props {
  columns?: Array<PrimaryTableCol>;
  onChange?: Function;
  innerFilterVal?: FilterValue;
  filterIcon?: TElement;
}
type Columns = TdPrimaryTableProps['columns'];

const renderIcon = (classPrefix: string, icon: TElement, isActive: Boolean) => {
  let result: React.ReactNode = null;
  if (icon) result = icon;
  if (typeof icon === 'function') result = icon();
  if (result) {
    result = <span className={`${classPrefix}-table__filter-icon`}>{result}</span>;
  } else {
    result = (
      <TIconFilter
        className={`${classPrefix}-table__filter-icon`}
        style={isActive ? { color: 'var(--td-brand-color)' } : {}}
      />
    );
  }
  return result;
};
// 该方法主要用于过滤需要调整表头的时，不支持 render 函数的情况
function getTitle(column: PrimaryTableCol, colIndex: number) {
  let result = null;
  if (isFunction(column.title)) {
    result = column.title({ col: column, colIndex });
  } else if (isString(column.title)) {
    result = column.title;
  }
  return result;
}

// 处理title字段，添加筛选icon
function useFilterButton(props: Props) {
  const { onChange, filterIcon, innerFilterVal, columns } = props;
  const { classPrefix } = useConfig();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [locale, transformLocale] = useLocaleReceiver('table');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const transformLocaleRef = useRef(transformLocale);
  const [filterVal, setFilterVal] = useState<any>();

  const filterColumns = useMemo(() => {
    function getFilterColumns(columns: Columns, filterVal): Columns {
      return columns.map((column: PrimaryTableCol, index: number) => {
        const { filter, colKey, children } = column;
        if (children && children.length) {
          return {
            ...column,
            children: getFilterColumns(children as Columns, filterVal),
          };
        }

        if (!filter) {
          return column;
        }
        const lastTitle = getTitle(column, index);
        const isActive = !!filterVal?.[colKey]?.length;
        const titleNew = () => (
          <div className={`${classPrefix}-table__cell--title`}>
            <div>{lastTitle}</div>
            <div className={classNames([`${classPrefix}-table__cell--filter`])}>
              <Popup
                trigger="click"
                placement="bottom"
                showArrow
                overlayClassName={`${classPrefix}-table__filter-pop`}
                content={
                  <div className={`${classPrefix}-table__filter-pop-content`}>
                    {getFilterContent(filter, colKey, column, filterVal)}
                  </div>
                }
              >
                {renderIcon(classPrefix, filterIcon, isActive)}
              </Popup>
            </div>
          </div>
        );
        return {
          ...column,
          title: titleNew,
        };
      });
    }

    function getFilterContent(filter: TableColumnFilter, colKey: string, column: PrimaryTableCol<DataType>, filterVal) {
      const types = ['single', 'multiple', 'input'];
      if (filter.type && !types.includes(filter.type)) {
        console.error(`column.type must be the following: ${JSON.stringify(types)}`);
        return;
      }

      if (filter.component) {
        const FilterComponent = typeof filter.component === 'function' ? filter.component() : filter.component;
        const CustomFilter = React.cloneElement(FilterComponent, {
          value: filterVal?.[colKey] || '',
          onChange: (value) => {
            onChangeFilter(value, colKey, column);
          },
        });
        return <div className={`${classPrefix}-table__filter-pop-content-inner`}>{CustomFilter}</div>;
      }

      return (
        <div className={`${classPrefix}-table__filter-pop-content-inner`}>
          <>
            {filter.type === 'multiple' ? (
              <Checkbox.Group
                value={filterVal?.[colKey] || []}
                defaultValue={[]}
                onChange={(value) => {
                  onChangeFilter(value, colKey, column);
                }}
              >
                {filter?.list.map(({ label, value }) => (
                  <Checkbox key={value} value={value}>
                    {label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            ) : null}

            {filter.type === 'single' ? (
              <Radio.Group
                size="large"
                value={filterVal?.[colKey] || ''}
                onChange={(value) => {
                  onChangeFilter(value, colKey, column);
                }}
              >
                {filter?.list.map(({ label, value }) => (
                  <Radio key={value} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            ) : null}

            {filter.type === 'input' ? (
              <Input
                clearable
                value={filterVal?.[colKey] || ''}
                onChange={(value) => {
                  onChangeFilter(value, colKey, column);
                }}
              />
            ) : null}
          </>
        </div>
      );
    }

    function onChangeFilter(value: any, colKey: string, column: PrimaryTableCol<DataType>) {
      setFilterVal({
        ...filterVal,
        [colKey]: value,
      });
      onChange({ ...filterVal, [colKey]: value }, column);
    }

    return getFilterColumns(columns, filterVal);
  }, [classPrefix, columns, filterIcon, filterVal, onChange]);

  // 初始筛选条件变化，更新状态
  useEffect(() => {
    setFilterVal(innerFilterVal);
  }, [innerFilterVal]);

  return filterColumns;
}

export default useFilterButton;
