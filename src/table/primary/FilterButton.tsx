import React, { useState, useEffect } from 'react';
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
  innerfilterVal?: FilterValue;
  filterIcon?: TElement;
}
type Columns = TdPrimaryTableProps['columns'];

const renderIcon = (classPrefix: string, icon: TElement) => {
  let result: React.ReactNode = null;
  if (icon) result = icon;
  if (typeof icon === 'function') result = icon();
  if (result) {
    result = <span className={`${classPrefix}-table__filter-icon`}>{result}</span>;
  } else {
    result = <TIconFilter className={`${classPrefix}-table__filter-icon`} />;
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

// 处理tilte字段，添加筛选icon
function FilterButton(props: Props) {
  const { onChange, filterIcon, innerfilterVal, columns } = props;
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('table');
  const [filterVal, setfilterVal] = useState<any>();

  const filterColumns = getFilterColumns(columns);

  function getFilterColumns(columns: Columns): Columns {
    return columns.map((column: PrimaryTableCol, index: number) => {
      const { filter, colKey, children } = column;
      if (children && children.length) {
        return {
          ...column,
          children: getFilterColumns(children as Columns),
        };
      }

      if (!filter) {
        return column;
      }
      const lastTitle = getTitle(column, index);
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
                  {getFilterContent(filter, colKey, column)}
                </div>
              }
            >
              {renderIcon(classPrefix, filterIcon)}
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

  function getFilterContent(filter: TableColumnFilter, colKey: string, column: PrimaryTableCol<DataType>) {
    const types = ['single', 'multiple', 'input'];
    if (filter.type && !types.includes(filter.type)) {
      console.error(`column.type must be the following: ${JSON.stringify(types)}`);
      return;
    }

    if (filter.component) {
      const CustomFilter = React.cloneElement(filter.component, {
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
              placeholder={t(locale.filterInputPlaceholder)}
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
    setfilterVal({
      ...filterVal,
      [colKey]: value,
    });
    onChange({ ...filterVal, [colKey]: value }, column);
  }

  // 初始筛选条件变化，更新状态
  useEffect(() => {
    setfilterVal(innerfilterVal);
  }, [innerfilterVal]);

  return filterColumns;
}

export default FilterButton;
