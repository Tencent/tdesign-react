import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { get, isFunction } from 'lodash-es';
import cx from 'classnames';

import parseTNode from '../_util/parseTNode';
import { ClassName } from '../common';
import useClassName from './hooks/useClassName';
import useStyle, { formatCSSUnit } from './hooks/useStyle';
import useFixed, { getColumnFixedStyles, getRowFixedStyles } from './hooks/useFixed';
import useDefaultProps from '../hooks/useDefaultProps';
import defaultConfig from '../_common/js/global-config/mobile/locale/zh_CN';
import Loading from '../loading';
import { baseTableDefaultProps } from './defaultProps';
import usePullRefresh from './hooks/usePullRefresh';
import { BaseTableProps, BaseTableRef } from './interface';
import {
  formatClassNames,
  formatRowAttributes,
  formatRowClassNames,
  handleCellSpan,
  isFirstColumnInSpan,
  isLastRowInSpan,
  renderCell,
} from './utils';
import useRowspanAndColspan from './hooks/useRowspanAndColspan';
import usePagination from './hooks/usePagination';
import useTableHeader from './hooks/useTableHeader';
import { BaseTableCol, TableRowData } from './type';

const BaseTable = forwardRef<BaseTableRef, BaseTableProps>((originProps, ref) => {
  const props = useDefaultProps<BaseTableProps>(originProps, baseTableDefaultProps);
  const {
    bordered,
    className,
    columns,
    cellEmptyContent,
    data,
    empty,
    height,
    loading,
    loadingProps,
    loadingMode,
    maxHeight,
    pagination: originPagination,
    rowspanAndColspan,
    rowKey,
    showHeader,
    style,
    tableLayout,
    onRowClick,
    onCellClick,
    onScroll,
    onLeafColumnsChange,
  } = props;

  // 保留用户未传 pagination 时为 undefined 的语义（不分页）
  // 默认值填充由 TablePagination 组件内部处理
  const pagination = originPagination;

  const { skipSpansMap } = useRowspanAndColspan(data, columns, rowKey, rowspanAndColspan);

  const {
    tableLayoutClasses,
    tableHeaderClasses,
    tableBaseClass,
    tdAlignClasses,
    tdEllipsisClass,
    classPrefix,
    tableRowFixedClasses,
    tableColFixedClasses,
  } = useClassName();

  // 固定表头和固定列逻辑
  const {
    tableContentRef,
    rowAndColFixedPosition,
    isFixedColumn,
    isFixedHeader,
    showColumnShadow,
    refreshTable,
    updateColumnFixedShadow,
    setData,
  } = useFixed(props);

  const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props, {
    isFixedColumn,
    isFixedHeader,
    showColumnShadow,
  });

  const { spansAndLeafNodes } = useTableHeader({ columns });

  const tableRef = useRef<HTMLDivElement>(null);

  const tableHeaderIsFixed = Boolean(maxHeight || height);

  const tableElmClasses = tableLayoutClasses[tableLayout || 'fixed'];

  const theadClasses = cx(tableHeaderClasses.header, {
    [tableHeaderClasses.fixed]: tableHeaderIsFixed,
    [tableBaseClass.bordered]: bordered,
  });

  const defaultColWidth = tableLayout === 'fixed' ? '80px' : undefined;

  const [lastLeafColumns, setLastLeafColumns] = useState(props.columns || []);

  const tableElmRef = useRef(null);

  const theadRef = useRef(null);

  const paginationRef = useRef(null);

  const isPullRefreshMode = loadingMode === 'pull-refresh';

  const {
    dataSource: paginationDataSource,
    isPaginateData: isPaginationData,
    renderPagination,
  } = usePagination({ ...props, pagination }, tableContentRef);

  const {
    dataSource: pullRefreshDataSource,
    isPaginateData: isPullRefreshData,
    pullOffset,
    isPulling,
    renderPullRefreshLoading,
  } = usePullRefresh({ ...props, pagination }, tableContentRef);

  const getDisplayData = useCallback(() => {
    if (isPullRefreshMode) {
      return isPullRefreshData ? pullRefreshDataSource : data;
    }
    return isPaginationData ? paginationDataSource : data;
  }, [data, isPaginationData, isPullRefreshData, isPullRefreshMode, paginationDataSource, pullRefreshDataSource]);

  const newData = useMemo(() => getDisplayData(), [getDisplayData]);

  useEffect(() => {
    setData(newData || props.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, newData]);

  useEffect(() => {
    if (lastLeafColumns.map((t) => t.colKey).join() !== spansAndLeafNodes.leafColumns.map((t) => t.colKey).join()) {
      onLeafColumnsChange?.(spansAndLeafNodes.leafColumns);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setLastLeafColumns(spansAndLeafNodes.leafColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spansAndLeafNodes.leafColumns]);

  const colStyle = (colItem: BaseTableCol<TableRowData>) => ({
    width: `${formatCSSUnit(colItem.width || defaultColWidth)}`,
    minWidth: `${
      !formatCSSUnit(colItem.width || defaultColWidth) && !colItem.minWidth && tableLayout === 'fixed'
        ? '80px'
        : formatCSSUnit(colItem.minWidth)
    }`,
  });

  const thClassName = (thItem: BaseTableCol<TableRowData>, extra: Array<ClassName>) => {
    let className = '';
    if (thItem.colKey) {
      className = `${classPrefix}-table__th-${thItem.colKey}`;
    }
    if (thItem.ellipsisTitle || thItem.ellipsis) {
      className = `${className} ${tdEllipsisClass}`;
    }
    if (thItem.align && thItem.align !== 'left') {
      className = `${className} ${tdAlignClasses[`${thItem.align}`]}`;
    }
    return cx([className, ...extra]);
  };

  const tdClassName = (tdItem: BaseTableCol<TableRowData>, extra?: Array<ClassName>) => {
    let className = '';
    if (tdItem.ellipsis) {
      className = tdEllipsisClass;
    }
    if (tdItem.align && tdItem.align !== 'left') {
      className = `${className} ${tdAlignClasses[`${tdItem.align}`]}`;
    }
    return cx([className, ...extra]);
  };

  const handleRowClick = (row: TableRowData, rowIndex: number, e: React.MouseEvent<HTMLTableRowElement>) => {
    onRowClick?.({ row, index: rowIndex, e });
  };

  const handleCellClick = (
    row: TableRowData,
    col: any,
    rowIndex: number,
    colIndex: number,
    e: React.MouseEvent<HTMLTableCellElement>,
  ) => {
    if (col.stopPropagation) {
      e.stopPropagation();
    }
    onCellClick?.({ row, col, rowIndex, colIndex, e });
  };

  const onInnerVirtualScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    updateColumnFixedShadow(target);
    onScroll?.({ e });
  };

  useImperativeHandle(ref, () => ({
    tableElement: tableRef.current,
    tableHtmlElement: tableElmRef.current,
    tableContentElement: tableContentRef.current,
    refreshTable,
  }));

  const renderTitle = (thItem: BaseTableCol<TableRowData>, index: number) => {
    if (isFunction(thItem?.title)) {
      return thItem?.title({ col: thItem, colIndex: index });
    }
    return thItem?.title;
  };

  const getTableHeaderStyle = () => {
    if (!isPullRefreshData) {
      return;
    }
    if (tableHeaderIsFixed) {
      return { zIndex: 2 };
    }
    return { position: 'relative', zIndex: 2 };
  };

  const renderTableHeader = () =>
    showHeader && (
      <thead ref={theadRef} className={theadClasses} style={getTableHeaderStyle() as CSSProperties}>
        <tr>
          {columns?.map((thItem, idx) => {
            const thStyles = getColumnFixedStyles(thItem, idx, rowAndColFixedPosition, tableColFixedClasses);
            const customClasses = formatClassNames(thItem.className, {
              col: thItem,
              colIndex: idx,
              row: {},
              rowIndex: -1,
              type: 'th',
            });
            return (
              <th key={idx} className={thClassName(thItem, [thStyles.classes, customClasses])} style={thStyles.style}>
                <div>{renderTitle(thItem, idx)}</div>
              </th>
            );
          })}
        </tr>
      </thead>
    );

  const renderTableBody = () => {
    const renderContentEmpty = empty || defaultConfig?.table?.empty;

    if (!newData?.length && renderContentEmpty) {
      return (
        <tr className={tableBaseClass.emptyRow}>
          <td colSpan={columns?.length}>
            <div className={tableBaseClass.empty}>{parseTNode(renderContentEmpty)}</div>
          </td>
        </tr>
      );
    }
    if (newData?.length) {
      return newData?.map((trItem, trIdx) => {
        const trStyles = getRowFixedStyles(
          get(trItem, props.rowKey || 'id'),
          trIdx,
          newData?.length || 0,
          props.fixedRows,
          rowAndColFixedPosition,
          tableRowFixedClasses,
        );

        const customClasses = formatRowClassNames(
          props.rowClassName,
          { row: trItem, rowKey: props.rowKey, rowIndex: trIdx, type: 'body' },
          props.rowKey || 'id',
        );

        const trAttributes =
          formatRowAttributes(props.rowAttributes, { row: trItem, rowIndex: trIdx, type: 'body' }) || {};

        const trKey = get(trItem, props.rowKey) ?? trIdx;
        return (
          <tr
            {...trAttributes}
            key={trKey}
            style={trStyles.style}
            className={cx([trStyles.classes, customClasses, trAttributes.class])}
            onClick={(ev) => {
              handleRowClick(trItem, trIdx, ev);
            }}
          >
            {columns?.map((tdItem, tdIdx) => {
              const params = { row: trItem, col: tdItem, rowIndex: trIdx, colIndex: tdIdx };
              const cellKey = `${get(trItem, props.rowKey || 'id')}_${tdItem.colKey || tdIdx}`;

              // 处理合并单元格
              const { skipped, rowspan, colspan } = handleCellSpan(cellKey, skipSpansMap);
              if (skipped) return null;

              const tdStyles = getColumnFixedStyles(tdItem, tdIdx, rowAndColFixedPosition, tableColFixedClasses);
              const customClasses = formatClassNames(tdItem.className, {
                col: tdItem,
                colIndex: tdIdx,
                row: trItem,
                rowIndex: trIdx,
                type: 'td',
              });

              const cellClasses = cx(tdClassName(tdItem, [tdStyles.classes, customClasses]), {
                // 合并单元格场景：最后一行移除底部边框
                [tableBaseClass.tdLastRow]: isLastRowInSpan(trIdx, rowspan, newData?.length),
                // 合并单元格场景：第一列移除左边框
                [tableBaseClass.tdFirstCol]: rowspanAndColspan && isFirstColumnInSpan(tdIdx),
              });

              return (
                <td
                  key={tdIdx}
                  style={tdStyles.style}
                  className={cellClasses}
                  rowSpan={rowspan}
                  colSpan={colspan}
                  onClick={($event) => {
                    handleCellClick(trItem, tdItem, trIdx, tdIdx, $event);
                  }}
                >
                  <div>{renderCell(params, cellEmptyContent)}</div>
                </td>
              );
            })}
          </tr>
        );
      });
    }
  };

  const renderLoading = () => {
    // pull-refresh 模式下，上拉加载 loading 由 usePullRefresh hook 内部渲染
    if (isPullRefreshMode) {
      return renderPullRefreshLoading();
    }

    // 非 pull-refresh 模式，使用外部 loading 控制
    if (!loading) return null;

    // 默认全屏 loading
    return (
      <div className={`${classPrefix}-table__loading--full`}>
        <Loading {...loadingProps} />
      </div>
    );
  };

  // 外部传入 loading={true} 时的全屏 loading（pull-refresh 模式下也支持外部控制全屏 loading）
  const renderFullLoading = () => {
    if (!loading || !isPullRefreshMode) return null;
    return (
      <div className={`${classPrefix}-table__loading--full`}>
        <Loading {...loadingProps} />
      </div>
    );
  };

  const renderPaginationNode = () =>
    pagination &&
    loadingMode === 'pagination' && (
      <div ref={paginationRef} className={tableBaseClass.paginationWrap}>
        {renderPagination()}
      </div>
    );

  return (
    <div ref={tableRef} className={cx(tableClasses, className)} style={{ position: 'relative', ...style }}>
      <div
        ref={tableContentRef}
        className={tableBaseClass.content}
        style={tableContentStyles}
        onScroll={onInnerVirtualScroll}
      >
        <table ref={tableElmRef} className={tableElmClasses} style={tableElementStyles}>
          <colgroup>
            {columns?.map((col) => (
              <col key={col.colKey} style={colStyle(col)} />
            ))}
          </colgroup>
          {renderTableHeader()}
          <tbody
            className={tableBaseClass.body}
            style={
              isPullRefreshMode
                ? {
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: 'inherit',
                    transform: pullOffset > 0 ? `translateY(-${pullOffset}px)` : 'translateY(0)',
                    transition: isPulling ? 'none' : 'transform 0.3s ease',
                  }
                : undefined
            }
          >
            {renderTableBody()}
          </tbody>
        </table>
        {renderLoading()}
        {renderFullLoading()}
        {renderPaginationNode()}
      </div>
    </div>
  );
});

BaseTable.displayName = 'BaseTable';

export default BaseTable;
