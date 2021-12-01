import { useEffect, useMemo, useState } from 'react';
import { DataType, FilterValue, PrimaryTableCol } from '../type';
import { PrimaryTableProps } from '..';
import filterButton from './FilterButton';

/**
 * 筛选hook
 * 1.返回加入筛选icon后的title
 * 2.返回筛选后的data
 */
function useFilter(props: PrimaryTableProps): [PrimaryTableCol[], DataType[]] {
  const { columns, filterIcon, filterValue, defaultFilterValue, onFilterChange, data } = props;
  const isControlled = typeof filterValue !== 'undefined';
  const [filterVal, setFilterVal] = useState<FilterValue>(defaultFilterValue);

  useEffect(() => {
    setFilterVal(isControlled ? filterValue : defaultFilterValue);
  }, [filterValue, defaultFilterValue, isControlled]);

  // 导出：筛选后的data。受控直接导出，非受控导出筛选数据
  const transformedFilterData = useMemo<DataType[]>(() => {
    if (isControlled) {
      return data;
    }
    if (filterVal) {
      let tmpData: DataType[] = data;
      Object.keys(filterVal).forEach((k) => {
        if (typeof filterVal?.[k] === 'string' || typeof filterVal?.[k] === 'number') {
          tmpData = tmpData.filter((item) => item?.[k]?.toString().includes(filterVal?.[k].toString()));
        }
        if (Array.isArray(filterVal?.[k]) && (filterVal?.[k] as Array<string | number>).length > 0) {
          tmpData = tmpData.filter((item) => (filterVal?.[k] as Array<string | number>).includes(item?.[k]));
        }
      });
      return tmpData;
    }
    return data;
  }, [data, filterVal, isControlled]);

  // 导出：添加筛选图标后的columns
  const transformedFilterColumns = filterButton({
    columns,
    onChange: onChangeFilterButton,
    innerfiltVal: isControlled ? filterValue : defaultFilterValue,
    filterIcon,
  });

  /**
   * 触发筛选按钮，触发onFilterChange回调
   * @param toast
   * @param col
   */
  function onChangeFilterButton(toast, col: PrimaryTableCol) {
    const newFilterVal: FilterValue = {
      ...filterVal,
      ...toast,
    };
    setFilterVal(newFilterVal);
    if (onFilterChange) {
      onFilterChange(newFilterVal, { col });
    }
  }

  return [transformedFilterColumns, transformedFilterData];
}

export default useFilter;
