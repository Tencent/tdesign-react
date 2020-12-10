import React, { ReactNode, MouseEvent, FunctionComponent } from 'react';
import classNames from 'classnames';
import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import { ControlledProps } from '../_type';
import { CheckContext, CheckContextValue } from '../check';

/**
 * RadioGroup 组件所接收的属性
 */
export interface RadioGroupProps extends ControlledProps<string> {
  /**
   * 当前选中的 Radio 的 name
   */
  value?: string;

  /**
   * 值变更时回调
   */
  onChange?: (value: string, context: { event: MouseEvent<HTMLInputElement> }) => void;

  /**
   * 禁用组件
   * @default false
   */
  disabled?: boolean;

  /**
   * 单选按钮内容
   */
  children?: ReactNode;

  /**
   * 按钮样式的大小
   * @default 'default'
   */
  size?: 'large' | 'default' | 'small';

  /**
   * 按钮样式的风格
   * @default 'outline'
   */
  buttonStyle?: 'outline' | 'solid';
}

export interface RadioGroupTarget {
  /** 当前选中的 Radio 的值 */
  value: string;
}

/**
 * 单选选项组，里面可以嵌套 <Radio />
 */
const RadioGroup: FunctionComponent<RadioGroupProps> = (props) => {
  const { classPrefix } = useConfig();
  const { disabled, children, value, onChange, size = 'default', buttonStyle = 'outline' } = useDefaultValue(props);

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 只为 radio 提供
      if (checkProps.type === 'checkbox') {
        return checkProps;
      }

      // 如果已经受控，则不注入
      if (typeof checkProps.value === 'boolean') {
        return checkProps;
      }

      const checkName = checkProps.name;

      return {
        ...checkProps,
        value: value === checkProps.name,
        disabled: checkProps.disabled || disabled,
        onChange(checked, { event }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { event });

            if (event.defaultPrevented) {
              return;
            }
          }

          if (typeof onChange === 'function') {
            onChange(checkName, { event });
          }
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
