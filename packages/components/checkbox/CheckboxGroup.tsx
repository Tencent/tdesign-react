import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { isNumber } from 'lodash-es';
import { CheckContext, type CheckContextValue, type CheckProps } from '../common/Check';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import Checkbox from './Checkbox';
import { checkboxGroupDefaultProps } from './defaultProps';

import type { StyledProps } from '../common';
import type { CheckboxProps } from './Checkbox';
import type {
  CheckboxGroupValue,
  CheckboxOption,
  CheckboxOptionObj,
  TdCheckboxGroupProps,
  TdCheckboxProps,
} from './type';

export interface CheckboxGroupProps<T extends CheckboxGroupValue = CheckboxGroupValue>
  extends TdCheckboxGroupProps<T>,
    StyledProps {
  children?: React.ReactNode;
}

const getCheckboxValue = (v: CheckboxOption) => {
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
    readonly,
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

  const { enabledValues, disabledValues } = useMemo(() => {
    const enabledValues = [];
    const disabledValues = [];
    optionsWithoutCheckAll.forEach((option) => {
      const isOptionDisabled = typeof option === 'object' && (option.disabled || option.readonly);
      const value = getCheckboxValue(option);

      if (isOptionDisabled || disabled || readonly) {
        disabledValues.push(value);
      } else {
        enabledValues.push(value);
      }
    });
    return { enabledValues, disabledValues };
  }, [optionsWithoutCheckAll, disabled, readonly]);

  const [internalValue, setInternalValue] = useControlled(props, 'value', onChange);
  const [localMax, setLocalMax] = useState(max);

  const getCheckedSet = useCallback(() => {
    if (!Array.isArray(internalValue)) {
      return new Set<ItemType>([]);
    }
    return new Set<ItemType>([].concat(internalValue));
  }, [internalValue]);
  const checkedSet = useMemo(() => getCheckedSet(), [getCheckedSet]);

  const indeterminate = useMemo(() => {
    const checkableValues = enabledValues.filter((value) => checkedSet.has(value));
    const checkedDisabledValues = disabledValues.filter((value) => checkedSet.has(value));
    // 存在被禁用且已选中的选项，直接显示半选状态
    if (checkedDisabledValues.length > 0) return true;
    // 否则检查未禁用的选项是否处于部分选中状态
    return checkableValues.length !== 0 && checkableValues.length !== enabledValues.length;
  }, [checkedSet, enabledValues, disabledValues]);

  const checkAllChecked = useMemo(() => {
    const checkableValues = enabledValues.filter((value) => checkedSet.has(value));
    return enabledValues.length > 0 && checkableValues.length === enabledValues.length;
  }, [checkedSet, enabledValues]);

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
        readonly: checkProps.readonly || readonly,
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }

          const checkedSet = getCheckedSet();

          if (checkProps.checkAll) {
            // 保存被禁用选项的当前状态
            const disabledCheckedValues = disabledValues.filter((value) => checkedSet.has(value));
            // 计算当前启用选项的选中状态
            const checkedenabledOptionsValues = enabledValues.filter((value) => checkedSet.has(value));
            const allEnabledChecked =
              enabledValues.length > 0 && checkedenabledOptionsValues.length === enabledValues.length;

            checkedSet.clear();
            // 恢复被禁用选项的原有状态
            disabledCheckedValues.forEach((v) => checkedSet.add(v));
            if (!allEnabledChecked) {
              enabledValues.forEach((v) => checkedSet.add(v));
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
                    <Checkbox
                      {...vs}
                      key={index}
                      disabled={vs.disabled || disabled}
                      readonly={vs.readonly || readonly}
                    />
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
