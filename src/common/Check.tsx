import React, { Ref, forwardRef, useContext, MouseEventHandler } from 'react';
import classNames from 'classnames';
import isBoolean from 'lodash/isBoolean';
import { omit } from '../_util/helper';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import { TdCheckboxProps } from '../checkbox/type';

export interface CheckProps extends Omit<TdCheckboxProps, 'value'>, StyledProps {
  type: 'radio' | 'radio-button' | 'checkbox';
  allowUncheck?: boolean;
  title?: string;
  value?: string | number | boolean;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLLabelElement>;
  stopLabelTrigger?: Boolean;
}

/**
 * Check 组件支持使用 CheckContext 进行状态托管
 */
export const CheckContext = React.createContext<CheckContextValue>(null);

/**
 * 托管 Check 组件的状态，请提供 inject() 方法注入托管好的 props
 */
export interface CheckContextValue {
  inject: (props: CheckProps) => CheckProps;
}

const Check = forwardRef((_props: CheckProps, ref: Ref<HTMLLabelElement>) => {
  // 支持从 Context 注入
  const context = useContext(CheckContext);
  const props = context ? context.inject(_props) : _props;

  const {
    allowUncheck = false,
    type,
    disabled,
    name,
    value,
    onChange,
    indeterminate,
    children,
    label,
    className,
    style,
    readonly,
    ...htmlProps
  } = props;

  const { classPrefix } = useConfig();

  const TOnChange: (
    checked: boolean,
    context: {
      e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>;
    },
  ) => void = onChange;

  const [internalChecked, setInternalChecked] = useControlled(props, 'checked', TOnChange);

  const labelClassName = classNames(`${classPrefix}-${type}`, className, {
    [`${classPrefix}-is-checked`]: internalChecked,
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-indeterminate`]: indeterminate,
  });

  const input = (
    <input
      readOnly={readonly}
      type={type === 'radio-button' ? 'radio' : type}
      className={`${classPrefix}-${type}__former`}
      checked={internalChecked}
      disabled={disabled}
      name={name}
      value={isBoolean(value) ? Number(value) : value}
      onClick={(e) => {
        e.stopPropagation();
        if ((type === 'radio-button' || type === 'radio') && allowUncheck && internalChecked) {
          setInternalChecked(!e.currentTarget.checked, { e });
        }
      }}
      onChange={(e) => setInternalChecked(e.currentTarget.checked, { e })}
    />
  );
  // Checkbox/ Radio 内容为空则不再渲染 span，不存在 0:Number 的情况
  const showLabel = !!(children || label);

  const handleLabelClick = (event) => {
    // 在tree等组件中使用  阻止label触发checked 与expand冲突
    if (props.stopLabelTrigger) event.preventDefault();
  };

  return (
    <label
      ref={ref}
      className={labelClassName}
      title={props.title}
      style={style}
      {...omit(htmlProps, ['checkAll', 'stopLabelTrigger'])}
    >
      {input}
      <span className={`${classPrefix}-${type}__input`} />
      {showLabel && (
        <span key="label" className={`${classPrefix}-${type}__label`} onClick={handleLabelClick}>
          {children || label}
        </span>
      )}
    </label>
  );
});

Check.displayName = 'Check';

export default Check;
