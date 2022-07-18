// 行选中相关功能：单选 + 多选

import React, { useEffect, useState, MouseEvent } from 'react';
import intersection from 'lodash/intersection';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import useControlled from '../../hooks/useControlled';
import {
  PrimaryTableCellParams,
  PrimaryTableCol,
  RowClassNameParams,
  TableRowData,
  TdBaseTableProps,
  TdPrimaryTableProps,
} from '../type';
import { filterDataByIds, isRowSelectedDisabled } from '../utils';
import { TableClassName } from './useClassName';
import Checkbox from '../../checkbox';
import Radio from '../../radio';
import { ClassName } from '../../common';
import log from '../../_common/js/log';

export default function useRowSelect(
  props: TdPrimaryTableProps,
  tableSelectedClasses: TableClassName['tableSelectedClasses'],
) {
  const { selectedRowKeys, columns, data, rowKey, indeterminateSelectedRowKeys } = props;
  const [selectedRowClassNames, setSelectedRowClassNames] = useState<TdBaseTableProps['rowClassName']>();
  const [tSelectedRowKeys, setTSelectedRowKeys] = useControlled(props, 'selectedRowKeys', props.onSelectChange, {
    defaultSelectedRowKeys: props.defaultSelectedRowKeys || [],
  });
  const selectColumn = props.columns.find(({ type }) => ['multiple', 'single'].includes(type));
  const canSelectedRows = props.data.filter((row, rowIndex): boolean => !isDisabled(row, rowIndex));
  // 选中的行，和所有可以选择的行，交集，用于计算 isSelectedAll 和 isIndeterminate
  const intersectionKeys = intersection(
    tSelectedRowKeys,
    canSelectedRows.map((t) => get(t, rowKey || 'id')),
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

  function getSelectedHeader() {
    const isIndeterminate = intersectionKeys.length > 0 && intersectionKeys.length < canSelectedRows.length;
    const isChecked =
      intersectionKeys.length !== 0 &&
      canSelectedRows.length !== 0 &&
      intersectionKeys.length === canSelectedRows.length;
    return () => (
      <Checkbox
        checked={isChecked}
        indeterminate={isIndeterminate}
        disabled={!canSelectedRows.length}
        onChange={handleSelectAll}
      />
    );
  }

  function renderSelectCell(p: PrimaryTableCellParams<TableRowData>) {
    const { col: column, row = {}, rowIndex } = p;
    const checked = tSelectedRowKeys.includes(get(row, rowKey || 'id'));
    const disabled: boolean =
      typeof column.disabled === 'function' ? column.disabled({ row, rowIndex }) : column.disabled;
    const checkProps = isFunction(column.checkProps) ? column.checkProps({ row, rowIndex }) : column.checkProps;
    const selectBoxProps = {
      checked,
      disabled,
      ...checkProps,
      onChange: () => {
        handleSelectChange(row);
      },
    };
    // 选中行功能中，点击 checkbox/radio 需阻止事件冒泡，避免触发不必要的 onRowClick
    const onCheckClick = (e: MouseEvent<HTMLLabelElement>) => {
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

  function handleSelectChange(row: TableRowData = {}) {
    let selectedRowKeys = [...tSelectedRowKeys];
    const reRowKey = rowKey || 'id';
    const id = get(row, reRowKey);
    const selectedRowIndex = selectedRowKeys.indexOf(id);
    const isExisted = selectedRowIndex !== -1;
    if (selectColumn.type === 'multiple') {
      isExisted ? selectedRowKeys.splice(selectedRowIndex, 1) : selectedRowKeys.push(id);
    } else if (selectColumn.type === 'single') {
      selectedRowKeys = !isExisted ? [id] : [];
    } else {
      log.warn('Table', '`column.type` must be one of `multiple` and `single`');
      return;
    }
    setTSelectedRowKeys(selectedRowKeys, {
      selectedRowData: filterDataByIds(props.data, selectedRowKeys, reRowKey),
      currentRowKey: id,
      currentRowData: row,
      type: isExisted ? 'uncheck' : 'check',
    });
  }

  function handleSelectAll(checked: boolean) {
    const reRowKey = rowKey || 'id';
    const canSelectedRowKeys = canSelectedRows.map((record) => get(record, reRowKey));
    const disabledSelectedRowKeys = selectedRowKeys?.filter((id) => !canSelectedRowKeys.includes(id)) || [];
    const allIds = checked ? [...disabledSelectedRowKeys, ...canSelectedRowKeys] : [...disabledSelectedRowKeys];
    setTSelectedRowKeys(allIds, {
      selectedRowData: checked ? filterDataByIds(props.data, allIds, reRowKey) : [],
      type: checked ? 'check' : 'uncheck',
      currentRowKey: 'CHECK_ALL_BOX',
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
      title: col.type === 'multiple' ? getSelectedHeader() : '',
    };
  }

  return {
    selectedRowClassNames,
    formatToRowSelectColumn,
  };
}
