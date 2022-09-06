import React, { forwardRef, useRef, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useRipple from '../_util/useRipple';
import Loading from '../loading';
import { TdButtonProps } from './type';
import { buttonDefaultProps } from './defaultProps';

export interface ButtonProps
  extends TdButtonProps,
    Omit<React.AllHTMLAttributes<HTMLElement>, 'content' | 'shape' | 'size' | 'type'> {}

const Button = forwardRef((props: ButtonProps, ref: React.RefObject<HTMLElement>) => {
  const {
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
    suffix,
    href,
    tag,
    onClick,
    ...buttonProps
  } = props;

  const { classPrefix } = useConfig();

  const btnRef = useRef();
  useRipple(ref || btnRef);

  const renderChildren = content ?? children;

  let iconNode = icon;
  if (loading) iconNode = <Loading loading={loading} inheritColor={true} />;

  const renderTheme = useMemo(() => {
    if (!theme) {
      if (variant === 'base') return 'primary';
      return 'default';
    }
    return theme;
  }, [theme, variant]);

  const renderTag = useMemo(() => {
    if (!tag && href) return 'a';
    return tag || 'button';
  }, [tag, href]);

  return React.createElement(
    renderTag,
    {
      ...buttonProps,
      href,
      type,
      ref: ref || btnRef,
      disabled: disabled || loading,
      className: classNames(
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
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-size-full-width`]: block,
        },
      ),
      onClick: !disabled && !loading ? onClick : undefined,
    },
    <>
      {iconNode}
      {renderChildren && <span className={`${classPrefix}-button__text`}>{renderChildren}</span>}
      {suffix && <span className={`${classPrefix}-button__suffix`}>{suffix}</span>}
    </>,
  );
});

Button.displayName = 'Button';
Button.defaultProps = buttonDefaultProps;

export default Button;
