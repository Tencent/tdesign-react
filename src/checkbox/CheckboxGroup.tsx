import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import useDefaultValue from '../_util/useDefaultValue';
import { Combine, StyledProps, ControlledProps } from '../_type';
import { CheckContext, CheckContextValue } from '../check';

export interface CheckboxGroupProps extends Combine<StyledProps, ControlledProps<string[]>> {
  /**
   * 已选中的值集合，由 `value = true` 的 `<Checkbox />` 的 `name` 属性组成
   */
  value?: string[];

  /**
   * 值变更时回调
   */
  onChange?: (value: string[], event: MouseEvent<HTMLInputElement>) => void;

  /**
   * 禁用组件
   * */
  disabled?: boolean;

  /**
   * 使用水平布局（`inline`）还是纵向排列布局（`column`）
   * @default "inline"
   */
  layout?: 'inline' | 'column';

  /**
   * 复选框内容
   */
  children?: React.ReactNode;
}

/**
 * 单选选项组，里面可以嵌套 <Radio />
 */
export function CheckboxGroup(props: CheckboxGroupProps) {
  const { classPrefix } = useConfig();
  const { value, onChange, disabled, layout, className, style, children } = useDefaultValue(props, []);

  const checkedSet = new Set(value || []);

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 只为 checkbox 提供
      if (checkProps.type !== 'checkbox') {
        return checkProps;
      }

      // 如果已经受控，则不注入
      if (typeof checkProps.value === 'boolean') {
        return checkProps;
      }

      const checkName = checkProps.name;

      return {
        ...checkProps,
        value: checkedSet.has(checkName),
        disabled: checkProps.disabled || disabled,
        display: layout === 'column' ? 'block' : 'inline',
        onChange(checked, event) {
          // 支持 checkbox 上的 onChange 处理时阻止默认的处理行为
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, event);
            if (event.defaultPrevented) {
              return;
            }
          }
          if (typeof onChange === 'function') {
            const newValue = checked ? [...value, checkName] : (checkedSet.delete(checkName), Array.from(checkedSet));
            onChange(newValue, event);
          }
        },
      };
    },
  };

  return (
    <div className={classNames(`${classPrefix}-form-check-group`, className)} style={style}>
      <CheckContext.Provider value={context}>{children}</CheckContext.Provider>
    </div>
  );
}
