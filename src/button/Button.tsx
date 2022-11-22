import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useRipple from '../_util/useRipple';
import Loading from '../loading';
import { TdButtonProps } from './type';
import { buttonDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';

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

  const [btnDom, setRefCurrent] = useDomRefCallback();
  useRipple(ref?.current || btnDom);

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
    if (!tag && disabled) return 'div';
    return tag || 'button';
  }, [tag, href, disabled]);

  return React.createElement(
    renderTag,
    {
      ...buttonProps,
      href,
      type,
      ref: ref || setRefCurrent,
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
      {suffix && <span className={`${classPrefix}-button__suffix`}>{parseTNode(suffix)}</span>}
    </>,
  );
});

Button.displayName = 'Button';
Button.defaultProps = buttonDefaultProps;

export default Button;
