import { ReactElement } from 'react';
import { get, isPlainObject } from 'lodash-es';
import Option from '../base/Option';
import OptionGroup from '../base/OptionGroup';
import { isSelectOptionGroup } from '../hooks/useOptions';

import type { SelectKeysType, SelectOption, SelectValue, TdOptionProps, TdSelectProps } from '../type';

type SelectLabeledValue = Required<Omit<TdOptionProps, 'disabled'>>;

export type ValueToOption = {
  [value: string | number]: TdOptionProps;
};

export const getKeyMapping = (keys: SelectKeysType) => {
  const valueKey = keys?.value || 'value';
  const labelKey = keys?.label || 'label';
  const disabledKey = keys?.disabled || 'disabled';
  return { valueKey, labelKey, disabledKey };
};

export const setValueToOptionFormOptionDom = (
  dom: ReactElement,
  valueToOption: ValueToOption,
  keys: SelectKeysType,
) => {
  const { valueKey, labelKey } = getKeyMapping(keys);
  const { value, label, children } = dom.props;
  // eslint-disable-next-line no-param-reassign
  valueToOption[value] = {
    ...dom.props,
    [valueKey]: value,
    [labelKey]: label || children || value,
  };
};

// 获取 value => option，用于快速基于 value 找到对应的 option
export const getValueToOption = (
  children: ReactElement,
  options: SelectOption[],
  keys: SelectKeysType,
): ValueToOption => {
  const { valueKey, labelKey } = getKeyMapping(keys);
  const valueToOption = {};

  // options 优先级高于 children
  if (Array.isArray(options)) {
    options.forEach((option) => {
      if (isSelectOptionGroup(option)) {
        option.children?.forEach((child) => {
          valueToOption[get(child, valueKey)] = {
            ...child,
            value: get(child, valueKey),
            label: get(child, labelKey),
          };
        });
      } else {
        valueToOption[get(option, valueKey)] = {
          ...option,
          value: get(option, valueKey),
          label: get(option, labelKey),
        };
      }
    });
    return valueToOption;
  }

  if (isPlainObject(children)) {
    if (children.type === Option) {
      setValueToOptionFormOptionDom(children, valueToOption, keys);
      return valueToOption;
    }

    if (children.type === OptionGroup) {
      const groupChildren = children.props.children;

      if (Array.isArray(groupChildren)) {
        groupChildren.forEach((item) => {
          setValueToOptionFormOptionDom(item, valueToOption, keys);
        });
        return valueToOption;
      }
    }
  }

  /**
   * children如果存在ReactElement和map函数混写的情况，会出现嵌套数组
   */
  if (Array.isArray(children)) {
    const handlerElement = (item: ReactElement) => {
      if (item.type === Option) {
        setValueToOptionFormOptionDom(item, valueToOption, keys);
      }

      if (item.type === OptionGroup) {
        const groupChildren = (item.props as SelectOption).children;
        if (Array.isArray(groupChildren)) {
          groupChildren.forEach((groupItem) => {
            setValueToOptionFormOptionDom(groupItem, valueToOption, keys);
          });
        }
      }

      if (Array.isArray(item)) {
        item.forEach((child) => {
          handlerElement(child);
        });
      }
    };
    children.forEach((item: ReactElement) => handlerElement(item));
  }

  return valueToOption;
};

// 获取单选的 label
export const getLabel = (
  children: ReactElement,
  value: SelectValue<TdOptionProps>,
  options: TdOptionProps[],
  keys: SelectKeysType,
) => {
  const { valueKey } = getKeyMapping(keys);

  let selectedLabel = '';
  // 处理带 options 属性的情况
  if (Array.isArray(options)) {
    options.some((option) => {
      if ([get(value, valueKey), value].includes(option.value)) {
        selectedLabel = option.label;
        return true;
      }
      return false;
    });

    return selectedLabel;
  }

  if (isPlainObject(children)) {
    selectedLabel = children.props.label;

    if (children.type === OptionGroup) {
      const groupChildren = children.props.children;

      if (Array.isArray(groupChildren)) {
        groupChildren.some((item) => {
          const selectedValue = isPlainObject(value) ? get(value, 'value') : value;
          if (isPlainObject(item.props) && item.props.value === selectedValue) {
            selectedLabel = item.props.label || item.props.children;
            return true;
          }
          return false;
        });
      }
    }
  }

  if (Array.isArray(children)) {
    children.some((item: ReactElement) => {
      // 处理分组
      if (item.type === OptionGroup) {
        const groupChildren = item.props.children;
        if (Array.isArray(groupChildren)) {
          const isSelected = groupChildren.some((item) => {
            const selectedValue = isPlainObject(value) ? get(value, 'value') : value;
            if (isPlainObject(item.props) && item.props.value === selectedValue) {
              selectedLabel = item.props.label || item.props.children;
              return true;
            }
            return false;
          });
          return isSelected;
        }
      }
      const selectedValue = isPlainObject(value) ? get(value, 'value') : value;
      if (isPlainObject(item.props) && item.props.value === selectedValue) {
        selectedLabel = item.props.label || item.props.children;
        return true;
      }
      return false;
    });
  }

  return selectedLabel;
};

export const getMultipleTags = (values: SelectValue[], keys: SelectKeysType) => {
  const { labelKey, valueKey } = getKeyMapping(keys);
  const tags = values.map((item) => ({
    label: get(item, labelKey) || item.toString(),
    value: get(item, valueKey) || item,
  }));
  return tags;
};

/**
 * 计算多选时的 `value` 数组
 */
export const getSelectValueArr = (
  values: SelectValue | SelectValue[],
  activeValue: SelectValue,
  selected?: boolean,
  valueType?: TdSelectProps['valueType'],
  keys?: SelectKeysType,
  objVal?: SelectValue,
) => {
  const { valueKey } = getKeyMapping(keys);
  // eslint-disable-next-line no-param-reassign
  values = Array.isArray(values) ? values : [];

  if (Array.isArray(values)) {
    let currentValues = [...values];
    const isObjectType = valueType === 'object';
    if (selected) {
      currentValues = currentValues.filter((item: SelectLabeledValue) => {
        if (isObjectType) {
          if (isPlainObject(activeValue)) {
            return get(item, valueKey) !== get(activeValue, valueKey);
          }
          return get(item, valueKey) !== activeValue;
        }
        return item !== activeValue;
      });
    } else {
      const item = isObjectType ? objVal : activeValue;

      currentValues.push(item as SelectValue);
    }
    return currentValues;
  }
};

/**
 * 计算 `onChange` 事件回调的 `selectedOptions` 参数
 * @param value 所有已选中的值
 * @param selectedValue 当前选择/取消选择的特定选项
 */
export const getSelectedOptions = (
  value: SelectValue,
  multiple: TdSelectProps['multiple'],
  valueType: TdSelectProps['valueType'],
  keys: SelectKeysType,
  valueToOption: ValueToOption,
  selectedValue?: SelectValue,
) => {
  const { valueKey } = getKeyMapping(keys);
  const isObjectType = valueType === 'object';

  // 所有可选项
  const tmpPropOptions = Object.values(valueToOption);

  // 当前所有选中的选项
  let currentSelectedOptions = [];
  // 当前选中的选项
  let currentOption: SelectOption;
  // 全选值
  let allSelectedValue: Array<SelectValue>;

  if (multiple) {
    currentSelectedOptions = isObjectType
      ? (value as Array<SelectValue>)
      : tmpPropOptions?.filter?.((v) => (value as Array<string | number>).includes?.(v[valueKey]));

    allSelectedValue = isObjectType ? currentSelectedOptions : currentSelectedOptions?.map((v) => v[valueKey]);

    currentOption = isObjectType
      ? (value as Array<SelectValue>).find((v) => v[valueKey] === selectedValue)
      : currentSelectedOptions?.find((option) => option[valueKey] === selectedValue);
  } else {
    currentSelectedOptions = isObjectType ? [value] : tmpPropOptions?.filter?.((v) => value === v[valueKey]) || [];
    allSelectedValue = currentSelectedOptions;
    currentOption = isObjectType ? value : currentSelectedOptions?.find((option) => option[valueKey] === selectedValue);
  }

  return { currentSelectedOptions, currentOption, allSelectedValue };
};
