import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataType, FilterValue, PrimaryTableCol } from '../type';
import { InnerPrimaryTableProps } from './Table';
import useFilterButton from './useFilterButton';

/**
 * 筛选hook
 * 1.返回加入筛选icon后的title
 * 2.返回筛选后的data
 */
function useFilter(props: InnerPrimaryTableProps): [PrimaryTableCol[], DataType[]] {
  const {
    columns,
    filterIcon,
    filterValue,
    defaultFilterValue,
    onFilterChange,
    data,
    triggerOnChange,
    setTableChangeData,
  } = props;
  const isControlled = typeof filterValue !== 'undefined';
  const [filterVal, setFilterVal] = useState<FilterValue>(defaultFilterValue);

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

  const onFilterChangeRef = useRef(onFilterChange);
  /**
   * 触发筛选按钮，触发onFilterChange回调
   * @param toast
   * @param col
   */
  const onChangeFilterButton = useCallback(
    (toast, col: PrimaryTableCol) => {
      const newFilterVal: FilterValue = {
        ...filterVal,
        ...toast,
      };
      setFilterVal(newFilterVal);
      onFilterChangeRef.current?.(newFilterVal, { col });
      triggerOnChange?.(
        {
          filter: newFilterVal,
        },
        {
          trigger: 'filter',
          currentData: transformedFilterData,
        },
      );
    },
    [filterVal, triggerOnChange, transformedFilterData],
  );

  // 导出：添加筛选图标后的columns
  const transformedFilterColumns = useFilterButton({
    columns,
    onChange: onChangeFilterButton,
    innerFilterVal: isControlled ? filterValue : defaultFilterValue,
    filterIcon,
  });

  useEffect(() => {
    setFilterVal(isControlled ? filterValue : defaultFilterValue);
  }, [filterValue, defaultFilterValue, isControlled]);

  useEffect(() => {
    setTableChangeData?.('filter', filterValue || defaultFilterValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [transformedFilterColumns, transformedFilterData];
}

export default useFilter;
