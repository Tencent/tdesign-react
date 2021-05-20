import { ReactElement } from 'react';
import { isPlainObject, isNumber, isString } from 'lodash';
import { SelectLabeledValue } from '../SelectProps';
import { SelectValue } from '../../_type/components/select';

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

  if (isPlainObject(children)) {
    selectedLabel = children.props.label;
    if (children.type.name === 'OptionGroup') {
      const groupChildren = children.props.children;
      if (Array.isArray(groupChildren)) {
        groupChildren.some((item) => {
          const selectedValue = isPlainObject(value) ? value.value : value;
          if (isPlainObject(item.props) && item.props.value === selectedValue) {
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
            const selectedValue = isPlainObject(value) ? value.value : value;
            if (isPlainObject(item.props) && item.props.value === selectedValue) {
              selectedLabel = item.props.label;
              return true;
            }
            return false;
          });
          return isSelected;
        }
      }
      const selectedValue = isPlainObject(value) ? value.value : value;
      if (isPlainObject(item.props) && item.props.value === selectedValue) {
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

  if (isPlainObject(children)) {
    selectedValue = children.props.value;
  }

  if (Array.isArray(children)) {
    children.some((item: ReactElement) => {
      if (isPlainObject(item.props) && !item.props.disabled && item.props.label === label) {
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
    let { label, value } = item as SelectLabeledValue;
    if (isNumber(item) || isString(item)) {
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
  activeLabel?: React.ReactNode,
  selected?: boolean,
) => {
  if (Array.isArray(values)) {
    let currentValues = [...values];
    const isValueObj = isPlainObject(currentValues[0]);
    if (selected) {
      currentValues = currentValues.filter((item: SelectLabeledValue) => {
        if (isValueObj) {
          if (isPlainObject(activeValue)) {
            return item.value !== (activeValue as SelectLabeledValue).value;
          }
          return item.value !== activeValue;
        }
        return item !== activeValue;
      });
    } else {
      const label = isPlainObject(activeValue) ? (activeValue as SelectLabeledValue).label : activeLabel;
      const item = isValueObj ? { label, value: activeValue } : activeValue;
      currentValues.push(item as SelectValue);
    }
    return currentValues;
  }
  return [];
};
