import React, { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { get, isFunction } from 'lodash-es';

import log from '@tdesign/common-js/log/index';
import { isRowSelectedDisabled } from '@tdesign/common-js/table/utils';
import Checkbox from '../../checkbox';
import useControlled from '../../hooks/useControlled';
import Radio from '../../radio';

import type { ClassName } from '../../common';
import type { InternalPrimaryTableProps } from '../PrimaryTable';
import type {
  PrimaryTableCellParams,
  PrimaryTableCol,
  RowClassNameParams,
  TableRowData,
  TdBaseTableProps,
} from '../type';
import type { TableClassName } from './useClassName';

export default function useRowSelect(
  props: InternalPrimaryTableProps,
  tableSelectedClasses: TableClassName['tableSelectedClasses'],
) {
  const { columns, data, rowKey, indeterminateSelectedRowKeys, pagination, reserveSelectedRowOnPaginate, treeDataMap } =
    props;

  const [currentPaginateData, setCurrentPaginateData] = useState<TableRowData[]>(data);
  const [selectedRowClassNames, setSelectedRowClassNames] = useState<TdBaseTableProps['rowClassName']>();

  const [tSelectedRowKeys, setTSelectedRowKeys] = useControlled(props, 'selectedRowKeys', props.onSelectChange, {
    defaultSelectedRowKeys: props.defaultSelectedRowKeys || [],
  });

  const selectedRowDataMapRef = useRef<Map<string | number, TableRowData>>(new Map());

  const selectColumn = columns.find(({ type }) => ['multiple', 'single'].includes(type));
  const selectedRowKeysSet = useMemo(() => new Set(tSelectedRowKeys), [tSelectedRowKeys]);

  const allTreeRows = useMemo(() => {
    if (!treeDataMap || treeDataMap.size === 0) return data;
    const treeRows: TableRowData[] = [];
    treeDataMap.forEach((rowState) => {
      if (rowState.row) {
        treeRows.push(rowState.row);
      }
    });
    return treeRows;
  }, [data, treeDataMap]);

  const currentRows = useMemo(() => allTreeRows || currentPaginateData, [allTreeRows, currentPaginateData]);

  // 未禁用行
  const enabledRows = useMemo(
    () => currentRows?.filter((row, rowIndex) => !isRowSelectedDisabled(selectColumn, row, rowIndex)) || [],
    [currentRows, selectColumn],
  );

  // 已选中的未禁用行
  const selectedEnabledKeys = useMemo(() => {
    const selectableRowKeys = new Set(enabledRows.map((t) => get(t, rowKey)));
    return tSelectedRowKeys.filter((key) => selectableRowKeys.has(key));
  }, [tSelectedRowKeys, enabledRows, rowKey]);

  useEffect(
    () => {
      if (reserveSelectedRowOnPaginate) return;
      // 分页变化时，在 onPageChange 中设置 setCurrentPaginateData，PrimaryTable 中
      const { pageSize, current, defaultPageSize, defaultCurrent } = pagination;
      const tPageSize = pageSize || defaultPageSize;
      const tCurrent = current || defaultCurrent;
      const newData = data.slice(tPageSize * (tCurrent - 1), tPageSize * tCurrent);
      setCurrentPaginateData(newData);
    },
    // eslint-disable-next-line
    [data, reserveSelectedRowOnPaginate],
  );

  useEffect(() => {
    if (!selectColumn && !tSelectedRowKeys?.length) return;
    const disabledRowFunc = (p: RowClassNameParams<TableRowData>): ClassName =>
      selectColumn.disabled(p) ? tableSelectedClasses.disabled : '';
    const disabledRowClass = selectColumn?.disabled ? disabledRowFunc : undefined;

    const selectedRowClassFunc = ({ row }: RowClassNameParams<TableRowData>) => {
      const rowId = get(row, rowKey);
      return selectedRowKeysSet.has(rowId) ? tableSelectedClasses.selected : '';
    };
    const selectedRowClass = selectedRowKeysSet.size ? selectedRowClassFunc : undefined;
    setSelectedRowClassNames([disabledRowClass, selectedRowClass]);
  }, [selectColumn, tSelectedRowKeys, selectedRowKeysSet, rowKey, tableSelectedClasses]);

  function handleSelectAll(checked: boolean) {
    const enabledRowKeys = enabledRows.map((record) => get(record, rowKey));
    const enabledRowKeysSet = new Set(enabledRowKeys);

    const selectedDisabledRowKeys = tSelectedRowKeys.filter((id) => !enabledRowKeysSet.has(id));
    const indeterminateKeysInSelected = indeterminateSelectedRowKeys?.filter((id) => selectedRowKeysSet.has(id)) || [];

    const selectedEnabledKeysSet = new Set(selectedEnabledKeys);
    const allEnabledRowsSelected = enabledRowKeys.every((key) => selectedEnabledKeysSet.has(key));

    const hasDisabledRows = enabledRows.length < currentRows.length;

    // 节点为半选状态时，再次点击：
    // 1) 所有未禁用项都被选中 -> uncheck
    // 2) 仍存在可选项 -> check
    // 才能确保状态的来回切换
    const shouldSelectAll = hasDisabledRows && allEnabledRowsSelected ? false : checked;

    const keys = shouldSelectAll
      ? [...selectedDisabledRowKeys, ...enabledRowKeys, ...indeterminateKeysInSelected]
      : [...selectedDisabledRowKeys, ...indeterminateKeysInSelected];

    setTSelectedRowKeys(keys, {
      selectedRowData: keys.map((t) => selectedRowDataMapRef.current.get(t)),
      type: shouldSelectAll ? 'check' : 'uncheck',
      currentRowKey: 'CHECK_ALL_BOX',
    });
  }

  function renderCheckAll() {
    return () => {
      const allCurrentRowKeys = currentRows?.map((row) => get(row, rowKey)) || [];
      const allCurrentRowKeysSet = new Set(allCurrentRowKeys);

      const selectedInCurrentData = tSelectedRowKeys.filter((key) => allCurrentRowKeysSet.has(key));

      const selectedNotInCurrentData = reserveSelectedRowOnPaginate
        ? 0
        : tSelectedRowKeys.length - selectedInCurrentData.length;

      const disabledRows =
        currentRows?.filter((row, rowIndex) => isRowSelectedDisabled(selectColumn, row, rowIndex)) || [];
      const disabledRowKeys = disabledRows.map((row) => get(row, rowKey));
      const selectedDisabledKeys = disabledRowKeys.filter((key) => selectedRowKeysSet.has(key));

      const allEnabledSelected = enabledRows.length > 0 && selectedEnabledKeys.length === enabledRows.length;
      const allDisabledSelected =
        disabledRowKeys.length === 0 || selectedDisabledKeys.length === disabledRowKeys.length;

      const isChecked =
        currentRows.length !== 0 && allEnabledSelected && allDisabledSelected && selectedNotInCurrentData === 0;

      const isIndeterminate =
        currentRows.length !== 0 && !isChecked && (selectedInCurrentData.length > 0 || selectedNotInCurrentData > 0);
      return (
        <Checkbox
          checked={isChecked}
          indeterminate={isIndeterminate}
          disabled={!enabledRows.length}
          onChange={handleSelectAll}
        />
      );
    };
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
    const checked = selectedRowKeysSet.has(get(row, rowKey));
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
    const rowId = get(row, rowKey);
    const selectedRowIndex = selectedRowKeys.indexOf(rowId);
    const isExisted = selectedRowIndex !== -1;
    if (selectColumn.type === 'multiple') {
      isExisted ? selectedRowKeys.splice(selectedRowIndex, 1) : selectedRowKeys.push(rowId);
    } else if (selectColumn.type === 'single') {
      selectedRowKeys = isExisted && allowUncheck ? [] : [rowId];
    } else {
      log.warn('Table', '`column.type` must be one of `multiple` and `single`');
      return;
    }
    setTSelectedRowKeys(selectedRowKeys, {
      selectedRowData: selectedRowKeys.map((t) => selectedRowDataMapRef.current.get(t)),
      currentRowKey: rowId,
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

  const onInnerSelectRowClick: InternalPrimaryTableProps['onRowClick'] = ({ row, index }) => {
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
    const newMap = new Map<string | number, TableRowData>();
    for (let i = 0, len = data.length; i < len; i++) {
      const key = get(data[i], rowKey);
      newMap.set(key, data[i]);
    }
    selectedRowDataMapRef.current = newMap;
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
