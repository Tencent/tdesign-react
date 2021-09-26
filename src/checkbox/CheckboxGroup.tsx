import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { CheckContext, CheckContextValue } from '../common/Check';
import { TdCheckboxGroupProps } from '../_type/components/checkbox';
import { StyledProps } from '../_type';
import useDefault from '../_util/useDefault';

export interface CheckboxGroupProps extends TdCheckboxGroupProps, StyledProps {
  children?: React.ReactNode;
}

/**
 * 单选选项组，里面可以嵌套 <Radio />
 */
export function CheckboxGroup(props: CheckboxGroupProps) {
  const { classPrefix } = useConfig();
  const { value, defaultValue, onChange, disabled, className, style, children, max } = props;

  const [internalValue, setInternalValue] = useDefault(value, defaultValue, onChange);
  const [localMax, setLocalMax] = useState(max);

  const checkedSet = useMemo(() => new Set([].concat(internalValue)), [internalValue]);

  useEffect(() => {
    if (max < checkedSet.size) {
      console.warn('[TDesign] max should be less than the length of value');
    } else {
      setLocalMax(max);
    }
  }, [max, checkedSet]);

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      const { value: checkValue } = checkProps;

      return {
        ...checkProps,
        checked: checkedSet.has(checkValue),
        disabled: checkProps.disabled || disabled || (checkedSet.size >= localMax && !checkedSet.has(checkValue)),
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }

          if (checked) {
            if (checkedSet.size < localMax) {
              checkedSet.add(checkValue);
            }
          } else {
            checkedSet.delete(checkValue);
          }

          setInternalValue(Array.from(checkedSet), { e });
        },
      };
    },
  };

  return (
    <div className={classNames(`${classPrefix}-check-group`, className)} style={style}>
      <CheckContext.Provider value={context}>{children}</CheckContext.Provider>
    </div>
  );
}
