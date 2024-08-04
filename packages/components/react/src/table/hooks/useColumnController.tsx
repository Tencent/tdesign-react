/**
 * 自定义显示列控制器，即列配置
 */
import React, { useEffect, ChangeEvent, useRef } from 'react';
import { SettingIcon as TdSettingIcon } from 'tdesign-icons-react';
import intersection from 'lodash/intersection';
import xorWith from 'lodash/xorWith';
import classNames from 'classnames';
import Checkbox, { CheckboxGroupValue, CheckboxOptionObj, CheckboxGroupChangeContext } from '../../checkbox';
import { DialogPlugin } from '../../dialog/plugin';
import { renderTitle } from './useTableHeader';
import { PrimaryTableCol, TdPrimaryTableProps } from '../type';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import useControlled from '../../hooks/useControlled';
import { getCurrentRowByKey } from '../utils';
import { DialogInstance } from '../../dialog';
import TButton from '../../button';

const CheckboxGroup = Checkbox.Group;

export function getColumnKeys(columns: PrimaryTableCol[], keys = new Set<string>()) {
  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    col.colKey && keys.add(col.colKey);
    if (col.children?.length) {
      getColumnKeys(col.children, keys);
    }
  }
  return keys;
}

export default function useColumnController(
  props: TdPrimaryTableProps,
  extra?: {
    onColumnReduce?: (reduceKeys: CheckboxGroupValue) => void;
  },
) {
  const { classPrefix, table } = useConfig();
  const { SettingIcon } = useGlobalIcon({ SettingIcon: TdSettingIcon });
  const { columns, columnController, displayColumns = [], columnControllerVisible } = props;
  const dialogInstance = useRef<DialogInstance>();

  const enabledColKeys = (() => {
    const arr = (columnController?.fields || [...getColumnKeys(columns)] || []).filter((v) => v);
    return new Set(arr);
  })();

  const keys = [...getColumnKeys(columns)];

  // 确认后的列配置
  const [tDisplayColumns, setTDisplayColumns] = useControlled(props, 'displayColumns', props.onDisplayColumnsChange);
  // 弹框内的多选
  const defaultColumnCheckboxKeys = displayColumns || props.defaultDisplayColumns || keys;
  // 内部选中的列配置，确认前
  const columnCheckboxKeys = useRef<CheckboxGroupValue>(defaultColumnCheckboxKeys);

  useEffect(() => {
    columnCheckboxKeys.current = [...(displayColumns || props.defaultDisplayColumns || keys)];
    dialogInstance.current?.update({ body: getDialogContent() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayColumns]);

  function getCheckboxOptions(columns: PrimaryTableCol[], arr: CheckboxOptionObj[] = []) {
    // 减少循环次数
    for (let i = 0, len = columns.length; i < len; i++) {
      const item = columns[i];
      if (item.colKey) {
        arr.push({
          label: renderTitle(item, i),
          value: item.colKey,
          disabled: !enabledColKeys.has(item.colKey),
        });
      }
      if (item.children?.length) {
        getCheckboxOptions(item.children, arr);
      }
    }
    return arr;
  }

  const handleCheckChange = (val: CheckboxGroupValue, ctx: CheckboxGroupChangeContext) => {
    columnCheckboxKeys.current = val;
    const params = {
      columns: val,
      type: ctx.type,
      currentColumn: getCurrentRowByKey(columns, String(ctx.current)),
      e: ctx.e,
    };
    props.onColumnChange?.(params);
    dialogInstance.current.update({ body: getDialogContent() });
  };

  const handleClickAllShowColumns = (checked: boolean, ctx: { e: ChangeEvent<HTMLDivElement> }) => {
    if (checked) {
      const checkboxOptions = getCheckboxOptions(columns);
      const newData = checkboxOptions?.map((t) => t.value) || [];
      columnCheckboxKeys.current = newData;
      props.onColumnChange?.({ type: 'check', columns: newData, e: ctx.e });
    } else {
      const disabledColKeys = getCheckboxOptions(columns)
        .filter((t) => t.disabled)
        .map((t) => t.value);
      columnCheckboxKeys.current = disabledColKeys;
      props.onColumnChange?.({ type: 'uncheck', columns: disabledColKeys, e: ctx.e });
    }
    dialogInstance.current.update({ body: getDialogContent() });
  };

  function getDialogContent() {
    const checkboxOptions = getCheckboxOptions(columns);
    const intersectionChecked = intersection(columnCheckboxKeys.current, [...enabledColKeys]);
    const widthMode = columnController?.displayType === 'fixed-width' ? 'fixed' : 'auto';
    const checkedLength = intersectionChecked.length;
    const isCheckedAll = checkedLength === enabledColKeys.size;
    const isIndeterminate = checkedLength > 0 && checkedLength < enabledColKeys.size;
    return (
      <div
        className={classNames([
          `${classPrefix}-table__column-controller`,
          `${classPrefix}-table__column-controller--${widthMode}`,
        ])}
      >
        <div className={`${classPrefix}-table__column-controller-body`}>
          {/* 请选择需要在表格中显示的数据列 */}
          <p className={`${classPrefix}-table__column-controller-desc`}>{table.columnConfigDescriptionText}</p>
          <div className={`${classPrefix}-table__column-controller-block`}>
            <Checkbox indeterminate={isIndeterminate} checked={isCheckedAll} onChange={handleClickAllShowColumns}>
              {table.selectAllText}
            </Checkbox>
          </div>
          <div className={`${classPrefix}-table__column-controller-block`}>
            <CheckboxGroup
              options={checkboxOptions}
              {...(columnController?.checkboxProps || {})}
              value={columnCheckboxKeys.current}
              onChange={handleCheckChange}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleToggleColumnController = () => {
    dialogInstance.current = DialogPlugin.confirm({
      header: table.columnConfigTitleText,
      body: getDialogContent(),
      confirmBtn: table.confirmText,
      cancelBtn: table.cancelText,
      width: 612,
      onConfirm: () => {
        if (columnCheckboxKeys.current.length < displayColumns.length) {
          const reduceKeys = xorWith(displayColumns, columnCheckboxKeys.current);
          extra?.onColumnReduce?.(reduceKeys);
        }
        setTDisplayColumns([...columnCheckboxKeys.current]);
        // 此处逻辑不要随意改动，涉及到 内置列配置按钮 和 不包含列配置按钮等场景
        if (columnControllerVisible === undefined) {
          dialogInstance.current.hide();
        } else {
          props.onColumnControllerVisibleChange?.(false, { trigger: 'cancel' });
        }
      },
      onClose: () => {
        // 此处逻辑不要随意改动，涉及到 内置列配置按钮 和 不包含列配置按钮等场景
        if (columnControllerVisible === undefined) {
          dialogInstance.current.hide();
        } else {
          props.onColumnControllerVisibleChange?.(false, { trigger: 'confirm' });
        }
      },
      ...(columnController?.dialogProps || {}),
    });
  };

  // columnControllerVisible 一般应用于不包含列配置按钮的场景，有外部直接控制弹框的显示或隐藏
  useEffect(
    () => {
      if (columnControllerVisible === undefined) return;
      if (dialogInstance.current) {
        columnControllerVisible ? dialogInstance.current.show() : dialogInstance.current.hide();
      } else {
        columnControllerVisible && handleToggleColumnController();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnControllerVisible, dialogInstance],
  );

  const renderColumnController = () => {
    const isColumnController = !!(columnController && Object.keys(columnController).length);
    const placement = isColumnController ? columnController.placement || 'top-right' : '';
    if (isColumnController && columnController.hideTriggerButton) return null;
    const classes = [
      `${classPrefix}-table__column-controller-trigger`,
      { [`${classPrefix}-align-${placement}`]: !!placement },
    ];
    return (
      <div className={classNames(classes)}>
        <TButton
          theme="default"
          variant="outline"
          onClick={handleToggleColumnController}
          content={table.columnConfigButtonText}
          icon={<SettingIcon />}
          {...props.columnController?.buttonProps}
        ></TButton>
      </div>
    );
  };

  return {
    tDisplayColumns,
    renderColumnController,
  };
}
