import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import useRipple from '../_util/useRipple';
import Loading from '../loading';
import { TdButtonProps } from './type';
import { buttonDefaultProps } from './defaultProps';

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
      type,
      theme,
      variant,
      icon,
      disabled,
      loading,
      size,
      block,
      ghost,
      shape,
      children,
      content,
      className,
      onClick,
      ...buttonProps
    }: ButtonProps,
    ref: React.RefObject<HTMLButtonElement>,
  ) => {
    const { classPrefix } = useConfig();

    const btnRef = useRef();
    useRipple(ref || btnRef);

    const hasChildren = typeof children !== 'undefined';
    const hasContent = typeof content !== 'undefined';
    let childrenNode = children;

    if (!hasChildren && hasContent) {
      childrenNode = content;
    }

    let iconNode = icon;
    if (loading) iconNode = <Loading loading={loading} inheritColor={true} />;

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
        {...buttonProps}
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
      >
        {iconNode ? (
          <>
            {iconNode}
            {(hasChildren || hasContent) && <span className={`${classPrefix}-button__text`}>{childrenNode}</span>}
          </>
        ) : (
          <span className={`${classPrefix}-button__text`}>{childrenNode}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
Button.defaultProps = buttonDefaultProps;

export default Button;
