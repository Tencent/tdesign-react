import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { get } from 'lodash-es';

import Option from '../base/Option';
import OptionGroup from '../base/OptionGroup';
import { getKeyMapping, getValueToOption, type ValueToOption } from '../util/helper';

import type { SelectKeysType, SelectOption, SelectOptionGroup, SelectValue, TdOptionProps } from '../type';

type OptionValueType = SelectValue<SelectOption>;

// 针对分组的相关判断和扁平处理
export function isSelectOptionGroup(option: SelectOption): option is SelectOptionGroup {
  return !!option && 'group' in option && 'children' in option;
}

export function isValueSelected(v: SelectValue, key: string, valueType: string, valueKey: string) {
  return valueType === 'value' ? String(v) === String(key) : get(v, valueKey) === key;
}

export const flattenOptions = (options: SelectOption[] = []) => {
  const flattened = [];
  options.forEach((option) => {
    if (isSelectOptionGroup(option)) {
      if (option.children) {
        flattened.push(...option.children);
      }
    } else {
      flattened.push(option);
    }
  });
  return flattened;
};

// 处理 options 的逻辑
function useOptions(
  keys: SelectKeysType,
  options: SelectOption[],
  children: ReactNode,
  valueType: 'object' | 'value',
  value: OptionValueType,
  reserveKeyword: boolean,
) {
  const [valueToOption, setValueToOption] = useState<ValueToOption>({});
  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>([]);
  const [flattenedOptions, setFlattenedOptions] = useState<SelectOption[]>([]);
  const [tmpPropOptions, setTmpPropOptions] = useState<SelectOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  const { valueKey, labelKey } = useMemo(() => getKeyMapping(keys), [keys]);

  useEffect(() => {
    setFlattenedOptions(flattenOptions(currentOptions));
  }, [currentOptions]);

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
        value: get(option, valueKey),
        label: get(option, labelKey),
      }));
    }

    setCurrentOptions(transformedOptions);
    setTmpPropOptions(transformedOptions);

    setValueToOption((prevValueToOption) => {
      const newValueToOption = getValueToOption(children as ReactElement, options as TdOptionProps[], keys) || {};
      const mergedValueToOption = { ...newValueToOption };

      // 保持之前选中的 option 在映射中，避免远程搜索时，状态丢失
      Object.keys(prevValueToOption).forEach((key) => {
        if (mergedValueToOption[key]) return;
        const isSelected = Array.isArray(value)
          ? value.some((v) => isValueSelected(v, key, valueType, valueKey))
          : isValueSelected(value, key, valueType, valueKey);

        if (isSelected) {
          mergedValueToOption[key] = prevValueToOption[key];
        }
      });

      return mergedValueToOption;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, keys, children, reserveKeyword]);

  // 同步 value 对应的 options
  useEffect(() => {
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
  }, [value, keys, valueType, valueToOption, valueKey, labelKey, setSelectedOptions]);

  return {
    currentOptions,
    setCurrentOptions,
    tmpPropOptions,
    setTmpPropOptions,
    valueToOption,
    setValueToOption,
    selectedOptions,
    setSelectedOptions,
    flattenedOptions,
  };
}

export default useOptions;
