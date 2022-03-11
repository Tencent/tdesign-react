import React, { useEffect, useMemo, useRef, useState } from 'react';
import get from 'lodash/get';
import { SortInfo, PrimaryTableCol, SortType, DataType, SortOptions, TableSort, TdPrimaryTableProps } from '../type';
import SorterButton, { SortTypeEnum } from './SorterButton';
import { PrimaryTableProps } from './Table';
import { useColumns } from '../hooks/useColumns';
import useConfig from '../../_util/useConfig';

interface ColKeySorterMap {
  [colKey: string]: PrimaryTableCol['sorter'];
}
interface SortInfoWithSorter extends SortInfo {
  sorter: PrimaryTableCol['sorter'];
}
type Columns = TdPrimaryTableProps['columns'];

/**
 * 排序hook
 * 1.修改column中的title
 * 2.排序data
 */
function useSorter(props: PrimaryTableProps): [Columns, DataType[]] {
  const [, flattenColumns] = useColumns(props);
  const { classPrefix } = useConfig();
  const { columns, sort, defaultSort, multipleSort, onSortChange, data } = props;
  const isControlled = typeof sort !== 'undefined';
  const [innerSort, setInnerSort] = useState<TableSort>(defaultSort || []);
  const sorts = useMemo(() => getSorts(innerSort, flattenColumns as Columns), [innerSort, flattenColumns]);

  // 导出：排序后data。受控直接导出、非受控多级排序
  const transformedSorterData = useMemo<DataType[]>(() => {
    if (isControlled) {
      return data;
    }
    return [...data].sort(comparer(sorts));
  }, [data, sorts, isControlled]);

  const onSortChangeRef = useRef(onSortChange);
  // 导出：添加排序图标后columns
  const transformedSorterColumns = useMemo(() => {
    function getSorterColumns(columns: Columns): Columns {
      return columns.map((column) => {
        const { title, sorter, colKey, children } = column;
        if (children && children.length) {
          return {
            ...column,
            children: getSorterColumns(children as Columns),
          };
        }

        if (!sorter) {
          return column;
        }

        const singleSort = sorts.find?.((sortItem: SortInfo) => sortItem?.sortBy === colKey);
        const titleNew = () => (
          <div className={`${classPrefix}-table__cell--sortable`}>
            <div className={`${classPrefix}-table__cell--title`}>
              <div>{title}</div>
              <SorterButton column={column} singleSort={singleSort} onChange={onChangeSortButton} />
            </div>
          </div>
        );

        return {
          ...column,
          title: titleNew,
        };
      });
    }

    /**
     * 排序点击回调
     * 1.设置onSortChange的参数sort（区分单个/多个排序）、sortOptions
     * 2.触发onSortChange
     */
    function onChangeSortButton(activeSort: SortInfo, activeSortType: SortType, activeColumn: PrimaryTableCol) {
      const sortOptions: SortOptions<DataType> = {
        currentDataSource: transformedSorterData,
        col: activeColumn,
      };
      const { colKey: activeColKey } = activeColumn;
      if (multipleSort) {
        let sortsNew: SortInfo[] = [];
        if (activeSort) {
          if (activeSortType === SortTypeEnum.all) {
            sortsNew = sorts
              .filter((sortItem) => sortItem !== activeSort)
              .map(({ sortBy, descending }) => ({ sortBy, descending }));
          } else {
            sortsNew = sorts.map((sortItem) => ({
              sortBy: sortItem.sortBy,
              descending: sortItem === activeSort ? activeSortType === SortTypeEnum.desc : sortItem.descending,
            }));
          }
        } else {
          const sortInfo = {
            sortBy: activeColKey,
            descending: activeSortType === SortTypeEnum.desc,
          };
          if (sorts.length) {
            sortsNew = [...sorts.map(({ sortBy, descending }) => ({ sortBy, descending })), sortInfo];
          } else {
            sortsNew = [sortInfo];
          }
        }
        setInnerSort(sortsNew);
        onSortChangeRef.current?.(sortsNew, sortOptions);
      } else {
        let sortNew: SortInfo | undefined;
        if (activeSort) {
          if (activeSortType !== SortTypeEnum.all) {
            sortNew = {
              sortBy: activeSort.sortBy,
              descending: activeSortType === SortTypeEnum.desc,
            };
          }
        } else {
          sortNew = {
            sortBy: activeColKey,
            descending: activeSortType === SortTypeEnum.desc,
          };
        }
        setInnerSort(sortNew);
        onSortChangeRef.current?.(sortNew, sortOptions);
      }
    }

    return getSorterColumns(columns);
  }, [classPrefix, columns, multipleSort, sorts, transformedSorterData]);

  useEffect(() => {
    if (isControlled) {
      setInnerSort(sort);
    }
  }, [sort, isControlled]);

  /**
   * 格式化sort
   * 1.PrimaryTableCol的sort改为数组sorts；
   * 2.依据TdPrimaryTableProps的sort过滤出validSorts
   * 3.TdPrimaryTableProps的sort添加至validSortItem，用于data排序
   */
  function getSorts(innerSort: TableSort, columns: Columns): SortInfoWithSorter[] {
    let validSorts = [];
    const sortColumns = columns.filter(({ sorter }) => !!sorter);
    const colKeySorterMap: ColKeySorterMap = {};
    sortColumns.forEach(({ colKey, sorter }) => {
      colKeySorterMap[colKey] = sorter;
    });

    const sortColKeys = sortColumns.map(({ colKey }) => colKey);
    if (Array.isArray(innerSort)) {
      validSorts = innerSort.filter((sortItem: SortInfo) => sortColKeys.includes(sortItem?.sortBy));
    } else if (sortColKeys.includes(innerSort?.sortBy)) {
      validSorts = [innerSort];
    }
    const validSortsWithSorter = validSorts?.map((sortItem: SortInfo) => ({
      ...sortItem,
      sorter: colKeySorterMap[sortItem.sortBy],
    }));
    return validSortsWithSorter;
  }

  return [transformedSorterColumns, transformedSorterData];
}

export default useSorter;

function comparer(sorts: SortInfoWithSorter[]) {
  return (a: any, b: any) => {
    for (const { sortBy, descending, sorter } of sorts) {
      const firstValue = get(a, sortBy);
      const secondValue = get(b, sortBy);
      const isAsc = typeof sorter === 'function' ? sorter(a, b) < 0 : firstValue < secondValue;
      const isDesc = typeof sorter === 'function' ? sorter(a, b) > 0 : firstValue > secondValue;
      if (isAsc || isDesc) {
        if (!descending) return isAsc ? -1 : 1;
        if (descending) return isDesc ? -1 : 1;
      }
    }
    return 0;
  };
}
