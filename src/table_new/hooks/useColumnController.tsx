/**
 * 自定义显示列控制器，即列配置
 */
import React, { useEffect, useState, ChangeEvent } from 'react';
import { SettingIcon } from 'tdesign-icons-react';
import intersection from 'lodash/intersection';
import classNames from 'classnames';
import Checkbox, {
  CheckboxGroup,
  CheckboxGroupValue,
  CheckboxOptionObj,
  CheckboxGroupChangeContext,
} from '../../checkbox';
import { DialogPlugin } from '../../dialog/plugin';
import { renderTitle } from './useTableHeader';
import { PrimaryTableCol, TdPrimaryTableProps } from '../type';
import useConfig from '../../_util/useConfig';
import useDefaultValue from '../../_util/useDefault';
import { getCurrentRowByKey } from '../utils';
import { DialogInstance } from '../../dialog';
import TButton from '../../button';

export function getColumnKeys(columns: PrimaryTableCol[], keys: string[] = []) {
  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    col.colKey && keys.push(col.colKey);
    if (col.children?.length) {
      // eslint-disable-next-line no-param-reassign
      keys = keys.concat(getColumnKeys(col.children, [...keys]));
    }
  }
  return keys;
}

export default function useColumnController(props: TdPrimaryTableProps) {
  const { classPrefix, table } = useConfig();
  const { columns, columnController, displayColumns, columnControllerVisible } = props;
  const [dialogInstance, setDialogInstance] = useState<DialogInstance>(null);

  const enabledColKeys = (() => {
    const arr = (columnController?.fields || [...new Set(getColumnKeys(columns))] || []).filter((v) => v);
    return new Set(arr);
  })();

  const keys = [...new Set(getColumnKeys(columns))];

  // 确认后的列配置
  const [tDisplayColumns, setTDisplayColumns] = useDefaultValue(
    displayColumns,
    props.defaultDisplayColumns || keys,
    props.onDisplayColumnsChange,
  );
  // 弹框内的多选
  const defaultColumnCheckboxKeys = displayColumns || props.defaultDisplayColumns || keys;
  const [columnCheckboxKeys, setColumnCheckboxKeys] = useState<CheckboxGroupValue>(defaultColumnCheckboxKeys);

  const checkboxOptions = getCheckboxOptions(columns);

  const intersectionChecked = intersection(columnCheckboxKeys, [...enabledColKeys]);

  useEffect(() => {
    setColumnCheckboxKeys(displayColumns);
  }, [displayColumns]);

  function getCheckboxOptions(columns: PrimaryTableCol[], arr: CheckboxOptionObj[] = []) {
    // 减少循环次数
    for (let i = 0, len = columns.length; i < len; i++) {
      const item = columns[i];
      if (item.colKey) {
        arr.push({
          label: () => renderTitle(item, i),
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
    setColumnCheckboxKeys(val);
    const params = {
      columns: val,
      type: ctx.type,
      currentColumn: getCurrentRowByKey(columns, String(ctx.current)),
      e: ctx.e,
    };
    props.onColumnChange?.(params);
  };

  const handleClickAllShowColumns = (checked: boolean, ctx: { e: ChangeEvent<HTMLDivElement> }) => {
    if (checked) {
      const newData = columns?.map((t) => t.colKey) || [];
      setColumnCheckboxKeys(newData);
      props.onColumnChange?.({ type: 'check', columns: newData, e: ctx.e });
    } else {
      const disabledColKeys = checkboxOptions.filter((t) => t.disabled).map((t) => t.value);
      setColumnCheckboxKeys(disabledColKeys);
      props.onColumnChange?.({ type: 'uncheck', columns: disabledColKeys, e: ctx.e });
    }
  };

  const handleToggleColumnController = () => {
    const dialogInstanceTmp = DialogPlugin.confirm({
      header: global.value.columnConfigTitleText,
      body: () => {
        const widthMode = columnController?.displayType === 'fixed-width' ? 'fixed' : 'auto';
        const checkedLength = intersectionChecked.length;
        const isCheckedAll = checkedLength === enabledColKeys.size;
        const isIndeterminate = checkedLength > 0 && checkedLength < enabledColKeys.size;
        const defaultNode = (
          <div
            className={classNames([
              `${classPrefix}-table__column-controller`,
              `${classPrefix}-table__column-controller--${widthMode}`,
            ])}
          >
            <div className={`${classPrefix}-table__column-controller-body`}>
              {/* 请选择需要在表格中显示的数据列 */}
              <p className={`${classPrefix}-table__column-controller-desc`}>
                {global.value.columnConfigDescriptionText}
              </p>
              <div className={`${classPrefix}-table__column-controller-block`}>
                <Checkbox indeterminate={isIndeterminate} checked={isCheckedAll} onChange={handleClickAllShowColumns}>
                  {global.value.selectAllText}
                </Checkbox>
              </div>
              <div className={`${classPrefix}-table__column-controller-block`}>
                <CheckboxGroup
                  options={checkboxOptions}
                  {...(columnController?.checkboxProps || {})}
                  value={columnCheckboxKeys}
                  onChange={handleCheckChange}
                />
              </div>
            </div>
          </div>
        );
        return defaultNode;
      },
      confirmBtn: table.confirmText,
      cancelBtn: table.cancelText,
      width: 612,
      onConfirm: () => {
        setTDisplayColumns([...columnCheckboxKeys]);
        // 此处逻辑不要随意改动，涉及到 内置列配置按钮 和 不包含列配置按钮等场景
        if (columnControllerVisible === undefined) {
          dialogInstance.hide();
        } else {
          props.onColumnControllerVisibleChange?.(false, { trigger: 'cancel' });
        }
      },
      onClose: () => {
        // 此处逻辑不要随意改动，涉及到 内置列配置按钮 和 不包含列配置按钮等场景
        if (columnControllerVisible === undefined) {
          dialogInstance.hide();
        } else {
          props.onColumnControllerVisibleChange?.(false, { trigger: 'confirm' });
        }
      },
      ...(columnController?.dialogProps || {}),
    });

    setDialogInstance(dialogInstanceTmp);
  };

  // columnControllerVisible 一般应用于不包含列配置按钮的场景，有外部直接控制弹框的显示或隐藏
  useEffect(
    () => {
      if (columnControllerVisible === undefined) return;
      if (dialogInstance) {
        columnControllerVisible ? dialogInstance.show() : dialogInstance.hide();
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
          content={global.value.columnConfigButtonText}
          v-slots={{
            icon: () => <SettingIcon />,
          }}
          {...props.columnController?.buttonProps}
        ></TButton>
      </div>
    );
  };

  return {
    tDisplayColumns,
    columnCheckboxKeys,
    checkboxOptions,
    renderColumnController,
  };
}
