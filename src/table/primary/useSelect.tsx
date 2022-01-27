import React, { useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import isFunction from 'lodash/isFunction';
import { ConfigContext } from '../../config-provider';
import { PrimaryTableCol, DataType, PrimaryTableRenderParams, SelectOptions, TableRowData } from '../type';
import { PrimaryTableProps } from './Table';
import { Checkbox } from '../../checkbox';
import { Radio } from '../../radio';
import { useEnhancedTableContext } from '../enhanced/TableContext';

type SelectType = PrimaryTableCol['type'];
type CellParams = PrimaryTableRenderParams<DataType>;

const TypeEnum: { [key in SelectType]: SelectType } = {
  single: 'single',
  multiple: 'multiple',
};
const defaultWidth = 50;

/**
 * 选中hook
 */
function useSelect(props: PrimaryTableProps): [PrimaryTableCol[]] {
  const { classPrefix } = useContext(ConfigContext);
  const { columns, data, rowKey, defaultSelectedRowKeys, selectedRowKeys, onSelectChange } = props;
  const { checkStrictly, childrenKey = 'children', useFlattenRowData, getFlattenPageData } = useEnhancedTableContext();
  const isControlled = !!selectedRowKeys;
  const [innerSelectedRowKeys, setInnerSelectedRowKeys] = useState(defaultSelectedRowKeys || []);
  const selectColumn = columns.find((column: PrimaryTableCol) => !!TypeEnum[column.type]);
  const flattenRowData = useFlattenRowData?.(!!selectColumn) || data;

  useEffect(() => {
    if (isControlled) {
      setInnerSelectedRowKeys(selectedRowKeys);
    }
  }, [selectedRowKeys, isControlled]);

  if (!selectColumn) {
    return [columns];
  }

  const disabledFn = getDisableFn({ selectColumn });

  const transformedColumns = columns.map((column: PrimaryTableCol) => {
    const { type, className, width } = column;
    if (!TypeEnum[type]) {
      return column;
    }

    let title;
    let cell: PrimaryTableCol['cell'];
    const isMultiple = type === TypeEnum.multiple;
    if (isMultiple) {
      title = ({ pageData }) => {
        const flattenPageData = getFlattenPageData?.(pageData) || pageData;
        const titleCheckboxProps = getTitleCheckboxProps({
          data: flattenPageData,
          disabledFn,
          innerSelectedRowKeys,
        });
        const { indeterminate, checked, disabled } = titleCheckboxProps;
        return (
          <Checkbox
            indeterminate={indeterminate}
            checked={checked}
            disabled={disabled}
            onChange={(checked) => onTitleCheckboxChange({ flattenPageData, checked })}
          />
        );
      };
      cell = (cellParams: CellParams) => {
        const { checked, disabled, indeterminate } = getCellCheckboxProps({
          cellParams,
          disabledFn,
          innerSelectedRowKeys,
          rowKey,
          checkStrictly,
        });

        return (
          <Checkbox
            checked={checked}
            disabled={disabled}
            indeterminate={indeterminate}
            onChange={(checked) => onRowCheckboxChange({ cellParams, checked, checkStrictly, rowKey })}
          />
        );
      };
    } else {
      cell = (cellParams: CellParams) => {
        const { checked, disabled, currentRowKeyValue, row } = getCellRadioProps({
          cellParams,
          disabledFn,
          innerSelectedRowKeys,
          rowKey,
        });
        return <Radio checked={checked} disabled={disabled} onChange={() => onRadioChange(currentRowKeyValue, row)} />;
      };
    }

    return {
      width: width || defaultWidth,
      title,
      cell,
      style: { padding: '10px 0 10px 24px' },
      className: classnames([`${classPrefix}-table__cell--selectable`, { [`${className}`]: !!className }]),
      ...column,
    };
  });

  function getCellCheckboxProps({ cellParams, disabledFn, innerSelectedRowKeys, rowKey, checkStrictly }) {
    const { row } = cellParams;
    const currentRowKeyValue = row[rowKey];
    const checked = innerSelectedRowKeys.includes(currentRowKeyValue);
    const disabled = disabledFn(cellParams);
    let indeterminate = false;

    if (checkStrictly === false) {
      // 当前row是否包含children，有，且后代有部分选中，为半选
      indeterminate = getCellCheckboxIndeterminate(row, rowKey, innerSelectedRowKeys);
    }

    return {
      checked,
      disabled,
      currentRowKeyValue,
      row,
      indeterminate,
    };
  }

  function getCellCheckboxIndeterminate(row, rowKey, selectedRowKeys) {
    const children = row[childrenKey];
    if (!children || !children.length) return;

    let selectedChildrenRowKeysCount = 0;
    children.forEach((rowItem) => {
      const isSelectedRowKeysHasChildrenRowKeys = selectedRowKeys.includes(rowItem[rowKey]);
      if (isSelectedRowKeysHasChildrenRowKeys) {
        selectedChildrenRowKeysCount += 1;
      }
    });

    const indeterminate = selectedChildrenRowKeysCount && selectedChildrenRowKeysCount < children.length;
    return indeterminate;
  }

  function getCellRadioProps({ cellParams, disabledFn, innerSelectedRowKeys, rowKey }) {
    const { row } = cellParams;
    const currentRowKeyValue = row[rowKey];
    const checked = innerSelectedRowKeys.includes(currentRowKeyValue);
    const disabled = disabledFn(cellParams);

    return {
      checked,
      disabled,
      currentRowKeyValue,
      row,
    };
  }

  function getTitleCheckboxProps({ data, disabledFn, innerSelectedRowKeys }) {
    const { rowKeysExcludeDisabled, isDisabledAll } = getRowKeysExcludeDisabledAndIsDisabledAll({
      data,
      disabledFn,
      innerSelectedRowKeys,
    });
    const innerSelectedRowKeysExcludeDisabled = innerSelectedRowKeys.filter((rowKey) =>
      rowKeysExcludeDisabled.includes(rowKey),
    );
    const checked =
      innerSelectedRowKeysExcludeDisabled.length &&
      innerSelectedRowKeysExcludeDisabled.length === rowKeysExcludeDisabled.length;
    const indeterminate =
      innerSelectedRowKeysExcludeDisabled.length &&
      innerSelectedRowKeysExcludeDisabled.length < rowKeysExcludeDisabled.length;

    return {
      checked,
      indeterminate,
      disabled: isDisabledAll,
    };
  }

  function getDisableFn({ selectColumn }) {
    const { disabled, checkProps } = selectColumn;
    let disabledFn: PrimaryTableCol['disabled'] = () => false;

    if (disabled && isFunction(disabled)) {
      disabledFn = disabled;
    } else if (checkProps) {
      if (isFunction(checkProps)) {
        disabledFn = (options) => checkProps(options)?.disabled;
      } else if (checkProps.disabled) {
        disabledFn = () => checkProps.disabled;
      }
    }
    return disabledFn;
  }

  function getRowKeysExcludeDisabledAndIsDisabledAll({ data, disabledFn, innerSelectedRowKeys }) {
    const dataSelectedDisabled = [];
    const dataDisabled = [];
    const rowKeysExcludeDisabled = [];
    data.forEach((dataItem, index) => {
      const isDisabled = disabledFn({ rowIndex: index, row: dataItem });
      const isChecked = innerSelectedRowKeys.includes(dataItem[rowKey]);
      if (!isDisabled) {
        rowKeysExcludeDisabled.push(dataItem[rowKey]);
      } else {
        dataDisabled.push(dataItem);
      }
      if (isDisabled && isChecked) {
        dataSelectedDisabled.push(dataItem);
      }
    });
    const isDisabledAll = dataDisabled.length === data.length;
    return {
      rowKeysExcludeDisabled,
      isDisabledAll,
    };
  }

  function onTitleCheckboxChange({ flattenPageData, checked }) {
    let selectedRowKeysNew = [];

    if (checked) {
      flattenPageData.forEach((rowItem, index) => {
        const isDisabled = disabledFn({ rowIndex: index, row: rowItem });
        const currentRowKeyValue = rowItem[rowKey];
        const isChecked = innerSelectedRowKeys.includes(currentRowKeyValue);
        if (!isDisabled && !isChecked) {
          selectedRowKeysNew.push(currentRowKeyValue);
        }
      });
      selectedRowKeysNew = [...innerSelectedRowKeys, ...selectedRowKeysNew];
    } else {
      flattenPageData.forEach((rowItem, index) => {
        const isDisabled = disabledFn({ rowIndex: index, row: rowItem });
        const currentRowKeyValue = rowItem[rowKey];
        const isChecked = innerSelectedRowKeys.includes(currentRowKeyValue);
        if (!isDisabled && isChecked) {
          const rowKeyIndex = innerSelectedRowKeys.findIndex((selectedRowKey) => selectedRowKey === currentRowKeyValue);
          innerSelectedRowKeys.splice(rowKeyIndex, 1);
        }
      });
      selectedRowKeysNew = [...innerSelectedRowKeys];
    }

    if (!isControlled) {
      setInnerSelectedRowKeys(selectedRowKeysNew);
    }

    const selectedRowData = flattenRowData.filter((dataItem) => selectedRowKeysNew.includes(dataItem[rowKey]));
    const selectOptions = getSelectOptions({ selectedRowData, checked });
    onSelectChange?.(selectedRowKeysNew, selectOptions);
  }

  function onRowCheckboxChange({ cellParams, checked, checkStrictly, rowKey }) {
    const { row, flattenData } = cellParams;
    const currentRowKeyValue = row[rowKey];
    let selectedRowKeysNew = [];
    if (checked) {
      selectedRowKeysNew = [...innerSelectedRowKeys, currentRowKeyValue];
    } else {
      selectedRowKeysNew = innerSelectedRowKeys.filter((selectRowKey) => selectRowKey !== currentRowKeyValue);
    }

    // 父子级关联选中/取消选中
    if (checkStrictly === false) {
      handleChildrenRowKey(row, selectedRowKeysNew, checked);
      handleParentRowKey(row, selectedRowKeysNew, checked, flattenData);
    }

    if (!isControlled) {
      setInnerSelectedRowKeys(selectedRowKeysNew);
    }

    const selectedRowData = flattenRowData.filter((dataItem) => selectedRowKeysNew.includes(dataItem[rowKey]));
    const selectOptions = getSelectOptions({ selectedRowData, checked, row });
    onSelectChange?.(selectedRowKeysNew, selectOptions);
  }

  // 处理子级的选中与否，即更新selectedRowKeys
  function handleChildrenRowKey(row, selectedRowKeys, checked) {
    const children = row[childrenKey];
    if (!children || !children.length) return;

    const childrenRowKeys = [];
    setChildrenRowKeys(children, rowKey, childrenRowKeys);

    if (childrenRowKeys.length) {
      if (checked) {
        // 当前选中，子孙级全部选中
        childrenRowKeys.forEach((childrenRowKey) => selectedRowKeys.push(childrenRowKey));
      } else {
        // 当前父级不选中，子孙级全部不选中
        childrenRowKeys.forEach((childrenRowKey) => {
          const childrenRowKeyIndex = selectedRowKeys.findIndex((selectedRowKey) => selectedRowKey === childrenRowKey);
          if (childrenRowKeyIndex !== -1) {
            selectedRowKeys.splice(childrenRowKeyIndex, 1);
          }
        });
      }
    }
  }

  // 当前选中，兄弟全部选中时，父级也应选中；当前不选中，父级如果选中，需更新为不选中
  function handleParentRowKey(row, selectedRowKeys, checked, flattenData) {
    const { parentRowKey } = row;
    if (!parentRowKey) return;

    const parentRow = flattenData.find((rowItem) => rowItem[rowKey] === parentRowKey);
    if (checked) {
      // 当前选中，兄弟全部选中时，父级则更新为选中
      const siblingRowKeys = parentRow[childrenKey].map((rowItem) => rowItem[rowKey]);
      const isSelectedRowKeysHasSiblingRowKeys = siblingRowKeys.every((rowKey) => selectedRowKeys.includes(rowKey));
      if (isSelectedRowKeysHasSiblingRowKeys) {
        selectedRowKeys.push(parentRowKey);
      }
    } else {
      // 当前不选中，父级如果选中，则更新为不选中
      const isSelectedRowKeysHasParentRowKey = selectedRowKeys.includes(parentRowKey);
      if (isSelectedRowKeysHasParentRowKey) {
        const parentRowKeyIndex = selectedRowKeys.findIndex((item) => item === parentRowKey);
        if (parentRowKeyIndex !== -1) {
          selectedRowKeys.splice(parentRowKeyIndex, 1);
        }
      }
    }
    handleParentRowKey(parentRow, selectedRowKeys, checked, flattenData);
  }

  function setChildrenRowKeys(children, rowKey, rowKeys) {
    children.forEach((rowItem) => {
      rowKeys.push(rowItem[rowKey]);
      if (rowItem[childrenKey]) {
        setChildrenRowKeys(rowItem[childrenKey], rowKey, rowKeys);
      }
    });
  }

  function onRadioChange(currentRowKeyValue: string | number, row: DataType) {
    const selectedRowKeysNew = [currentRowKeyValue];
    const selectedRowData = [row];
    if (!isControlled) {
      setInnerSelectedRowKeys(selectedRowKeysNew);
    }
    const selectOptions = getSelectOptions({ selectedRowData, checked: true, row });
    onSelectChange?.(selectedRowKeysNew, selectOptions);
  }

  function getSelectOptions({
    selectedRowData,
    checked,
    row,
  }: {
    selectedRowData: TableRowData[];
    checked: boolean;
    row?;
  }): SelectOptions<DataType> {
    return {
      selectedRowData,
      type: checked ? 'check' : 'uncheck',
      ...(row
        ? {
            currentRowData: row,
            currentRowKey: row[rowKey],
          }
        : {}),
    };
  }

  return [transformedColumns];
}

export default useSelect;
