import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useRipple from '../hooks/useRipple';
import Loading from '../loading';
import { TdButtonProps } from './type';
import { buttonDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import composeRefs from '../_util/composeRefs';

export interface ButtonProps
  extends TdButtonProps,
    Omit<React.AllHTMLAttributes<HTMLElement>, 'content' | 'shape' | 'size' | 'type'> {}

const Button = forwardRef<HTMLElement, ButtonProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, buttonDefaultProps);

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
  useRipple(btnDom);

  const renderChildren = content ?? children;

  let iconNode = icon;
  if (loading) {
    iconNode = <Loading loading={loading} inheritColor />;
  } else if (icon && React.isValidElement(icon)) {
    iconNode = React.cloneElement(icon as React.ReactElement<any>, { 'aria-hidden': true });
  }

  const renderTheme = useMemo(() => {
    if (!theme) return variant === 'base' ? 'primary' : 'default';
    return theme;
  }, [theme, variant]);

  const renderTag = useMemo(() => {
    if (!tag && href && !disabled) return 'a';
    if (!tag && disabled) return 'div';
    return tag || 'button';
  }, [tag, href, disabled]);

  const a11yProps: Record<string, any> = {
    role: renderTag === 'div' ? 'button' : undefined,
    'aria-disabled': renderTag === 'div' && disabled ? true : undefined,
    'aria-busy': loading ? true : undefined,
    'aria-label': !renderChildren && icon && !('aria-label' in buttonProps) ? 'button' : undefined,
    tabIndex: renderTag === 'div' && !disabled ? 0 : undefined,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && !loading) {
      if (e.key === 'Enter') {
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
      if (e.key === ' ') {
        e.preventDefault();
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (!disabled && !loading && e.key === ' ') {
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return React.createElement(
    renderTag,
    {
      ...buttonProps,
      ...a11yProps,
      href: renderTag === 'a' ? href : undefined,
      type: renderTag === 'button' ? type : undefined,
      ref: composeRefs(ref, (node) => setRefCurrent(node as HTMLElement)),
      disabled: renderTag === 'button' ? disabled || loading : undefined,
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
      onKeyDown: renderTag === 'div' ? handleKeyDown : undefined,
      onKeyUp: renderTag === 'div' ? handleKeyUp : undefined,
    },
    <>
      {iconNode}
      {renderChildren && <span className={`${classPrefix}-button__text`}>{renderChildren}</span>}
      {suffix && <span className={`${classPrefix}-button__suffix`}>{parseTNode(suffix)}</span>}
    </>,
  );
});

Button.displayName = 'Button';

export default Button;
