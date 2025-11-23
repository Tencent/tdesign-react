// 行选中相关功能：单选 + 多选

import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { get, isFunction } from 'lodash-es';

import log from '@tdesign/common-js/log/index';
import { isRowSelectedDisabled } from '@tdesign/common-js/table/utils';
import Checkbox from '../../checkbox';
import useControlled from '../../hooks/useControlled';
import Radio from '../../radio';
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from './usePagination';

import type { ClassName } from '../../common';
import type {
  PrimaryTableCellParams,
  PrimaryTableCol,
  RowClassNameParams,
  TableRowData,
  TdBaseTableProps,
  TdPrimaryTableProps,
} from '../type';
import type { TableClassName } from './useClassName';

const selectedRowDataMap = new Map<string | number, TableRowData>();

export default function useRowSelect(
  props: TdPrimaryTableProps,
  tableSelectedClasses: TableClassName['tableSelectedClasses'],
) {
  const {
    selectedRowKeys,
    columns,
    data,
    rowKey,
    indeterminateSelectedRowKeys,
    pagination,
    reserveSelectedRowOnPaginate,
  } = props;
  const [currentPaginateData, setCurrentPaginateData] = useState<TableRowData[]>(data);
  const [selectedRowClassNames, setSelectedRowClassNames] = useState<TdBaseTableProps['rowClassName']>();
  const [tSelectedRowKeys, setTSelectedRowKeys] = useControlled(props, 'selectedRowKeys', props.onSelectChange, {
    defaultSelectedRowKeys: props.defaultSelectedRowKeys || [],
  });
  const selectColumn = columns.find(({ type }) => ['multiple', 'single'].includes(type));

  const canSelectedRows = useMemo(() => {
    const currentData = reserveSelectedRowOnPaginate ? data : currentPaginateData;
    return currentData?.filter((row, rowIndex): boolean => !isDisabled(row, rowIndex)) || [];
    // eslint-disable-next-line
  }, [reserveSelectedRowOnPaginate, data, currentPaginateData]);

  useEffect(
    () => {
      if (reserveSelectedRowOnPaginate) return;
      // 分页变化时，在 onPageChange 中设置 setCurrentPaginateData，PrimaryTable 中
      if (!pagination) {
        setCurrentPaginateData(data);
        return;
      }
      const { pageSize, current, defaultPageSize, defaultCurrent } = pagination;
      const tPageSize = pageSize || defaultPageSize || DEFAULT_PAGE_SIZE;
      const tCurrent = current || defaultCurrent || DEFAULT_CURRENT;
      const newData = data.slice(tPageSize * (tCurrent - 1), tPageSize * tCurrent);
      setCurrentPaginateData(newData);
    },
    // eslint-disable-next-line
    [data, reserveSelectedRowOnPaginate, pagination],
  );

  useEffect(
    () => {
      if (!selectColumn && (!tSelectedRowKeys || !tSelectedRowKeys.length)) return;
      const disabledRowFunc = (p: RowClassNameParams<TableRowData>): ClassName =>
        selectColumn.disabled(p) ? tableSelectedClasses.disabled : '';
      const disabledRowClass = selectColumn?.disabled ? disabledRowFunc : undefined;
      const selected = new Set(tSelectedRowKeys);
      const selectedRowClassFunc = ({ row }: RowClassNameParams<TableRowData>) => {
        const rowId = get(row, rowKey || 'id');
        return selected.has(rowId) ? tableSelectedClasses.selected : '';
      };
      const selectedRowClass = selected.size ? selectedRowClassFunc : undefined;
      setSelectedRowClassNames([disabledRowClass, selectedRowClass]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, columns, tSelectedRowKeys, selectColumn, rowKey],
  );

  function isDisabled(row: Record<string, any>, rowIndex: number): boolean {
    return isRowSelectedDisabled(selectColumn, row, rowIndex);
  }

  function renderCheckAll() {
    const currentData = reserveSelectedRowOnPaginate ? data : currentPaginateData;
    const totalRowCount = currentData?.length || 0;

    const currentPageRowKeys = currentData?.map((row) => get(row, rowKey)) || [];
    const selectedInCurrentPage = tSelectedRowKeys.filter((key) => currentPageRowKeys.includes(key));

    const isChecked = totalRowCount > 0 && selectedInCurrentPage.length === totalRowCount;
    const isIndeterminate = selectedInCurrentPage.length > 0 && selectedInCurrentPage.length < totalRowCount;

    const handleSelectAll = () => {
      const canSelectedRowKeys = canSelectedRows.map((record) => get(record, rowKey));

      const currentData = reserveSelectedRowOnPaginate ? data : currentPaginateData;
      const disabledRowKeys =
        currentData?.filter((row, rowIndex) => isDisabled(row, rowIndex)).map((row) => get(row, rowKey)) || [];

      const disabledSelectedRowKeys = selectedRowKeys?.filter((id) => disabledRowKeys.includes(id)) || [];
      const allSelectableRowsSelected = canSelectedRowKeys.every((key) => tSelectedRowKeys.includes(key));
      const shouldSelectAll = !allSelectableRowsSelected;

      const allIds = shouldSelectAll
        ? [...disabledSelectedRowKeys, ...canSelectedRowKeys]
        : [...disabledSelectedRowKeys];

      setTSelectedRowKeys(allIds, {
        selectedRowData: shouldSelectAll
          ? allIds.map((t) => selectedRowDataMap.get(t))
          : disabledSelectedRowKeys.map((t) => selectedRowDataMap.get(t)),
        type: shouldSelectAll ? 'check' : 'uncheck',
        currentRowKey: 'CHECK_ALL_BOX',
      });
    };

    return (
      <Checkbox
        checked={isChecked}
        indeterminate={isIndeterminate}
        disabled={!canSelectedRows.length}
        onChange={handleSelectAll}
      />
    );
  }

  function getRowSelectDisabledData(p: PrimaryTableCellParams<TableRowData>) {
    const { col, row, rowIndex } = p;
    const disabled: boolean = typeof col.disabled === 'function' ? col.disabled({ row, rowIndex }) : col.disabled;
    const checkProps = isFunction(col.checkProps) ? col.checkProps({ row, rowIndex }) : col.checkProps;
    return {
      disabled: disabled || checkProps?.disabled,
      checkProps,
    };
  }

  function renderSelectCell(p: PrimaryTableCellParams<TableRowData>) {
    const { col: column, row = {} } = p;
    const checked = tSelectedRowKeys.includes(get(row, rowKey || 'id'));
    const { disabled, checkProps } = getRowSelectDisabledData(p);
    const selectBoxProps = {
      checked,
      disabled,
      ...checkProps,
      onChange: () => {
        handleSelectChange(row);
      },
    };
    // 选中行功能中，点击 checkbox/radio 需阻止事件冒泡，避免触发不必要的 onRowClick
    const onCheckClick = (p: { e: MouseEvent<HTMLLabelElement> } | MouseEvent<HTMLLabelElement>) => {
      const e = 'e' in p ? p.e : p;
      e?.stopPropagation();
    };
    if (column.type === 'single') return <Radio {...selectBoxProps} onClick={onCheckClick} />;
    if (column.type === 'multiple') {
      const isIndeterminate = indeterminateSelectedRowKeys?.length
        ? indeterminateSelectedRowKeys.includes(get(row, rowKey))
        : false;
      return <Checkbox indeterminate={isIndeterminate} {...selectBoxProps} onClick={onCheckClick} />;
    }
    return null;
  }

  const allowUncheck = useMemo(() => {
    const singleSelectCol = columns.find((col) => col.type === 'single');
    if (!singleSelectCol || !singleSelectCol.checkProps || !('allowUncheck' in singleSelectCol.checkProps))
      return false;
    return singleSelectCol.checkProps.allowUncheck;
  }, [columns]);

  function handleSelectChange(row: TableRowData = {}) {
    let selectedRowKeys = [...tSelectedRowKeys];
    const reRowKey = rowKey || 'id';
    const id = get(row, reRowKey);
    const selectedRowIndex = selectedRowKeys.indexOf(id);
    const isExisted = selectedRowIndex !== -1;
    if (selectColumn.type === 'multiple') {
      isExisted ? selectedRowKeys.splice(selectedRowIndex, 1) : selectedRowKeys.push(id);
    } else if (selectColumn.type === 'single') {
      selectedRowKeys = isExisted && allowUncheck ? [] : [id];
    } else {
      log.warn('Table', '`column.type` must be one of `multiple` and `single`');
      return;
    }
    setTSelectedRowKeys(selectedRowKeys, {
      selectedRowData: selectedRowKeys.map((t) => selectedRowDataMap.get(t)),
      currentRowKey: id,
      currentRowData: row,
      type: isExisted ? 'uncheck' : 'check',
    });
  }

  function formatToRowSelectColumn(col: PrimaryTableCol) {
    const isSelection = ['multiple', 'single'].includes(col.type);
    if (!isSelection) return col;
    return {
      ...col,
      width: col.width || 64,
      className: tableSelectedClasses.checkCell,
      cell: (p: PrimaryTableCellParams<TableRowData>) => renderSelectCell(p),
      title: col.type === 'multiple' ? renderCheckAll() : col.title,
    };
  }

  const onInnerSelectRowClick: TdPrimaryTableProps['onRowClick'] = ({ row, index }) => {
    const selectedColIndex = props.columns.findIndex((item) => item.colKey === 'row-select');
    if (selectedColIndex === -1) return;
    const { disabled } = getRowSelectDisabledData({
      row,
      rowIndex: index,
      col: props.columns[selectedColIndex],
      colIndex: selectedColIndex,
    });
    if (disabled) return;
    handleSelectChange(row);
  };

  useEffect(() => {
    for (let i = 0, len = data.length; i < len; i++) {
      selectedRowDataMap.set(get(data[i], rowKey || 'id'), data[i]);
    }
  }, [data, rowKey]);

  return {
    selectedRowClassNames,
    currentPaginateData,
    setCurrentPaginateData,
    setTSelectedRowKeys,
    formatToRowSelectColumn,
    onInnerSelectRowClick,
  };
}
