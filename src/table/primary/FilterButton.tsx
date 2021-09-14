import React, { useState, useContext, useEffect } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { Popup } from '../../popup';
import { Radio } from '../../radio';
import { Checkbox } from '../../checkbox';
import { Input } from '../../input';
import { TElement } from '../../_type/common';
import { Filter, FilterValue, PrimaryTableCol, DataType } from '../../_type/components/table';
import { ConfigContext } from '../../config-provider';
import TIconFilter from '../../icon/icons/FilterIcon';

interface Props {
  columns?: Array<PrimaryTableCol>;
  onChange?: Function;
  innerfiltVal?: FilterValue;
  filterIcon?: TElement;
}
const renderIcon = (classPrefix: string, icon: TElement) => {
  let result: React.ReactNode = null;
  if (icon) result = icon;
  if (typeof icon === 'function') result = icon();
  if (result) {
    result = <span className={`${classPrefix}-table-filter-icon`}>{result}</span>;
  } else {
    result = <TIconFilter name="filter" className={`${classPrefix}-table-filter-icon`} />;
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
  const { onChange, filterIcon, innerfiltVal, columns } = props;
  const { classPrefix } = useContext(ConfigContext);
  const [filterVal, setfilterVal] = useState<any>();

  const getFilterContent = (filter: Filter, colKey: string, column: PrimaryTableCol<DataType>) => {
    const types = ['single', 'multiple', 'input'];
    if (filter.type && !types.includes(filter.type)) {
      console.error(`column.type must be the following: ${JSON.stringify(types)}`);
      return;
    }
    return (
      <div className={`${classPrefix}-table-filter-pop-content__inner`}>
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
              placeholder="请输入内容（无默认值）"
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
  };

  function onChangeFilter(value: any, colKey: string, column: PrimaryTableCol<DataType>) {
    setfilterVal({
      ...filterVal,
      [colKey]: value,
    });
    onChange({ ...filterVal, [colKey]: value }, column);
  }

  // 初始筛选条件变化，更新状态
  useEffect(() => {
    setfilterVal(innerfiltVal);
  }, [innerfiltVal]);

  return columns.map((column: PrimaryTableCol, index: number) => {
    const { filter, colKey } = column;
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
            overlayClassName={`${classPrefix}-table-filter-pop`}
            content={
              <div className={`${classPrefix}-table-filter-pop-content`}>
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

export default FilterButton;
