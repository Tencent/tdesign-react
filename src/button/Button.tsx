import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useRipple from '../_util/useRipple';
import Loading from '../loading';
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
      type = 'button',
      theme,
      variant = 'base',
      icon,
      disabled,
      loading,
      size,
      block,
      ghost,
      shape = 'rectangle',
      children,
      className,
      onClick = noop,
      ...buttonProps
    }: ButtonProps,
    ref: React.RefObject<HTMLButtonElement>,
  ) => {
    const { classPrefix } = useConfig();

    const btnRef = useRef();
    useRipple(ref || btnRef);

    const hasChildren = typeof children !== 'undefined';

    let iconNode = icon;
    if (loading) iconNode = <Loading loading={loading} />;

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
        ref={ref || btnRef}
        type={type}
        className={classNames(
          className,
          [
            `${classPrefix}-button`,
            `${classPrefix}-button--theme-${renderTheme}`,
            `${classPrefix}-button--variant-${variant}`,
          ],
          {
            [`${classPrefix}-button--shape-${shape}`]: shape !== 'rectangle',
            [`${classPrefix}-button--ghost`]: ghost,
            [`${classPrefix}-is-loading`]: loading,
            [`${classPrefix}-is-disabled`]: disabled || loading,
            [`${classPrefix}-size-s`]: size === 'small',
            [`${classPrefix}-size-l`]: size === 'large',
            [`${classPrefix}-size-full-width`]: block,
          },
        )}
        onClick={!disabled && !loading ? onClick : undefined}
        disabled={disabled || loading}
        {...buttonProps}
      >
        {iconNode ? (
          <>
            {iconNode}
            {hasChildren && <span className={`${classPrefix}-button__text`}>{children}</span>}
          </>
        ) : (
          <span className={`${classPrefix}-button__text`}>{children}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
