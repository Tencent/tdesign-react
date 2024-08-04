import { ReactElement } from 'react';
import isPlainObject from 'lodash/isPlainObject';
import get from 'lodash/get';
import OptionGroup from '../base/OptionGroup';
import Option from '../base/Option';

import { SelectValue, TdOptionProps, SelectKeysType, TdSelectProps } from '../type';

type SelectLabeledValue = Required<Omit<TdOptionProps, 'disabled'>>;

type ValueToOption = {
  [value: string | number]: TdOptionProps;
};

function setValueToOptionFormOptionDom(dom: ReactElement, valueToOption: ValueToOption, keys: SelectKeysType) {
  const { value, label, children } = dom.props;
  // eslint-disable-next-line no-param-reassign
  valueToOption[value] = {
    [keys?.value || 'value']: value,
    [keys?.label || 'label']: label || children || value,
  };
}

// 获取 value => option，用于快速基于 value 找到对应的 option
export const getValueToOption = (
  children: ReactElement,
  options: TdOptionProps[],
  keys: SelectKeysType,
): ValueToOption => {
  const valueToOption = {};

  // options 优先级高于 children
  if (Array.isArray(options)) {
    options.forEach((option) => {
      valueToOption[get(option, keys?.value || 'value')] = option;
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

  if (Array.isArray(children)) {
    children.forEach((item: ReactElement) => {
      if (item.type === Option) {
        setValueToOptionFormOptionDom(item, valueToOption, keys);
      }

      if (item.type === OptionGroup) {
        const groupChildren = item.props.children;
        if (Array.isArray(groupChildren)) {
          groupChildren.forEach((groupItem) => {
            setValueToOptionFormOptionDom(groupItem, valueToOption, keys);
          });
        }
      }
    });
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
  let selectedLabel = '';
  // 处理带 options 属性的情况
  if (Array.isArray(options)) {
    options.some((option) => {
      if ([get(value, keys?.value || 'value'), value].includes(option.value)) {
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
  const tags = values.map((item) => ({
    label: get(item, keys?.label || 'label') || item.toString(),
    value: get(item, keys?.value || 'value') || item,
  }));
  return tags;
};

export const getSelectValueArr = (
  values: SelectValue | SelectValue[],
  activeValue: SelectValue,
  selected?: boolean,
  valueType?: TdSelectProps['valueType'],
  keys?: SelectKeysType,
  objVal?: SelectValue,
) => {
  // eslint-disable-next-line no-param-reassign
  values = Array.isArray(values) ? values : [];

  if (Array.isArray(values)) {
    let currentValues = [...values];
    const isValueObj = valueType === 'object';
    if (selected) {
      currentValues = currentValues.filter((item: SelectLabeledValue) => {
        if (isValueObj) {
          if (isPlainObject(activeValue)) {
            return get(item, keys?.value || 'value') !== get(activeValue, keys?.value || 'value');
          }
          return get(item, keys?.value || 'value') !== activeValue;
        }
        return item !== activeValue;
      });
    } else {
      const item = isValueObj ? objVal : activeValue;

      currentValues.push(item as SelectValue);
    }
    return currentValues;
  }
};

// 计算onChange事件回调的selectedOptions参数
export const getSelectedOptions = (
  value: SelectValue,
  multiple: TdSelectProps['multiple'],
  valueType: TdSelectProps['valueType'],
  keys: SelectKeysType,
  tmpPropOptions: Array<unknown>,
) => {
  const isObjectType = valueType === 'object';
  let currentSelectedOptions = [];
  if (multiple) {
    currentSelectedOptions = isObjectType
      ? (value as Array<string | number>)
      : tmpPropOptions?.filter?.((v) => (value as Array<string | number>).includes?.(v[keys?.value || 'value']));
  } else {
    currentSelectedOptions = isObjectType
      ? [value]
      : tmpPropOptions?.filter?.((v) => value === v[keys?.value || 'value']) || [];
  }
  return currentSelectedOptions;
};
