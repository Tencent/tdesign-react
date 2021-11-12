import React, { ReactElement } from 'react';
import { isPlainObject, isNumber, isString, get } from 'lodash';
import { SelectValue, Options } from '../../_type/components/select';
import OptionGroup from '../base/OptionGroup';

type SelectLabeledValue = Required<Omit<Options, 'disabled'>>;

export const getLabel = (children, value: SelectValue<Options>, options: Options[]) => {
  let selectedLabel = '';

  // 处理带 options 属性的情况
  if (Array.isArray(options)) {
    options.some((option) => {
      if (option.value === value || option.value === get(value, 'value')) {
        selectedLabel = option.label;
        return true;
      }
      return false;
    });
    return selectedLabel;
  }

  if (isPlainObject(children)) {
    selectedLabel = children.props.label;

    if (children.type.name === OptionGroup.name) {
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
      const { name } = item.type as { name: string };
      if (name === OptionGroup.name) {
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

export const getMultipleTags = (values: SelectValue[]) => {
  const tags = values.map((item) => {
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
  valueType?: 'object' | 'value',
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
};
