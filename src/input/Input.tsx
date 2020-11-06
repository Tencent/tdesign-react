import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { Icon } from '../icon';

/**
 * 除表格中列出的属性外，支持透传原生 `<input>` 标签支持的属性。
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 输入框的值
   */
  value?: string;

  /**
   * 输入框的默认值
   */
  defaultValue?: string;

  /**
   * 大小
   * @default 'default'
   */
  size?: 'large' | 'default' | 'small';
  
  /**
   * 是否为禁用状态
   * @default false
   */
  disabled?: boolean;

  /**
   * 状态
   * @default 'default'
   */
  status?: 'default' | 'success' | 'warning' | 'error';

  /**
   * 前置图标
   */
  prefixIcon?: React.ReactNode;

  /**
   * 后置图标
   */
  suffixIcon?: React.ReactNode;
}

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: React.ReactNode) => {
  let result: React.ReactNode = icon;
  if (typeof icon === 'string' && icon) {
    result = <Icon name={icon} />;
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
  const { disabled, status, size, className, style, prefixIcon, suffixIcon, ...inputProps } = props;

  const { classPrefix } = useConfig();
  const componentType = 'input';
  const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
  const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIcon);

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(className, `${classPrefix}-${componentType}`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-is-${status}`]: status,
        [`${classPrefix}-${componentType}--prefix`]: prefixIcon,
        [`${classPrefix}-${componentType}--suffix`]: suffixIcon,
      })}
    >
      {prefixIconContent}
      <input
        className={classNames(className, `${classPrefix}-${componentType}__inner`)}
        disabled={disabled}
        {...inputProps}
      />
      {suffixIconContent}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
