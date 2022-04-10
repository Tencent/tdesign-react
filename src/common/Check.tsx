import React, { Ref, forwardRef, useContext, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { omit } from '../_util/helper';
import { StyledProps } from '../common';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import { TdCheckboxProps } from '../checkbox/type';

export interface CheckProps extends TdCheckboxProps, StyledProps {
  type: 'radio' | 'radio-button' | 'checkbox';
  allowUncheck?: boolean;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLLabelElement>;
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
    checked,
    defaultChecked = false,
    disabled,
    name,
    value,
    onChange,
    indeterminate,
    children,
    label,
    className,
    style,
    ...htmlProps
  } = props;

  const { classPrefix } = useConfig();

  const TdonChange: (
    checked: boolean,
    context: {
      e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>;
    },
  ) => void = onChange;

  const [internalChecked, setInternalChecked] = useDefault(checked, defaultChecked, TdonChange);

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
      onClick={(e) => {
        e.stopPropagation();
        if ((type === 'radio-button' || type === 'radio') && allowUncheck) {
          setInternalChecked(!e.currentTarget.checked, { e });
        }
      }}
      onChange={(e) => setInternalChecked(e.currentTarget.checked, { e })}
    />
  );

  return (
    <label
      ref={ref}
      className={labelClassName}
      style={style}
      {...omit(htmlProps, ['checkAll'])}
      onClick={props.onClick}
    >
      {input}
      <span className={`${classPrefix}-${type}__input`} />
      <span key="label" className={`${classPrefix}-${type}__label`}>
        {children || label}
      </span>
    </label>
  );
});

Check.displayName = 'Check';

export default Check;
