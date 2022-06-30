// 行选中相关功能：单选 + 多选

import React, { useEffect, useState, MouseEvent, useMemo } from 'react';
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
  TdEnhancedTableProps,
} from '../type';
import { filterDataByIds, isRowSelectedDisabled } from '../utils';
import useClassName from './useClassName';
import Checkbox from '../../checkbox';
import Radio from '../../radio';
import { ClassName } from '../../common';
import log from '../../_common/js/log';
import { useDeepCompareMemo } from '../../hooks/useDeepCompareMemo';

export default function useRowSelect(props: TdEnhancedTableProps) {
  const { selectedRowKeys, columns, data, rowKey, tree } = props;
  const { tableSelectedClasses } = useClassName();
  const [selectedRowClassNames, setSelectedRowClassNames] = useState<TdBaseTableProps['rowClassName']>();
  const [tSelectedRowKeys, setTSelectedRowKeys] = useControlled(props, 'selectedRowKeys', props.onSelectChange);
  const selectColumn = props.columns.find(({ type }) => ['multiple', 'single'].includes(type));

  const rowDataKeys = useMemo(
    () => ({
      rowKey: rowKey || 'id',
      childrenKey: tree?.childrenKey || 'children',
    }),
    [rowKey, tree?.childrenKey],
  );

  // 是否为树状表格
  const isTree = tree && Object.keys(tree).length;

  const canSelectedRows = useDeepCompareMemo(
    () => data.filter((row, rowIndex): boolean => !isDisabled(row, rowIndex)),
    [data, isTree],
  );

  // 选中的行，和所有可以选择的行，交集，用于计算 isSelectedAll 和 isIndeterminate
  const intersectionKeys = intersection(
    tSelectedRowKeys,
    canSelectedRows.map((t) => get(t, rowDataKeys.rowKey)),
  );

  useEffect(
    () => {
      if (!selectColumn && (!tSelectedRowKeys || !tSelectedRowKeys.length)) return;
      const disabledRowFunc = (p: RowClassNameParams<TableRowData>): ClassName =>
        selectColumn.disabled(p) ? tableSelectedClasses.disabled : '';
      const disabledRowClass = selectColumn?.disabled ? disabledRowFunc : undefined;
      const selected = new Set(tSelectedRowKeys);
      const selectedRowClassFunc = ({ row }: RowClassNameParams<TableRowData>) => {
        const rowId = get(row, rowDataKeys.rowKey);
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

    return () => (
      <Checkbox
        checked={intersectionKeys.length === canSelectedRows.length}
        indeterminate={isIndeterminate}
        disabled={!canSelectedRows.length}
        onChange={handleSelectAll}
      />
    );
  }

  function renderSelectCell(p: PrimaryTableCellParams<TableRowData>) {
    const { col: column, row = {}, rowIndex } = p;
    let checked = tSelectedRowKeys.includes(get(row, rowDataKeys.rowKey));
    const disabled: boolean =
      typeof column.disabled === 'function' ? column.disabled({ row, rowIndex }) : column.disabled;
    const checkProps = isFunction(column.checkProps) ? column.checkProps({ row, rowIndex }) : column.checkProps;
    // 树状选择状态处理
    let childIsIndeterminate;
    if (isTree) {
      const childCanSelectedRows = (get(row, rowDataKeys.childrenKey) || []).filter(
        (r, rIndex) => !isDisabled(r, rIndex),
      );
      const childIntersectionKeys = intersection(
        tSelectedRowKeys,
        childCanSelectedRows.map((t) => get(t, rowDataKeys.rowKey)),
      );
      childIsIndeterminate =
        childIntersectionKeys.length > 0 && childIntersectionKeys.length < childCanSelectedRows.length;
      if (childIntersectionKeys.length === childCanSelectedRows.length && childIntersectionKeys.length > 0) {
        checked = true;
      }
    }
    // const isIndeterminate = intersectionKeys.length > 0 && intersectionKeys.length < canSelectedRows.length;
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
    if (column.type === 'multiple')
      return <Checkbox {...selectBoxProps} indeterminate={childIsIndeterminate} onClick={onCheckClick} />;
    return null;
  }

  function handleSelectChange(row: TableRowData = {}) {
    let selectedRowKeys = [...tSelectedRowKeys];
    const id = get(row, rowDataKeys.rowKey);
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
      selectedRowData: filterDataByIds(props.data, selectedRowKeys, rowDataKeys.rowKey),
      currentRowKey: id,
      currentRowData: row,
      type: isExisted ? 'uncheck' : 'check',
    });
  }

  function handleSelectAll(checked: boolean) {
    const canSelectedRowKeys = canSelectedRows.map((record) => get(record, rowDataKeys.rowKey));
    const disabledSelectedRowKeys = selectedRowKeys?.filter((id) => !canSelectedRowKeys.includes(id)) || [];
    const allIds = checked ? [...disabledSelectedRowKeys, ...canSelectedRowKeys] : [...disabledSelectedRowKeys];
    setTSelectedRowKeys(allIds, {
      selectedRowData: filterDataByIds(props.data, allIds, rowDataKeys.rowKey),
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
      cell: (p: PrimaryTableCellParams<TableRowData>) => renderSelectCell(p),
      title: col.type === 'multiple' ? getSelectedHeader() : '',
    };
  }

  return {
    selectedRowClassNames,
    formatToRowSelectColumn,
  };
}
