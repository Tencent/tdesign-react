import React, { forwardRef, useContext, useRef } from 'react';
import classNames from 'classnames';
import { isBoolean } from 'lodash-es';
import { Check1Icon as TdCheck1Icon, Remove1Icon as TdRemove1Icon } from 'tdesign-icons-react';

import { omit } from '../_util/helper';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { Tooltip } from '../tooltip';

import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import type { TdCheckboxProps } from '../checkbox/type';
import type { StyledProps } from '../common';

export interface CheckProps extends TdCheckboxProps, StyledProps {
  type: 'radio' | 'radio-button' | 'checkbox';
  allowUncheck?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLLabelElement>) => void;
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
    onClick,
    onKeyDown,
    tooltipProps,
    ...htmlProps
  } = props;

  const { classPrefix } = useConfig();
  const { Check1Icon, Remove1Icon } = useGlobalIcon({
    Check1Icon: TdCheck1Icon,
    Remove1Icon: TdRemove1Icon,
  });

  const TOnChange: (
    checked: boolean,
    context: {
      e: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLInputElement>;
    },
  ) => void = onChange;

  const [internalChecked, setInternalChecked] = useControlled(props, 'checked', TOnChange);

  const labelClassName = classNames(`${classPrefix}-${type}`, className, {
    [`${classPrefix}-is-checked`]: internalChecked,
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-indeterminate`]: indeterminate,
  });

  const readOnly = props.readOnly || props.readonly;
  const isDisabled = disabled || readOnly;

  const inputRef = useRef<HTMLInputElement>(null);

  // 原生 checkbox 的键盘交互：Space 切换选中态；radio 仅在未选中时响应 Space；Enter 不响应
  const handleKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key !== ' ' && e.key !== 'Spacebar') return;
    // 焦点在原生 input 上时浏览器会自行处理，避免重复切换
    if (e.target === inputRef.current) return;
    e.preventDefault();
    if (isDisabled) return;
    if (type === 'checkbox') {
      inputRef.current?.click();
      return;
    }
    if (!internalChecked) inputRef.current?.click();
  };

  const input = (
    <input
      ref={inputRef}
      readOnly={readOnly}
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
  let checkboxIcon = null;
  if (type === 'checkbox') {
    checkboxIcon = indeterminate ? <Remove1Icon /> : <Check1Icon />;
  }

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

  const checkboxInput = tooltipProps ? (
    <Tooltip {...tooltipProps}>
      <span className={`${classPrefix}-${type}__input`}>{checkboxIcon}</span>
    </Tooltip>
  ) : (
    <span className={`${classPrefix}-${type}__input`}>{checkboxIcon}</span>
  );

  return (
    <label
      ref={ref}
      tabIndex={disabled ? undefined : 0}
      className={labelClassName}
      title={props.title}
      style={style}
      {...omit(htmlProps, ['checkAll', 'stopLabelTrigger', 'readonly'])}
      onClick={onInnerClick}
      onKeyDown={handleKeyDown}
    >
      {input}
      {checkboxInput}
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
