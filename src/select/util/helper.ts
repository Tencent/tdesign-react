import { ReactElement } from 'react';
import { SelectValue, LabeledValue } from '../SelectProps';
import types from '../util/types';

export const getLabel = (children, value, options) => {
  let selectedLabel = '';

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
    if (children.type.name === 'OptionGroup') {
      const groupChildren = children.props.children;
      if (Array.isArray(groupChildren)) {
        groupChildren.some((item) => {
          const selectedValue = types.isObject(value) ? value.value : value;
          if (types.isObject(item.props) && item.props.value === selectedValue) {
            selectedLabel = item.props.label;
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
      const { name } = item.type as { name: string };
      if (name === 'OptionGroup') {
        const groupChildren = item.props.children;
        if (Array.isArray(groupChildren)) {
          const isSelected = groupChildren.some((item) => {
            const selectedValue = types.isObject(value) ? value.value : value;
            if (types.isObject(item.props) && item.props.value === selectedValue) {
              selectedLabel = item.props.label;
              return true;
            }
            return false;
          });
          return isSelected;
        }
      }
      const selectedValue = types.isObject(value) ? value.value : value;
      if (types.isObject(item.props) && item.props.value === selectedValue) {
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
    let { label, value } = item as LabeledValue;
    if (types.isNumber(item) || types.isString(item)) {
      label = item.toString();
      value = item as string;
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
      currentValues = currentValues.filter((item: LabeledValue) => {
        if (isValueObj) {
          if (types.isObject(activeValue)) {
            return item.value !== (activeValue as LabeledValue).value;
          }
          return item.value !== activeValue;
        }
        return item !== activeValue;
      });
    } else {
      const label = types.isObject(activeValue) ? (activeValue as LabeledValue).label : activeLabel;
      const item = isValueObj ? { label, value: activeValue } : activeValue;
      currentValues.push(item as SelectValue);
    }
    return currentValues;
  }
  return [];
};
