import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { isNumber } from 'lodash-es';
import useConfig from '../hooks/useConfig';
import { CheckContext, CheckContextValue, CheckProps } from '../common/Check';
import { CheckboxGroupValue, CheckboxOption, CheckboxOptionObj, TdCheckboxGroupProps, TdCheckboxProps } from './type';
import { StyledProps } from '../common';
import useControlled from '../hooks/useControlled';
import Checkbox from './Checkbox';
import { checkboxGroupDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

import type { CheckboxProps } from './Checkbox';

export interface CheckboxGroupProps<T extends CheckboxGroupValue = CheckboxGroupValue>
  extends TdCheckboxGroupProps<T>,
    StyledProps {
  children?: React.ReactNode;
}

// 将 checkBox 的 value 转换为 string|number
const getCheckboxValue = (v: CheckboxOption): string | number => {
  switch (typeof v) {
    case 'number':
      return v as number;
    case 'string':
      return v as string;
    case 'object': {
      const vs = v as CheckboxOptionObj;
      return vs.value;
    }
    default:
      return undefined;
  }
};

/**
 * 多选选项组，里面可以嵌套 <Checkbox />
 */
const CheckboxGroup = <T extends CheckboxGroupValue = CheckboxGroupValue>(props: CheckboxGroupProps<T>) => {
  type ItemType = T[number];
  const { classPrefix } = useConfig();
  const {
    onChange,
    disabled,
    className,
    style,
    children,
    max,
    options = [],
  } = useDefaultProps<CheckboxGroupProps<T>>(props, checkboxGroupDefaultProps);

  // 去掉所有 checkAll 之后的 options
  const intervalOptions =
    Array.isArray(options) && options.length > 0
      ? options
      : React.Children.map(
          children,
          (child: ReactElement<CheckboxProps>) =>
            (child?.type as any)?.displayName === Checkbox.displayName && child.props,
        ) || [];

  const optionsWithoutCheckAll = intervalOptions.filter((t) => typeof t !== 'object' || !t.checkAll);
  const optionsWithoutCheckAllValues = [];
  optionsWithoutCheckAll.forEach((v: string | number) => {
    const vs = getCheckboxValue(v);
    optionsWithoutCheckAllValues.push(vs);
  });

  const [internalValue, setInternalValue] = useControlled(props, 'value', onChange);
  const [localMax, setLocalMax] = useState(max);

  const getCheckedSet = useCallback(() => {
    if (!Array.isArray(internalValue)) {
      return new Set<ItemType>([]);
    }
    return new Set<ItemType>([].concat(internalValue));
  }, [internalValue]);
  const checkedSet = useMemo(() => getCheckedSet(), [getCheckedSet]);

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
    if (!isNumber(max)) {
      return;
    }
    if (max < checkedSet.size) {
      console.warn('[TDesign] max should be less than the length of value, change is invalid');
    } else {
      setLocalMax(max);
    }
  }, [max, checkedSet]);

  const context: CheckContextValue = {
    inject: (
      checkProps: CheckProps & {
        // check 组件不关心 value 的类型，只关心是否存在，所以为了兼容 checkbox group 的类型
        // 此处覆盖 checkbox 默认 value 的类型，使用 checkbox group 的 generic type 代替
        value: ItemType;
      },
    ) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      const { value: checkValue } = checkProps;

      return {
        ...checkProps,
        checked: checkProps.checkAll ? checkAllChecked : checkedSet.has(checkValue),
        indeterminate: checkProps.checkAll ? indeterminate : checkProps.indeterminate,
        disabled: checkProps.disabled || disabled || (checkedSet.size >= localMax && !checkedSet.has(checkValue)),
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }

          const checkedSet = getCheckedSet();
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

          const currentOptionChecked = optionsWithoutCheckAll.find((item: CheckboxProps) => item.value === checkValue);

          // 此处 `as` 是因为 `Array.from` 会导致 `checkSet` 的 generic type 丢失
          setInternalValue(Array.from(checkedSet) as T, {
            e,
            current: checkProps.checkAll ? undefined : (checkValue as TdCheckboxProps),
            type: checked ? 'check' : 'uncheck',
            option: checkProps.checkAll ? undefined : currentOptionChecked,
          });
        },
      };
    },
  };

  // options 和 children 的抉择,在未明确说明时，暂时以 options 优先
  const useOptions = Array.isArray(options) && options.length !== 0;

  return (
    <div className={classNames(`${classPrefix}-checkbox-group`, className)} style={style}>
      <CheckContext.Provider value={context}>
        {useOptions
          ? options.map((v: any, index) => {
              switch (typeof v) {
                case 'string':
                  return (
                    <Checkbox key={index} label={v} value={v}>
                      {v}
                    </Checkbox>
                  );
                case 'number': {
                  return (
                    <Checkbox key={index} label={v} value={v}>
                      {String(v)}
                    </Checkbox>
                  );
                }
                case 'object': {
                  const vs = v as CheckboxOptionObj;
                  // CheckAll 的 checkBox 不存在 value,故用 checkAll_index 来保证尽量不和用户的 value 冲突.
                  return vs.checkAll ? (
                    <Checkbox {...vs} key={`checkAll_${index}`} indeterminate={indeterminate} />
                  ) : (
                    <Checkbox {...vs} key={index} disabled={vs.disabled || disabled} />
                  );
                }
                default:
                  return null;
              }
            })
          : children}
      </CheckContext.Provider>
    </div>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
