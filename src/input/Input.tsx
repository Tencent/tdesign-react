import React, { forwardRef, ReactNode, FunctionComponent } from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { Icon } from '@tdesign/react';

/**
 * Input 组件支持的属性。
 *
 * 除表格中列出的属性外，支持透传原生 `<input>` 标签支持的属性。
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 是否为禁用状态
   * @default false
   */
  disabled?: boolean;

  /**
   * 大小
   * @default 'default'
   */
  size?: 'large' | 'default' | 'small';

  /**
   * 状态
   * @default 'default'
   */
  status?: 'default' | 'success' | 'warning' | 'error';

  /**
   * 前置图标
   * @default ''
   */
  prefixIcon?: number | string | ReactNode | FunctionComponent;

  /**
   * 后置图标
   * @default ''
   */
  suffixIcon?: number | string | ReactNode | FunctionComponent;
}

const renderIcon = (classPrefix, type, Content) => {
  let result: ReactNode;

  if (typeof Content === 'string' && Content) {
    result = <Icon name={Content} />;
  } else if (typeof Content === 'function') {
    result = <Content />;
  } else if (typeof Content !== 'undefined') {
    result = Content;
  }

  if (result || typeof result === 'number') {
    result = <span className={`${classPrefix}-input__${type}`}>{result}</span>;
  }

  return result;
};

/**
 * 组件
 */
const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    value = '',
    placeholder,
    disabled,
    readOnly,
    autoComplete,
    status,
    size,
    className,
    prefixIcon,
    suffixIcon,
    onInput = noop,
    onBlur = noop,
    onFocus = noop,
    onChange = noop,
    onKeyDown = noop,
    onKeyUp = noop,
    onKeyPress = noop,
    name,
    type,
    ...wrapperProps
  } = props;

  const { classPrefix } = useConfig();
  const componentType = 'input';
  const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
  const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIcon);

  return (
    <div
      ref={ref}
      className={classNames(className, `${classPrefix}-${componentType}`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-is-${status}`]: status,
        [`${classPrefix}-${componentType}--prefix`]: prefixIcon,
        [`${classPrefix}-${componentType}--suffix`]: suffixIcon,
      })}
      {...wrapperProps}
    >
      {prefixIconContent}
      <input
        name={name}
        type={type}
        className={classNames(className, `${classPrefix}-${componentType}__inner`)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onKeyPress={onKeyPress}
      />
      {suffixIconContent}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
