import React, { ReactNode } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdRadioGroupProps } from '../_type/components/radio';
import useDefault from '../_util/useDefault';
import { CheckContext, CheckContextValue } from '../common/Check';

/**
 * RadioGroup 组件所接收的属性
 */
export interface RadioGroupProps extends TdRadioGroupProps {
  children?: ReactNode;
}

/**
 * 单选选项组，里面可以嵌套 <Radio />
 */
const RadioGroup = (props: RadioGroupProps) => {
  const { classPrefix } = useConfig();
  const { disabled, children, value, defaultValue, onChange, size = 'medium', buttonStyle = 'outline' } = props;

  const [internalValue, setInternalValue] = useDefault(value, defaultValue, onChange);

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      const { value: checkValue } = checkProps;

      return {
        ...checkProps,
        checked: internalValue === checkProps.value,
        disabled: checkProps.disabled || disabled,
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }

          setInternalValue(checkValue, { e });
        },
      };
    },
  };

  return (
    <CheckContext.Provider value={context}>
      <div
        className={classNames(
          `${classPrefix}-radio-group`,
          `${classPrefix}-radio-group-${buttonStyle}`,
          `${classPrefix}-radio-group-${size}`,
        )}
      >
        {children}
      </div>
    </CheckContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
