import { ReactElement } from 'react';
import { isPlainObject, get } from 'lodash';
import OptionGroup from '../base/OptionGroup';

import { SelectValue, TdOptionProps, SelectKeysType } from '../type';

type SelectLabeledValue = Required<Omit<TdOptionProps, 'disabled'>>;

// 获取单选的label
export const getLabel = (
  children,
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
  valueType?: 'object' | 'value',
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
            return get(item, keys?.value || 'value') !== get(activeValue, 'value');
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
