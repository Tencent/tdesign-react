import { ReactElement } from 'react';
import { isPlainObject, get } from 'lodash-es';
import OptionGroup from '../base/OptionGroup';
import Option from '../base/Option';

import { SelectValue, TdOptionProps, SelectKeysType, TdSelectProps, SelectOption, SelectOptionGroup } from '../type';

type SelectLabeledValue = Required<Omit<TdOptionProps, 'disabled'>>;

type ValueToOption = {
  [value: string | number]: TdOptionProps;
};

function setValueToOptionFormOptionDom(dom: ReactElement<any>, valueToOption: ValueToOption, keys: SelectKeysType) {
  const { value, label, children } = dom.props;
  // eslint-disable-next-line no-param-reassign
  valueToOption[value] = {
    ...dom.props,
    [keys?.value || 'value']: value,
    [keys?.label || 'label']: label || children || value,
  };
}

// 获取 value => option，用于快速基于 value 找到对应的 option
export const getValueToOption = (
  children: ReactElement<any>,
  options: TdOptionProps[],
  keys: SelectKeysType,
): ValueToOption => {
  const valueToOption = {};

  // options 优先级高于 children
  if (Array.isArray(options)) {
    options.forEach((option) => {
      if ((option as SelectOptionGroup).group) {
        (option as SelectOptionGroup)?.children?.forEach((child) => {
          valueToOption[get(child, keys?.value || 'value')] = {
            ...child,
            value: get(child, keys?.value || 'value'),
            label: get(child, keys?.label || 'label'),
          };
        });
      } else {
        valueToOption[get(option, keys?.value || 'value')] = {
          ...option,
          value: get(option, keys?.value || 'value'),
          label: get(option, keys?.label || 'label'),
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
  children: ReactElement<any>,
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
    children.some((item: ReactElement<any>) => {
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
  valueToOption: ValueToOption,
  selectedValue?: SelectValue,
) => {
  const isObjectType = valueType === 'object';
  // 当前所有选中的选项
  let currentSelectedOptions = [];
  // 当前选中的选项
  let currentOption: SelectOption;
  // 全选值
  let allSelectedValue: Array<SelectValue>;
  // 所有可选项
  const tmpPropOptions = Object.values(valueToOption);
  if (multiple) {
    currentSelectedOptions = isObjectType
      ? (value as Array<SelectValue>)
      : tmpPropOptions?.filter?.((v) => (value as Array<string | number>).includes?.(v[keys?.value || 'value']));

    allSelectedValue = isObjectType
      ? currentSelectedOptions
      : currentSelectedOptions?.map((v) => v[keys?.value || 'value']);

    currentOption = isObjectType
      ? (value as Array<SelectValue>).find((v) => v[keys?.value || 'value'] === selectedValue)
      : currentSelectedOptions?.find((option) => option[keys?.value || 'value'] === selectedValue);
  } else {
    currentSelectedOptions = isObjectType
      ? [value]
      : tmpPropOptions?.filter?.((v) => value === v[keys?.value || 'value']) || [];
    allSelectedValue = currentSelectedOptions;
    currentOption = isObjectType
      ? value
      : currentSelectedOptions?.find((option) => option[keys?.value || 'value'] === selectedValue);
  }

  return { currentSelectedOptions, currentOption, allSelectedValue };
};
