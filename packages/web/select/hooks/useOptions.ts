import React, { useState, useEffect, ReactNode, ReactElement } from 'react';
import { get } from 'lodash-es';
import { SelectKeysType, SelectOption, SelectValue } from '../type';
import { getValueToOption } from '../util/helper';
import Option from '../base/Option';

// 处理 options 的逻辑
function UseOptions(
  keys: SelectKeysType,
  options: SelectOption[],
  children: ReactNode,
  valueType: 'object' | 'value',
  value: SelectValue<SelectOption>,
  reserveKeyword: boolean,
) {
  const [valueToOption, setValueToOption] = useState({});
  const [currentOptions, setCurrentOptions] = useState([]);
  const [tmpPropOptions, setTmpPropOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // 处理设置 option 的逻辑
  useEffect(() => {
    let transformedOptions = options;

    const arrayChildren = React.Children.toArray(children);
    const optionChildren = arrayChildren.filter((v: ReactElement) => v.type === Option);
    const isChildrenFilterable = arrayChildren.length > 0 && optionChildren.length === arrayChildren.length;
    if (reserveKeyword && currentOptions.length && isChildrenFilterable) return;

    if (isChildrenFilterable) {
      transformedOptions = arrayChildren?.map<SelectOption>((v) => {
        if (React.isValidElement<SelectOption>(v)) {
          return {
            ...v.props,
            label: v.props.label || v.props.children,
          };
        }
        return { label: v };
      });
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

    setValueToOption(getValueToOption(children as ReactElement, options as any, keys) || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, keys, children, reserveKeyword]);

  // 同步 value 对应的 options
  useEffect(() => {
    setSelectedOptions((oldSelectedOptions: SelectOption[]) => {
      const valueKey = keys?.value || 'value';
      const labelKey = keys?.label || 'label';
      if (Array.isArray(value)) {
        return value
          .map((item: SelectValue<SelectOption>) => {
            if (valueType === 'value') {
              return (
                valueToOption[item as string | number] ||
                oldSelectedOptions.find((option) => get(option, valueKey) === item) || {
                  [valueKey]: item,
                  [labelKey]: item,
                }
              );
            }
            return item;
          })
          .filter(Boolean);
      }

      if (value !== undefined && value !== null) {
        if (valueType === 'value') {
          return [
            valueToOption[value as string | number] ||
              oldSelectedOptions.find((option) => get(option, valueKey) === value) || {
                [valueKey]: value,
                [labelKey]: value,
              },
          ].filter(Boolean);
        }
        return [value];
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
