import { ReactElement } from 'react';
import { SelectValue } from '../SelectProps';
import types from '../util/types';

export const getLabel = (children, value, optionGroup, options) => {
  let selectedLabel = '';
  // 处理有分组的情况
  if (optionGroup) {
    optionGroup.some((group) => {
      const selected = group.options.some((option) => {
        if (option.value === value || option.value === value.value) {
          selectedLabel = option.label;
          return true;
        }
        return false;
      });
      return selected;
    });
    return selectedLabel;
  }

  // 处理带 options 属性的情况
  if (Array.isArray(options)) {
    options.some((option) => {
      if (option.value === value || option.value === value.value) {
        selectedLabel = option.label;
        return true;
      }
      return false;
    });
    return selectedLabel;
  }

  if (types.isObject(children)) {
    selectedLabel = children.props.label;
  }
  if (Array.isArray(children)) {
    children.some((item: ReactElement) => {
      if (types.isObject(item.props) && item.props.value === value) {
        selectedLabel = item.props.label;
        return true;
      }
      return false;
    });
  }
  return selectedLabel;
};

export const getValue = (children, label) => {
  let selectedValue = '';

  if (types.isObject(children)) {
    selectedValue = children.props.value;
  }

  if (Array.isArray(children)) {
    children.some((item: ReactElement) => {
      if (types.isObject(item.props) && !item.props.disabled && item.props.label === label) {
        selectedValue = item.props.value;
        return true;
      }
      return false;
    });
  }
  return selectedValue;
};

export const getMultipleTags = (value: SelectValue[]) => {
  const tags = value.map((item) => {
    let { label, value } = item;
    if (types.isNumber(item) || types.isString(item)) {
      label = item.toString();
      value = item;
    }
    return {
      label,
      value,
    };
  });
  return tags;
};

export const getSelectValueArr = (
  values: SelectValue | SelectValue[],
  activeValue: SelectValue,
  activeLabel?: string | number,
  selected?: boolean,
) => {
  if (Array.isArray(values)) {
    let currentValues = [...values];
    const isValueObj = types.isObject(currentValues[0]);
    if (selected) {
      currentValues = currentValues.filter((item) => {
        if (isValueObj) {
          if (types.isObject(activeValue)) {
            return item.value !== activeValue.value;
          }
          return item.value !== activeValue;
        }
        return item !== activeValue;
      });
    } else {
      const label = types.isObject(activeValue) ? activeValue.label : activeLabel;
      const item = isValueObj ? { label, value: activeValue } : activeValue;
      currentValues.push(item);
    }
    return currentValues;
  }
  return [];
};
