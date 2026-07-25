import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { isNumber } from 'lodash-es';

import { CheckContext } from '../common/Check';
import useCommonClassName from '../hooks/useCommonClassName';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import Checkbox from './Checkbox';
import { checkboxGroupDefaultProps } from './defaultProps';

import type { ReactElement, ReactNode } from 'react';
import type { StyledProps } from '../common';
import type { CheckContextValue, CheckProps } from '../common/Check';
import type { CheckboxProps } from './Checkbox';
import type {
  CheckboxGroupValue,
  CheckboxOption,
  CheckboxOptionObj,
  TdCheckboxGroupProps,
  TdCheckboxProps,
} from './type';

export interface CheckboxGroupProps<T extends CheckboxGroupValue = CheckboxGroupValue>
  extends TdCheckboxGroupProps<T>, StyledProps {
  children?: ReactNode;
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
  const { SIZE: sizeMap } = useCommonClassName();
  const {
    onChange,
    disabled,
    className,
    style,
    children,
    max,
    options = [],
    size,
    variant,
    theme,
    direction,
    ...resetProps
  } = useDefaultProps<CheckboxGroupProps<T>>(props, checkboxGroupDefaultProps);

  const readOnly = resetProps.readOnly || resetProps.readonly;

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
  const optionsWithoutCheckAllValues: (string | number | boolean | undefined)[] = [];
  optionsWithoutCheckAll.forEach((v: string | number) => {
    const vs = getCheckboxValue(v);
    optionsWithoutCheckAllValues.push(vs);
  });

  const { enabledValues, disabledValues } = useMemo(() => {
    const enabledValues: (string | number | boolean | undefined)[] = [];
    const disabledValues: (string | number | boolean | undefined)[] = [];
    optionsWithoutCheckAll.forEach((option) => {
      const isOptionDisabled = typeof option === 'object' && (option.disabled || option.readOnly || option.readonly);
      const value = getCheckboxValue(option);

      if (isOptionDisabled || disabled || readOnly) {
        disabledValues.push(value);
      } else {
        enabledValues.push(value);
      }
    });
    return { enabledValues, disabledValues };
  }, [optionsWithoutCheckAll, disabled, readOnly]);

  const [internalValue, setInternalValue] = useControlled(props, 'value', onChange);
  const [localMax, setLocalMax] = useState(max);

  const checkboxGroupRef = useRef<HTMLDivElement>(null);

  const getCheckedSet = useCallback(() => {
    if (!Array.isArray(internalValue)) {
      return new Set<ItemType>([]);
    }
    return new Set<ItemType>([].concat(internalValue));
  }, [internalValue]);
  const checkedSet = useMemo(() => getCheckedSet(), [getCheckedSet]);

  const indeterminate = useMemo(() => {
    const allValues = [...enabledValues, ...disabledValues];
    const checkedCount = allValues.filter((value) => checkedSet.has(value)).length;
    return checkedCount > 0 && checkedCount < allValues.length;
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
        readOnly: checkProps.readonly || readOnly,
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }

          const checkedSet = getCheckedSet();

          if (checkProps.checkAll) {
            const checkedEnabledValues = enabledValues.filter((value) => checkedSet.has(value));
            const allEnabledChecked = enabledValues.length > 0 && checkedEnabledValues.length === enabledValues.length;
            if (!allEnabledChecked) {
              enabledValues.forEach((value) => {
                if (!checkedSet.has(value)) {
                  checkedSet.add(value);
                }
              });
            } else {
              enabledValues.forEach((value) => {
                if (checkedSet.has(value)) {
                  checkedSet.delete(value);
                }
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

  // 根据 theme 选择渲染组件
  const Comp = theme === 'button' ? Checkbox.Button : Checkbox;

  const renderOptions = (): ReactNode => {
    return options.map((v: CheckboxOption, index: number) => {
      switch (typeof v) {
        case 'string':
          return (
            <Comp key={index} value={v}>
              {v}
            </Comp>
          );
        case 'number':
          return (
            <Comp key={index} value={v}>
              {String(v)}
            </Comp>
          );
        case 'object': {
          const vs = v as CheckboxOptionObj;
          // CheckAll 的 checkBox 不存在 value,故用 checkAll_index 来保证尽量不和用户的 value 冲突.
          return vs.checkAll ? (
            <Checkbox {...vs} key={`checkAll_${index}`} indeterminate={indeterminate} />
          ) : (
            <Comp
              {...vs}
              key={index}
              disabled={vs.disabled || disabled}
              readOnly={vs.readOnly || vs.readonly || readOnly}
            />
          );
        }
        default:
          return null;
      }
    });
  };

  // 构建 className
  const groupClassName = classNames(`${classPrefix}-checkbox-group`, sizeMap[size], className, {
    // 边框型
    [`${classPrefix}-checkbox-group__outline`]: theme === 'button' && variant === 'outline',
    // 填充型
    [`${classPrefix}-checkbox-group--filled`]: theme === 'button' && variant?.includes('filled'),
    [`${classPrefix}-checkbox-group--default-filled`]: theme === 'button' && variant === 'default-filled',
    [`${classPrefix}-checkbox-group--primary-filled`]: theme === 'button' && variant === 'primary-filled',
    // 纵向排列
    [`${classPrefix}-checkbox-group--vertical`]: direction === 'vertical',
  });

  return (
    <div ref={checkboxGroupRef} style={style} className={groupClassName}>
      <CheckContext.Provider value={context}>{useOptions ? renderOptions() : children}</CheckContext.Provider>
    </div>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
