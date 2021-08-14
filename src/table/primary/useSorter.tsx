import React, { useContext, useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import { ConfigContext } from '../../config-provider';
import { SortInfo, PrimaryTableCol, SortType, DataType, SortOptions, TableSort } from '../../_type/components/table';
import SorterButton, { SortTypeEnum } from './SorterButton';
import { PrimaryTableProps } from './Table';

interface ColKeySorterMap {
  [colKey: string]: PrimaryTableCol['sorter'];
}
interface SortInfoWithSorter extends SortInfo {
  sorter: PrimaryTableCol['sorter'];
}

/**
 * 排序hook
 * 1.修改column中的title
 * 2.排序data
 */
function useSorter(props: PrimaryTableProps): [PrimaryTableCol[], DataType[]] {
  const { classPrefix } = useContext(ConfigContext);
  const { columns, sort, defaultSort, multipleSort, onSortChange, data } = props;
  const isControlled = typeof sort !== 'undefined';
  const [innerSort, setInnerSort] = useState<TableSort>(defaultSort || []);
  const sorts = getSorts(innerSort, columns);

  // 导出：添加排序图标后columns
  const transformedSorterColumns = columns.map((column: PrimaryTableCol) => {
    const { title, sorter, sortType, colKey } = column;
    if (!sorter || !SortTypeEnum[sortType]) {
      return column;
    }

    const singleSort = sorts.find?.((sortItem: SortInfo) => sortItem?.sortBy === colKey);
    const titleNew = () => (
      <div className={`${classPrefix}-table__cell--sortable`}>
        <div className={`${classPrefix}-table__cell--title`}>
          <div>{title}</div>
        </div>
        <SorterButton column={column} singleSort={singleSort} onChange={onChangeSortButton} />
      </div>
    );

    return {
      ...column,
      title: titleNew,
    };
  });

  // 导出：排序后data。受控直接导出、非受控多级排序
  const transformedSorterData = useMemo<DataType[]>(() => {
    if (isControlled) {
      return data;
    }
    return [...data].sort(comparer(sorts));
  }, [data, sorts, isControlled]);

  /**
   * 格式化sort
   * 1.PrimaryTableCol的sort改为数组sorts；
   * 2.依据TdPrimaryTableProps的sort过滤出validSorts
   * 3.TdPrimaryTableProps的sort添加至validSortItem，用于data排序
   */
  function getSorts(innerSort: TableSort, columns: PrimaryTableCol[]): SortInfoWithSorter[] {
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
      onSortChange(sortsNew, sortOptions);
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
      onSortChange(sortNew, sortOptions);
    }
  }

  useEffect(() => {
    if (isControlled) {
      setInnerSort(sort);
    }
  }, [sort, isControlled]);

  return [transformedSorterColumns, transformedSorterData];
}

export default useSorter;

function comparer(sorts: SortInfoWithSorter[]) {
  return (a: any, b: any) => {
    for (const { sortBy, descending, sorter } of sorts) {
      const hasSorter = typeof sorter === 'function';
      const firstValue = get(a, sortBy);
      const secondValue = get(b, sortBy);
      const isAsc = hasSorter ? sorter(a, b) < 0 : firstValue < secondValue;
      const isDesc = hasSorter ? sorter(a, b) > 0 : firstValue > secondValue;
      if (isAsc || isDesc) {
        if (!descending) return isAsc ? -1 : 1;
        if (descending) return isDesc ? -1 : 1;
      }
    }
    return 0;
  };
}
