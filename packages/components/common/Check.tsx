import React, { forwardRef, useContext, MouseEvent, ChangeEvent } from 'react';
import classNames from 'classnames';
import { isBoolean } from 'lodash-es';
import { omit } from '../_util/helper';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import { TdCheckboxProps } from '../checkbox/type';

export interface CheckProps extends TdCheckboxProps, StyledProps {
  type: 'radio' | 'radio-button' | 'checkbox';
  allowUncheck?: boolean;
  title?: string;
  children?: React.ReactNode;
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

const Check = forwardRef<HTMLLabelElement, CheckProps>((_props, ref) => {
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
    onClick,
    ...htmlProps
  } = props;

  const { classPrefix } = useConfig();

  const TOnChange: (
    checked: boolean,
    context: { e: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLInputElement> },
  ) => void = onChange;

  const [internalChecked, setInternalChecked] = useControlled(props, 'checked', TOnChange);

  const labelClassName = classNames(`${classPrefix}-${type}`, className, {
    [`${classPrefix}-is-checked`]: internalChecked,
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-indeterminate`]: indeterminate,
  });

  const isDisabled = disabled || readonly;

  const input = (
    <input
      readOnly={readonly}
      type={type === 'radio-button' ? 'radio' : type}
      className={`${classPrefix}-${type}__former`}
      checked={internalChecked}
      disabled={disabled}
      name={name}
      tabIndex={-1}
      value={isBoolean(value) ? Number(value) : value}
      data-value={typeof value === 'string' ? `'${value}'` : value}
      data-allow-uncheck={allowUncheck || undefined}
      onClick={(e) => {
        e.stopPropagation();
        if ((type === 'radio-button' || type === 'radio') && allowUncheck && internalChecked) {
          setInternalChecked(!e.currentTarget.checked, { e });
        }
      }}
      onChange={(e) => {
        if (isDisabled) return;
        setInternalChecked(e.currentTarget.checked, { e });
      }}
    />
  );
  // Checkbox/ Radio 内容为空则不再渲染 span，不存在 0:Number 的情况
  const showLabel = !!(children || label);

  const handleLabelClick = (event: MouseEvent<HTMLSpanElement>) => {
    // 在tree等组件中使用  阻止label触发checked 与expand冲突
    if (props.stopLabelTrigger) {
      event.preventDefault();
    }
  };

  const onInnerClick = (e: MouseEvent<HTMLLabelElement>) => {
    if (isDisabled) return;
    onClick?.({ e });
  };

  return (
    <label
      ref={ref}
      tabIndex={disabled ? undefined : 0}
      className={labelClassName}
      title={props.title}
      style={style}
      {...omit(htmlProps, ['checkAll', 'stopLabelTrigger'])}
      onClick={onInnerClick}
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
