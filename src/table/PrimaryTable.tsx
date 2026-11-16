import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { get } from 'lodash-es';
import { PrimaryTableProps, PrimaryTableRef } from './interface';
import {
  PageInfo,
  PaginationProps,
  PrimaryTableCol,
  TableRowData,
  TdBaseTableProps,
  TdPrimaryTableProps,
} from './type';
import useDefaultProps from '../hooks/useDefaultProps';
import useControlled from '../hooks/useControlled';
import useClassName from './hooks/useClassName';
import useRowSelect from './hooks/useRowSelect';
import useSorter from './hooks/useSorter';
import useFilter from './hooks/useFilter';
import useDragSort from './hooks/useDragSort';
import useRowExpand from './hooks/useRowExpand';
import useTableHeader, { renderTitle } from './hooks/useTableHeader';
import { primaryTableDefaultProps } from './defaultProps';
import BaseTable from './BaseTable';

const PrimaryTable = forwardRef<PrimaryTableRef, PrimaryTableProps>((props, ref) => {
  const {
    className,
    columns,
    style,
    pagination: originPagination,
  } = useDefaultProps<PrimaryTableProps>(props, primaryTableDefaultProps);
  // 保留用户未传 pagination 时为 undefined 的语义（不分页）
  // 默认值填充由 TablePagination 组件内部处理
  const pagination = originPagination;
  const primaryTableRef = useRef(null);
  const innerPagination = useRef<PaginationProps>(pagination);
  const { classPrefix, tableDraggableClasses, tableBaseClass, tableSelectedClasses, tableSortClasses } = useClassName();
  const [tDisplayColumns] = useControlled(props, 'displayColumns', props.onDisplayColumnsChange);
  // 行选中功能
  const {
    selectedRowClassNames,
    setCurrentPaginateData,
    formatToRowSelectColumn,
    setTSelectedRowKeys,
    onInnerSelectRowClick,
  } = useRowSelect(props, tableSelectedClasses);
  // 排序功能
  const { renderSortIcon } = useSorter(props);
  // 拖拽排序功能
  const { isRowHandlerDraggable, isRowDraggable, isColDraggable, updateLastRowList, setDragSortColumns } = useDragSort(
    props,
    {
      primaryTableRef,
      innerPagination,
    },
  );
  // 过滤功能
  const { isTableOverflowHidden, renderFilterIcon } = useFilter(props, primaryTableRef);
  // 展开/收起行功能
  const {
    showExpandedRow,
    showExpandIconColumn,
    getExpandColumn,
    renderExpandedRow,
    onInnerExpandRowClick,
    getExpandedRowClass,
  } = useRowExpand(props);
  const { renderTitleWidthIcon } = useTableHeader({ columns: props.columns });

  // 如果想给 TR 添加类名，请在这里补充，不要透传更多额外 Props 到 BaseTable
  const tRowClassNames = useMemo(() => {
    const tClassNames = [props.rowClassName, selectedRowClassNames, getExpandedRowClass];
    return tClassNames.filter((v) => v);
  }, [getExpandedRowClass, props.rowClassName, selectedRowClassNames]);

  // 如果想给 TR 添加属性，请在这里补充，不要透传更多额外 Props 到 BaseTable
  const tRowAttributes = useMemo(() => {
    const tAttributes = [props.rowAttributes];
    if (isRowHandlerDraggable || isRowDraggable) {
      tAttributes.push(({ row }) => ({ 'data-id': get(row, props.rowKey || 'id') }));
    }
    return tAttributes.filter((v) => v);
  }, [isRowDraggable, isRowHandlerDraggable, props.rowAttributes, props.rowKey]);

  const primaryTableClasses = useMemo(
    () => ({
      [tableDraggableClasses.colDraggable]: isColDraggable,
      [tableDraggableClasses.rowHandlerDraggable]: isRowHandlerDraggable,
      [tableDraggableClasses.rowDraggable]: isRowDraggable,
      [tableBaseClass.overflowVisible]: isTableOverflowHidden === false,
    }),
    [
      isColDraggable,
      isRowDraggable,
      isRowHandlerDraggable,
      isTableOverflowHidden,
      tableBaseClass,
      tableDraggableClasses,
    ],
  );

  useImperativeHandle(ref, () => ({
    ...primaryTableRef.current,
  }));

  const getColumns = useCallback(
    (columns: PrimaryTableCol<TableRowData>[]) => {
      const arr: PrimaryTableCol<TableRowData>[] = [];
      for (let i = 0, len = columns.length; i < len; i++) {
        let item = { ...columns[i] };
        // 自定义列显示控制
        const isDisplayColumn = item.children?.length || tDisplayColumns?.includes(item.colKey);
        if (!isDisplayColumn && tDisplayColumns) continue;
        item = formatToRowSelectColumn(item);
        const { sort, showSortColumnBgColor } = props;
        if (item.sorter && showSortColumnBgColor) {
          const sorts = sort instanceof Array ? sort : [sort];
          const sortedColumn = sorts.find(
            (sort) => sort && sort.sortBy === item.colKey && sort.descending !== undefined,
          );
          if (sortedColumn) {
            item.className =
              item.className instanceof Array
                ? item.className.concat(tableSortClasses.sortColumn)
                : [item.className, tableSortClasses.sortColumn];
          }
        }
        // 添加排序图标和过滤图标
        if (item.sorter || item.filter) {
          const titleContent = renderTitle(item, i);
          const { ellipsisTitle } = item;
          item.title = (p) => {
            const sortIcon = item.sorter ? renderSortIcon(p) : null;
            const filterIcon = item.filter ? renderFilterIcon(p) : null;
            const attach = primaryTableRef.current?.tableContentRef;
            return renderTitleWidthIcon(
              [titleContent, sortIcon, filterIcon],
              p.col,
              p.colIndex,
              ellipsisTitle,
              attach,
              {
                classPrefix,
                ellipsisOverlayClassName: '',
              },
            );
          };
          item.ellipsisTitle = false;
        }
        if (item.children?.length) {
          item.children = getColumns(item.children);
        }
        // 多级表头和自定义列配置特殊逻辑：要么子节点不存在，要么子节点长度大于 1，方便做自定义列配置
        if (!item.children || item.children?.length) {
          arr.push(item);
        }
      }
      return arr;
    },
    [
      tDisplayColumns,
      formatToRowSelectColumn,
      props,
      tableSortClasses.sortColumn,
      renderSortIcon,
      renderFilterIcon,
      renderTitleWidthIcon,
      classPrefix,
    ],
  );

  const tColumns = useMemo(() => {
    const cols = getColumns(columns);
    if (showExpandIconColumn) {
      cols.unshift(getExpandColumn());
    }
    return cols;
  }, [columns, getColumns, getExpandColumn, showExpandIconColumn]);

  const onInnerPageChange = (pageInfo: PageInfo, newData: Array<TableRowData>) => {
    innerPagination.current = { ...innerPagination, ...pageInfo };
    setCurrentPaginateData(newData);
    props.onPageChange?.(pageInfo, newData);
    const changeParams: Parameters<TdPrimaryTableProps['onChange']> = [
      { pagination: pageInfo },
      { trigger: 'pagination', currentData: newData },
    ];
    props.onChange?.(...changeParams);
    // 是否在分页时保留选中结果，如果不保留则需清空
    if (!props.reserveSelectedRowOnPaginate) {
      setTSelectedRowKeys([], {
        selectedRowData: [],
        type: 'uncheck',
        currentRowKey: 'CLEAR_ON_PAGINATE',
      });
    }
  };

  const onInnerRowClick: TdPrimaryTableProps['onRowClick'] = (params) => {
    if (props.expandOnRowClick) {
      onInnerExpandRowClick(params);
    }
    if (props.selectOnRowClick) {
      onInnerSelectRowClick(params);
    }
  };

  const onPrimaryTableScroll: TdBaseTableProps['onScroll'] = (params) => {
    props.onScroll?.(params);
    updateLastRowList();
  };

  const baseTableProps = {
    ...props,
    className: classNames(primaryTableClasses, className),
    columns: tColumns,
    rowClassName: tRowClassNames,
    rowAttributes: tRowAttributes,
    thDraggable: ['col', 'row-handler-col'].includes(props.dragSort),
    renderExpandedRow: showExpandedRow ? renderExpandedRow : undefined,
    onPageChange: onInnerPageChange,
    onScroll: onPrimaryTableScroll,
    onLeafColumnsChange: setDragSortColumns,
  };

  if (props.expandOnRowClick || props.selectOnRowClick) {
    baseTableProps.onRowClick = onInnerRowClick;
  }

  return <BaseTable {...baseTableProps} ref={primaryTableRef} style={style} />;
});

PrimaryTable.displayName = 'PrimaryTable';

export default PrimaryTable;
