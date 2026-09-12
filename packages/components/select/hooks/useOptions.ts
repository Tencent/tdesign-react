import React, { useEffect, useMemo, useState } from 'react';
import { get, isNumber } from 'lodash-es';

import Option from '../base/Option';
import OptionGroup from '../base/OptionGroup';
import { getKeyMapping, getValueToOption } from '../util/helper';

import type { ReactElement, ReactNode } from 'react';
import type { SelectKeysType, SelectOption, SelectOptionGroup, SelectValue, TdOptionProps } from '../type';

// 针对分组的相关判断和扁平处理
export function isSelectOptionGroup(option: SelectOption): option is SelectOptionGroup {
  return !!option && 'group' in option && 'children' in option;
}

// 按展示顺序展开分组选项，供键盘导航使用。
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

type OptionValueType = SelectValue<SelectOption>;

/**
 * 整理完整候选项并维护已选项回显，关键词过滤由 Select 负责。
 * 已选项查询不依赖过滤结果，避免筛选后丢失标签。
 */
function useOptions(
  keys: SelectKeysType,
  options: SelectOption[],
  children: ReactNode,
  valueType: 'object' | 'value',
  value: OptionValueType,
) {
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  const { valueKey, labelKey } = useMemo(() => getKeyMapping(keys), [keys]);

  /**
   * 同步整理 options / 选项子节点，让过滤直接使用最新数据。
   * 无选项时保留 undefined，以支持自定义 children 渲染。
   */
  const normalizedOptions = useMemo(() => {
    let transformedOptions = options;

    const arrayChildren = React.Children.toArray(children);
    const optionChildren = arrayChildren.filter((v: ReactElement) => v.type === Option || v.type === OptionGroup);
    const isChildrenFilterable = arrayChildren.length > 0 && optionChildren.length === arrayChildren.length;

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
    return transformedOptions;
  }, [options, keys, children, valueKey, labelKey]);

  // 使用完整数据解析已选标签及事件中的选项信息。
  const valueToOption = useMemo(
    () => getValueToOption(children as ReactElement, options as TdOptionProps[], keys) || {},
    [children, options, keys],
  );

  /**
   * 远程结果可能不包含已选值，因此保留历史选项作为标签回显的兜底。
   * 已选项仍以当前 value 为准，不保留已取消选中的条目。
   */
  useEffect(() => {
    setSelectedOptions((oldSelectedOptions: SelectOption[]) => {
      const createOptionFromValue = (item: OptionValueType) => {
        if (valueType === 'value') {
          return (
            valueToOption[item as string | number] ||
            oldSelectedOptions.find((option) => get(option, valueKey) === item) || {
              [valueKey]: item,
              [labelKey]: isNumber(item) ? String(item) : item,
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
    normalizedOptions,
    valueToOption,
    selectedOptions,
  };
}

export default useOptions;
