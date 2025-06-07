import React, { useState, useEffect, ReactNode, ReactElement } from 'react';
import { get } from 'lodash-es';
import type { SelectKeysType, SelectOption, SelectOptionGroup, SelectValue, TdOptionProps } from '../type';
import { getValueToOption, type ValueToOption } from '../util/helper';
import Option from '../base/Option';
import OptionGroup from '../base/OptionGroup';

export function isSelectOptionGroup(option: SelectOption): option is SelectOptionGroup {
  return !!option && 'group' in option && 'children' in option;
}

type OptionValueType = SelectValue<SelectOption>;

// 处理 options 的逻辑
function UseOptions(
  keys: SelectKeysType,
  options: SelectOption[],
  children: ReactNode,
  valueType: 'object' | 'value',
  value: OptionValueType,
  reserveKeyword: boolean,
) {
  const [valueToOption, setValueToOption] = useState<ValueToOption>({});
  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>([]);
  const [tmpPropOptions, setTmpPropOptions] = useState<SelectOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  // 处理设置 option 的逻辑
  useEffect(() => {
    let transformedOptions = options;

    const arrayChildren = React.Children.toArray(children);
    const optionChildren = arrayChildren.filter((v: ReactElement) => v.type === Option || v.type === OptionGroup);
    const isChildrenFilterable = arrayChildren.length > 0 && optionChildren.length === arrayChildren.length;
    if (reserveKeyword && currentOptions.length && isChildrenFilterable) return;

    if (isChildrenFilterable) {
      const handlerOptionElement = (v) => {
        if (React.isValidElement<SelectOption>(v)) {
          if (v.type === OptionGroup) {
            return {
              ...v.props,
              group: v.props.label,
              children: v.props.children?.map((v) => handlerOptionElement(v)),
            };
          }
          return {
            ...v.props,
            label: v.props.label || v.props.children,
          };
        }
        return { label: v };
      };
      transformedOptions = arrayChildren?.map<SelectOption>((v) => handlerOptionElement(v));
    }
    if (keys) {
      // 如果有定制 keys 先做转换
      transformedOptions = transformedOptions?.map<SelectOption>((option) => ({
        ...option,
        value: get(option, keys?.value || 'value'),
        label: get(option, keys?.label || 'label'),
      }));
    }
    setCurrentOptions(transformedOptions);
    setTmpPropOptions(transformedOptions);

    setValueToOption(getValueToOption(children as ReactElement, options as TdOptionProps[], keys) || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, keys, children, reserveKeyword]);

  // 同步 value 对应的 options
  useEffect(() => {
    const valueKey = keys?.value || 'value';
    const labelKey = keys?.label || 'label';

    setSelectedOptions((oldSelectedOptions: SelectOption[]) => {
      const createOptionFromValue = (item: OptionValueType) => {
        if (valueType === 'value') {
          return (
            valueToOption[item as string | number] ||
            oldSelectedOptions.find((option) => get(option, valueKey) === item) || {
              [valueKey]: item,
              [labelKey]: item,
            }
          );
        }
        if (typeof item === 'object' && item !== null) {
          return item;
        }
        return [];
      };

      // 多选
      if (Array.isArray(value)) {
        return value.map(createOptionFromValue);
      }

      // 单选
      if (value !== undefined && value !== null) {
        const option = createOptionFromValue(value);
        return option ? [option] : [];
      }

      return [];
    });
  }, [value, keys, valueType, valueToOption, setSelectedOptions]);

  return {
    currentOptions,
    setCurrentOptions,
    tmpPropOptions,
    setTmpPropOptions,
    valueToOption,
    setValueToOption,
    selectedOptions,
    setSelectedOptions,
  };
}

export default UseOptions;
