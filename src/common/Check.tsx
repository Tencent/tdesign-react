import React, { Ref, forwardRef, useContext } from 'react';
import classNames from 'classnames';
import { TdRadioProps } from '../_type/components/radio';
import { StyledProps } from '../_type';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import { TdCheckboxProps } from '../_type/components/checkbox';

export interface CheckProps extends TdRadioProps, TdCheckboxProps, StyledProps {
  type: 'radio' | 'radio-button' | 'checkbox';
  children?: React.ReactNode;
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
    type,
    checked,
    defaultChecked,
    disabled,
    name,
    value,
    onChange,
    indeterminate,
    children,
    className,
    style,
    ...htmlProps
  } = props;

  const { classPrefix } = useConfig();

  const [internalChecked, setInternalChecked] = useDefault(checked, defaultChecked, onChange);

  const labelClassName = classNames(className, `${classPrefix}-${type}`, {
    [`${classPrefix}-is-checked`]: internalChecked,
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-indeterminate`]: indeterminate,
  });

  const input = (
    <input
      readOnly
      type={type === 'radio-button' ? 'radio' : type}
      className={`${classPrefix}-${type}__former`}
      checked={internalChecked}
      disabled={disabled}
      name={name}
      value={value}
      onChange={(e) => setInternalChecked(e.currentTarget.checked, { e })}
    />
  );

  return (
    <label
      ref={ref}
      className={labelClassName}
      style={style}
      {...htmlProps}
      onClick={(event) => event.stopPropagation()}
    >
      {input}
      <span className={`${classPrefix}-${type}__input`} />
      <span key="label" className={`${classPrefix}-${type}__label`}>
        {children}
      </span>
    </label>
  );
});

Check.displayName = 'Check';

export default Check;
