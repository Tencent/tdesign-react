import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get, isFunction } from 'lodash-es';
import log from '@tdesign/common-js/log/index';
import { isRowSelectedDisabled } from '@tdesign/common-js/table/utils';

import Checkbox from '../../checkbox';
import useControlled from '../../hooks/useControlled';
import Radio from '../../radio';

import type { MouseEvent } from 'react';
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
  const {
    columns = [],
    data = [],
    rowKey = 'id',
    indeterminateSelectedRowKeys,
    pagination,
    reserveSelectedRowOnPaginate,
    treeDataMap,
  } = props;

  const safeRowKey = (rowKey ?? 'id') as string;
  const selectColumn = columns.find(({ type }) => ['multiple', 'single'].includes(type)) as PrimaryTableCol | undefined;

  const selectedRowDataMapRef = useRef<Map<string | number, TableRowData>>(new Map());

  const [currentPaginateData, setCurrentPaginateData] = useState<TableRowData[]>(data);
  const [selectedRowClassNames, setSelectedRowClassNames] = useState<TdBaseTableProps['rowClassName']>();

  const [tSelectedRowKeys, setTSelectedRowKeys] = useControlled(props, 'selectedRowKeys', props.onSelectChange as any, {
    defaultSelectedRowKeys: props.defaultSelectedRowKeys || [],
  });
  const selectedRowKeysSet = useMemo(() => new Set(tSelectedRowKeys ?? []), [tSelectedRowKeys]);

  // 树形数据时，展开所有树节点行；否则使用原始 data
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

  // 当前可见行：树形数据优先，否则使用分页后的数据
  const currentRows = useMemo(() => allTreeRows || currentPaginateData, [allTreeRows, currentPaginateData]);

  // 未禁用的行（过滤掉 disabled 行，全选和半选逻辑只针对可选行）
  const enabledRows = useMemo(
    () => currentRows?.filter((row, rowIndex) => !isRowSelectedDisabled(selectColumn as any, row, rowIndex)) || [],
    [currentRows, selectColumn],
  );

  // 已选中且未禁用的行 key 列表（用于判断全选状态）
  const selectedEnabledKeys = useMemo(() => {
    const selectableRowKeys = new Set(enabledRows.map((t) => get(t, safeRowKey)));
    return (tSelectedRowKeys ?? []).filter((key) => selectableRowKeys.has(key));
  }, [tSelectedRowKeys, enabledRows, safeRowKey]);

  useEffect(
    () => {
      if (reserveSelectedRowOnPaginate) return;
      const { pageSize, current, defaultPageSize, defaultCurrent } = pagination ?? {};
      const tPageSize = pageSize || defaultPageSize;
      const tCurrent = current || defaultCurrent;
      if (!tPageSize || !tCurrent) return;
      const newData = data.slice(tPageSize * (tCurrent - 1), tPageSize * tCurrent);
      setCurrentPaginateData(newData);
    },
    // eslint-disable-next-line
    [data, reserveSelectedRowOnPaginate],
  );

  useEffect(() => {
    if (!selectColumn && !tSelectedRowKeys?.length) return;
    const disabledRowFunc = (p: RowClassNameParams<TableRowData>): ClassName =>
      selectColumn?.disabled?.(p) ? tableSelectedClasses.disabled : '';
    const disabledRowClass = selectColumn?.disabled ? disabledRowFunc : undefined;

    const selectedRowClassFunc = ({ row }: RowClassNameParams<TableRowData>) => {
      const rowId = get(row, safeRowKey);
      return selectedRowKeysSet.has(rowId) ? tableSelectedClasses.selected : '';
    };
    const selectedRowClass = selectedRowKeysSet.size ? selectedRowClassFunc : undefined;
    setSelectedRowClassNames([disabledRowClass, selectedRowClass]);
  }, [selectColumn, tSelectedRowKeys, selectedRowKeysSet, safeRowKey, tableSelectedClasses]);

  function handleSelectAll(checked: boolean) {
    const enabledRowKeys = enabledRows.map((record) => get(record, safeRowKey));
    const enabledRowKeysSet = new Set(enabledRowKeys);

    // 保留已选中的禁用行 key（禁用行不受全选和取消全选影响）
    const selectedDisabledRowKeys = (tSelectedRowKeys ?? []).filter((id) => !enabledRowKeysSet.has(id));
    // 保留半选状态中已被选中的 key（半选行在全选时也需要包含）
    const indeterminateKeysInSelected = indeterminateSelectedRowKeys?.filter((id) => selectedRowKeysSet.has(id)) || [];

    const selectedEnabledKeysSet = new Set(selectedEnabledKeys);
    // 判断当前所有未禁用行是否已全部选中
    const allEnabledRowsSelected = enabledRowKeys.every((key) => selectedEnabledKeysSet.has(key));

    // 是否存在禁用行
    const hasDisabledRows = enabledRows.length < currentRows.length;

    // 半选状态下的全选逻辑：
    // - 若存在禁用行且所有可选行已全选 → 点击应取消全选（uncheck）
    // - 否则按 checked 参数决定（check）
    // 这样可以保证 全选 → 取消全选 → 全选 的状态循环正确
    const shouldSelectAll = hasDisabledRows && allEnabledRowsSelected ? false : checked;

    const keys = shouldSelectAll
      ? [...selectedDisabledRowKeys, ...enabledRowKeys, ...indeterminateKeysInSelected]
      : [...selectedDisabledRowKeys, ...indeterminateKeysInSelected];

    setTSelectedRowKeys(keys, {
      selectedRowData: keys.map((t) => selectedRowDataMapRef.current.get(t)).filter(Boolean) as TableRowData[],
      type: shouldSelectAll ? 'check' : 'uncheck',
      currentRowKey: 'CHECK_ALL_BOX',
    });
  }

  function renderCheckAll() {
    return () => {
      const allCurrentRowKeys = currentRows?.map((row) => get(row, safeRowKey)) || [];
      const allCurrentRowKeysSet = new Set(allCurrentRowKeys);

      // 当前页中已选中的 key
      const selectedInCurrentData = (tSelectedRowKeys ?? []).filter((key) => allCurrentRowKeysSet.has(key));

      // 跨页保留选中时，不在当前页的已选中数量（用于判断半选）
      const selectedNotInCurrentData = reserveSelectedRowOnPaginate
        ? 0
        : (tSelectedRowKeys ?? []).length - selectedInCurrentData.length;

      const disabledRows =
        currentRows?.filter((row, rowIndex) => isRowSelectedDisabled(selectColumn as any, row, rowIndex)) || [];
      const disabledRowKeys = disabledRows.map((row) => get(row, safeRowKey));
      const selectedDisabledKeys = disabledRowKeys.filter((key) => selectedRowKeysSet.has(key));

      // 全选条件：所有未禁用行都已选中
      const allEnabledSelected = enabledRows.length > 0 && selectedEnabledKeys.length === enabledRows.length;
      // 禁用行全选条件：无禁用行，或所有禁用行都已选中
      const allDisabledSelected =
        disabledRowKeys.length === 0 || selectedDisabledKeys.length === disabledRowKeys.length;

      // 全选框 checked 状态：当前页有数据 + 可选行全选 + 禁用行全选 + 无跨页选中
      const isChecked =
        currentRows.length !== 0 && allEnabledSelected && allDisabledSelected && selectedNotInCurrentData === 0;

      // 半选状态：当前页有数据 + 非全选 + 存在已选中项（当前页或跨页）
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
    const disabled: boolean = typeof col.disabled === 'function' ? col.disabled({ row, rowIndex }) : !!col.disabled;
    const checkProps = isFunction(col.checkProps) ? col.checkProps({ row, rowIndex }) : col.checkProps;
    return {
      disabled: disabled || !!checkProps?.disabled,
      checkProps,
    };
  }

  function renderSelectCell(p: PrimaryTableCellParams<TableRowData>) {
    const { col: column, row = {} } = p;
    const checked = selectedRowKeysSet.has(get(row, safeRowKey));
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
      // 行级半选：由外部传入 indeterminateSelectedRowKeys 控制
      const isIndeterminate = indeterminateSelectedRowKeys?.length
        ? indeterminateSelectedRowKeys.includes(get(row, safeRowKey))
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
    let selectedRowKeys = [...(tSelectedRowKeys ?? [])];
    const rowId = get(row, safeRowKey);
    const selectedRowIndex = selectedRowKeys.indexOf(rowId);
    const isExisted = selectedRowIndex !== -1;
    if (selectColumn?.type === 'multiple') {
      // 多选：已选则移除，未选则追加
      isExisted ? selectedRowKeys.splice(selectedRowIndex, 1) : selectedRowKeys.push(rowId);
    } else if (selectColumn?.type === 'single') {
      // 单选：已选且允许反选则清空，否则选中当前行
      selectedRowKeys = isExisted && allowUncheck ? [] : [rowId];
    } else {
      log.warn('Table', '`column.type` must be one of `multiple` and `single`');
      return;
    }
    setTSelectedRowKeys(selectedRowKeys, {
      selectedRowData: selectedRowKeys
        .map((t) => selectedRowDataMapRef.current.get(t))
        .filter(Boolean) as TableRowData[],
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
    const selectedColIndex = props.columns?.findIndex((item) => item.colKey === 'row-select') ?? -1;
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
      const key = get(data[i], safeRowKey);
      newMap.set(key, data[i]);
    }
    selectedRowDataMapRef.current = newMap;
  }, [data, safeRowKey]);

  return {
    selectedRowClassNames,
    currentPaginateData,
    setCurrentPaginateData,
    setTSelectedRowKeys,
    formatToRowSelectColumn,
    onInnerSelectRowClick,
  };
}
