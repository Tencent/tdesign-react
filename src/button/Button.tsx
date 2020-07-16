import React, { forwardRef } from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { Icon } from '../icon';

/**
 * 除表格中列出的属性外，支持透传原生 `<button>` 标签支持的属性。
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮类型
   * @default 'line'
   */
  theme?:
    | 'line'
    | 'primary'
    | 'dashed'
    | 'warning'
    | 'warning-line'
    | 'link'
    | 'ghost'
    | 'ghost-line';

  /**
   * 按钮是否为禁用状态
   * @default false
   */
  disabled?: boolean;

  /**
   * 按钮是否为加载状态
   * @default false
   */
  loading?: boolean;

  /**
   * 图标
   */
  icon?: React.ReactNode;

  /**
   * 按钮大小
   * @default 'default'
   */
  size?: 'large' | 'default' | 'small';

  /**
   * 按钮是否为块级元素
   * @default false
   */
  block?: boolean;

  // /**
  //  * 按钮形状
  //  * @default false
  //  */
  // round?: boolean;
}

/**
 * 按钮组件
 */
const Button = forwardRef((props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    theme = 'line',
    icon,
    disabled,
    loading,
    size,
    block,
    children,
    className,
    onClick = noop,
    ...buttonProps
  } = props;

  const { classPrefix } = useConfig();

  const hasChildren = typeof children !== 'undefined';

  return (
    <button
      ref={ref}
      className={classNames(className, `${classPrefix}-button`, {
        [`${classPrefix}-button--${theme}`]: hasChildren,
        [`${classPrefix}-button--icon`]: !hasChildren && icon && theme !== 'primary',
        [`${classPrefix}-button--icon-primary`]: !hasChildren && icon && theme === 'primary',
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-size-full-width`]: block,
      })}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled}
      {...buttonProps}
    >
      {icon ? (
        <>
          {typeof icon === 'string' ? <Icon name={icon} /> : icon}
          {hasChildren && <span className={`${classPrefix}-button__text`}>{children}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
