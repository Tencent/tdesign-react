import React, { forwardRef } from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import LoadingIcon from '../icon/icons/LoadingIcon';
import { TdButtonProps } from '../_type/components/button';

/**
 * 除表格中列出的属性外，支持透传原生 `<button>` 标签支持的属性。
 */
export interface ButtonProps extends TdButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * 按钮组件
 */
const Button = forwardRef(
  (
    {
      theme,
      variant = 'base',
      icon,
      disabled,
      loading,
      size,
      block,
      ghost,
      shape = 'square',
      children,
      className,
      onClick = noop,
      ...buttonProps
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const { classPrefix } = useConfig();

    const hasChildren = typeof children !== 'undefined';

    let iconNode = icon;
    if (loading) iconNode = <LoadingIcon />;

    let renderTheme = theme;

    if (!theme) {
      if (variant === 'base') {
        renderTheme = 'primary';
      } else {
        renderTheme = 'default';
      }
    }

    return (
      <button
        ref={ref}
        className={classNames(
          className,
          [
            `${classPrefix}-button`,
            `${classPrefix}-button--theme-${renderTheme}`,
            `${classPrefix}-button--variant-${variant}`,
          ],
          {
            [`${classPrefix}-button--icon-only`]: iconNode && !hasChildren,
            [`${classPrefix}-button--shape-${shape}`]: shape !== 'square',
            [`${classPrefix}-button--ghost`]: ghost,
            [`${classPrefix}-is-loading`]: loading,
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-size-s`]: size === 'small',
            [`${classPrefix}-size-l`]: size === 'large',
            [`${classPrefix}-size-full-width`]: block,
          },
        )}
        onClick={!disabled && !loading ? onClick : undefined}
        disabled={disabled}
        {...buttonProps}
      >
        {iconNode ? (
          <>
            {iconNode}
            {hasChildren && <span className={`${classPrefix}-button__text`}>{children}</span>}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
