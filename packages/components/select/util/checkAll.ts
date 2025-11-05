import { get } from 'lodash-es';
import { isSelectOptionGroup } from '../hooks/useOptions';
import { getKeyMapping, valueIsObject } from './helper';

import type { SelectKeysType, SelectOption, SelectValue, TdSelectProps } from '../type';

/**
 * 获取所有可选的选项（排除 checkAll 和 disabled 的选项）
 */
export function getEnabledOptions(currentOptions: SelectOption[], keys: SelectKeysType): SelectOption[] {
  const { disabledKey } = getKeyMapping(keys);
  const enabledOptions: SelectOption[] = [];

  currentOptions.forEach((option) => {
    if (isSelectOptionGroup(option)) {
      option.children?.forEach((item) => {
        if (!item.checkAll && !item[disabledKey]) {
          enabledOptions.push(item);
        }
      });
    } else if (!option.checkAll && !option[disabledKey]) {
      enabledOptions.push(option);
    }
  });

  return enabledOptions;
}

/**
 * 获取已选中的禁用选项
 */
export function getDisabledSelectedOptions(
  currentOptions: SelectOption[],
  value: SelectValue,
  keys: SelectKeysType,
  valueType: TdSelectProps['valueType'],
): SelectOption[] {
  const { valueKey } = getKeyMapping(keys);
  const isValObj = valueIsObject(valueType);
  const currentValues = Array.isArray(value) ? value : [];
  const disabledSelectedOptions: SelectOption[] = [];

  const isDisabledAndSelected = (opt: SelectOption) => {
    if (opt.checkAll || !opt.disabled) return false;
    if (isValObj) return currentValues.some((v) => get(v, valueKey) === opt[valueKey]);
    return currentValues.includes(opt[valueKey]);
  };

  currentOptions.forEach((opt) => {
    if (isSelectOptionGroup(opt)) {
      opt.children?.forEach((item) => {
        if (isDisabledAndSelected(item)) {
          disabledSelectedOptions.push(item);
        }
      });
    } else if (isDisabledAndSelected(opt)) {
      disabledSelectedOptions.push(opt);
    }
  });

  return disabledSelectedOptions;
}

/**
 * 获取已选中的可选项数量
 */
export function getEnabledSelectedCount(
  currentOptions: SelectOption[],
  value: SelectValue,
  keys: SelectKeysType,
  valueType: TdSelectProps['valueType'],
): number {
  const { valueKey } = getKeyMapping(keys);
  const isValObj = valueIsObject(valueType);
  const currentValues = Array.isArray(value) ? value : [];

  let enabledSelectedCount = 0;
  currentOptions.forEach((opt) => {
    if (isSelectOptionGroup(opt)) {
      opt.children?.forEach((child) => {
        if (!child.checkAll && !child.disabled) {
          const childValue = get(child, valueKey);
          const isSelected = isValObj
            ? currentValues.some((v) => get(v, valueKey) === childValue)
            : currentValues.includes(childValue);
          if (isSelected) {
            enabledSelectedCount += 1;
          }
        }
      });
    } else if (!opt.checkAll && !opt.disabled) {
      const optValue = get(opt, valueKey);
      const isSelected = isValObj
        ? currentValues.some((v) => get(v, valueKey) === optValue)
        : currentValues.includes(optValue);
      if (isSelected) {
        enabledSelectedCount += 1;
      }
    }
  });

  return enabledSelectedCount;
}

/**
 * 判断是否全选
 */
export function isAllSelected(
  currentOptions: SelectOption[],
  value: SelectValue,
  keys: SelectKeysType,
  valueType: TdSelectProps['valueType'],
): boolean {
  const enabledOptions = getEnabledOptions(currentOptions, keys);
  const enabledSelectedCount = getEnabledSelectedCount(currentOptions, value, keys, valueType);
  return enabledOptions.length > 0 && enabledSelectedCount === enabledOptions.length;
}
