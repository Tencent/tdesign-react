import React, { useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import isFunction from 'lodash/isFunction';
import { ConfigContext } from '../../config-provider';
import { PrimaryTableCol, DataType } from '../type';
import { PrimaryTableProps } from './Table';
import { Checkbox } from '../../checkbox';
import { Radio } from '../../radio';

type SelectType = PrimaryTableCol['type'];

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
  const isControlled = !!selectedRowKeys;
  const [innerSelectedRowKeys, setInnerSelectedRowKeys] = useState(defaultSelectedRowKeys || []);
  const selectColumn = columns.find((column: PrimaryTableCol) => !!TypeEnum[column.type]);

  useEffect(() => {
    if (isControlled) {
      setInnerSelectedRowKeys(selectedRowKeys);
    }
  }, [selectedRowKeys, isControlled]);

  if (!selectColumn) {
    return [columns];
  }
  const disabledFn = getDisableFn({ selectColumn });
  const titleCheckboxProps = getTitleCheckboxProps({ data, disabledFn, innerSelectedRowKeys, selectColumn, TypeEnum });

  const transformedColumns = columns.map((column: PrimaryTableCol) => {
    const { type, className, width } = column;
    if (!TypeEnum[type]) {
      return column;
    }

    let title: PrimaryTableCol['title'];
    let cell: PrimaryTableCol['cell'];
    const isMultiple = type === TypeEnum.multiple;
    if (isMultiple) {
      title = () => {
        const { indeterminate, checked, disabled } = titleCheckboxProps;
        return (
          <Checkbox
            indeterminate={indeterminate}
            checked={checked}
            disabled={disabled}
            onChange={(checked) => onTitleCheckboxChange(checked)}
          />
        );
      };
      cell = (options) => {
        const { row } = options;
        const currentRowKeyValue = row[rowKey];
        const checked = innerSelectedRowKeys.includes(currentRowKeyValue);
        const disabled = disabledFn(options);

        return (
          <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={(checked) => onRowCheckboxChange(currentRowKeyValue, row, checked)}
          />
        );
      };
    } else {
      cell = (options) => {
        const { row } = options;
        const currentRowKeyValue = row[rowKey];
        const checked = innerSelectedRowKeys.includes(currentRowKeyValue);
        const disabled = disabledFn(options);

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

  function getTitleCheckboxProps({ data, disabledFn, innerSelectedRowKeys, selectColumn, TypeEnum }) {
    if (selectColumn.type !== TypeEnum.multiple) {
      return {
        checked: false,
        indeterminate: false,
        disabled: false,
      };
    }

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

  function onTitleCheckboxChange(checked: boolean) {
    const selectedRowData = [];
    if (checked) {
      data.forEach((dataItem, index) => {
        const isDisabled = disabledFn({ rowIndex: index, row: dataItem });
        const isChecked = innerSelectedRowKeys.includes(dataItem[rowKey]);
        if (!isDisabled || isChecked) {
          selectedRowData.push(dataItem);
        }
      });
    } else {
      data.forEach((dataItem, index) => {
        const isDisabled = disabledFn({ rowIndex: index, row: dataItem });
        const isChecked = innerSelectedRowKeys.includes(dataItem[rowKey]);
        if (isDisabled && isChecked) {
          selectedRowData.push(dataItem);
        }
      });
    }
    const selectedRowKeysNew = selectedRowData.map((record) => record[rowKey]);

    if (!isControlled) {
      setInnerSelectedRowKeys(selectedRowKeysNew);
    }
    isFunction(onSelectChange) && onSelectChange(selectedRowKeysNew, { selectedRowData });
  }

  function onRowCheckboxChange(currentRowKeyValue: string | number, row: DataType, checked: boolean) {
    let selectedRowKeysNew = [];
    if (checked) {
      selectedRowKeysNew = [...innerSelectedRowKeys, currentRowKeyValue];
    } else {
      selectedRowKeysNew = innerSelectedRowKeys.filter((selectRowKey) => selectRowKey !== currentRowKeyValue);
    }
    const selectedRowData = data.filter((dataItem) => selectedRowKeysNew.includes(dataItem[rowKey]));
    if (!isControlled) {
      setInnerSelectedRowKeys(selectedRowKeysNew);
    }
    isFunction(onSelectChange) && onSelectChange(selectedRowKeysNew, { selectedRowData });
  }

  function onRadioChange(currentRowKeyValue: string | number, row: DataType) {
    const selectedRowKeysNew = [currentRowKeyValue];
    const selectedRowData = [row];
    if (!isControlled) {
      setInnerSelectedRowKeys(selectedRowKeysNew);
    }
    isFunction(onSelectChange) && onSelectChange(selectedRowKeysNew, { selectedRowData });
  }

  return [transformedColumns];
}

export default useSelect;
