import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { isNumber, get as lodashGet } from 'lodash-es';
import classNames from 'classnames';
import { CheckboxOption, CheckboxOptionObj, TdCheckboxGroupProps } from './type';
import { StyledProps } from '../common';

import useDefault from '../_util/useDefault';
import Checkbox, { CheckContext, CheckContextValue } from './Checkbox';
import useDefaultProps from '../hooks/useDefaultProps';
import { checkboxGroupDefaultProps } from './defaultProps';
import { usePrefixClass } from '../hooks/useClass';

export interface CheckboxGroupProps extends TdCheckboxGroupProps, StyledProps {
  children?: React.ReactNode;
}

// 将 checkBox 的 value 转换为 string|number
const getCheckboxValue = (v: CheckboxOption): string | number => {
  switch (typeof v) {
    case 'number':
    case 'string':
      return v as string | number;
    case 'object': {
      const vs = v as CheckboxOptionObj;
      return vs.value as string | number;
    }
    default:
      return undefined;
  }
};

const CheckboxGroup: FC<CheckboxGroupProps> = (props) => {
  const checkboxGroupClass = usePrefixClass('checkbox-group');
  const {
    value,
    defaultValue,
    disabled,
    className,
    max,
    options,
    name,
    style,
    children,
    borderless,
    readonly = false,
    direction,
    keys,
    onChange,
  } = useDefaultProps(props, checkboxGroupDefaultProps);

  const internalOptions =
    Array.isArray(options) && options.length > 0
      ? options
      : React.Children.map(children, (child) => (child as ReactElement).props);
  const optionsWithoutCheckAll = internalOptions.filter((t: CheckboxOption) => typeof t !== 'object' || !t.checkAll);
  const optionsWithoutCheckAllValues = [];
  optionsWithoutCheckAll.forEach((v) => {
    const vs = getCheckboxValue(v);
    optionsWithoutCheckAllValues.push(vs);
  });

  const [internalValue, setInternalValue] = useDefault(value, defaultValue, onChange);
  const [localMax, setLocalMax] = useState(max);

  const checkedSet = useMemo(() => {
    if (!Array.isArray(internalValue)) return new Set([]);
    return new Set([].concat(internalValue));
  }, [internalValue]);

  // 用于决定全选状态的属性
  const indeterminate = useMemo(() => {
    const list = Array.from(checkedSet);
    return list.length !== 0 && list.length !== optionsWithoutCheckAll.length;
  }, [checkedSet, optionsWithoutCheckAll]);

  const checkAllChecked = useMemo(() => {
    const list = Array.from(checkedSet);
    return list.length === optionsWithoutCheckAll.length;
  }, [checkedSet, optionsWithoutCheckAll]);

  useEffect(() => {
    if (!isNumber(max)) return;
    if (max < checkedSet.size) {
      console.warn('[TDesign] max should be less than the length of value, change is invalid');
    } else {
      setLocalMax(max);
    }
  }, [max, checkedSet]);

  const context: CheckContextValue = {
    inject: (checkProps) => {
      const injectProps = { ...checkProps, direction } as typeof checkProps;
      if (typeof injectProps.checked !== 'undefined') {
        return injectProps;
      }

      const { value: checkValue } = injectProps;

      return {
        ...injectProps,
        name,
        checked: checkProps.checkAll ? checkAllChecked || checkedSet.size !== 0 : checkedSet.has(checkValue),
        indeterminate: checkProps.checkAll ? indeterminate : checkProps.indeterminate,
        disabled: checkProps.disabled || disabled || (checkedSet.size >= localMax && !checkedSet.has(checkValue)),
        borderless: checkProps.borderless || borderless,
        readonly: checkProps.readonly || readonly,
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }

          // 全选时的逻辑处理
          if (checkProps.checkAll) {
            checkedSet.clear();
            if (checked) {
              optionsWithoutCheckAllValues.forEach((v) => {
                checkedSet.add(v);
              });
            }
          } else if (checked) {
            if (checkedSet.size >= localMax && isNumber(max)) return;
            checkedSet.add(checkValue);
          } else {
            checkedSet.delete(checkValue);
          }

          setInternalValue(Array.from(checkedSet), {
            e: e as any,
            current: checkProps.checkAll ? undefined : (checkValue as string | number),
            type: checked ? 'check' : 'uncheck',
            option: checkProps,
          });
        },
      };
    },
  };

  // options 和 children 的抉择,在未明确说明时，暂时以 options 优先
  const isOptions = Array.isArray(options) && options.length !== 0;

  const checkboxNode = () =>
    options.map((item, index) => {
      const type = typeof item;
      switch (type) {
        case 'number':
        case 'string': {
          const vs = item as number | string;
          return (
            <Checkbox key={vs} label={vs} value={vs}>
              {vs}
            </Checkbox>
          );
        }
        case 'object': {
          const vs = item as CheckboxOptionObj;
          // CheckAll 的 checkBox 不存在 value,故用 checkAll_index 来保证尽量不和用户的 value 冲突.
          return vs.checkAll ? (
            <Checkbox {...vs} key={`checkAll_${index}`} indeterminate={indeterminate} />
          ) : (
            <Checkbox
              {...vs}
              key={`${lodashGet(item, keys?.value ?? 'value', '')}${index}`}
              label={lodashGet(item, keys?.label ?? 'label', vs.text || '')}
              value={lodashGet(item, keys?.value ?? 'value')}
              disabled={lodashGet(item, keys?.disabled ?? 'disabled')}
            />
          );
        }
        default:
          return null;
      }
    });

  return (
    <div className={classNames(checkboxGroupClass, `${checkboxGroupClass}--${direction}`, className)} style={style}>
      {isOptions ? (
        <span>
          <CheckContext.Provider value={context}>{checkboxNode()}</CheckContext.Provider>
        </span>
      ) : (
        <CheckContext.Provider value={context}>{children}</CheckContext.Provider>
      )}
    </div>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
