import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';

import parseTNode from '../_util/parseTNode';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useRipple from '../hooks/useRipple';
import Loading from '../loading';
import { buttonDefaultProps } from './defaultProps';

import type { TdButtonProps } from './type';

export interface ButtonProps
  extends TdButtonProps, Omit<React.AllHTMLAttributes<HTMLElement>, 'content' | 'shape' | 'size' | 'type'> {}

const Button = forwardRef((originProps: ButtonProps, ref: React.RefObject<HTMLElement>) => {
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
    const nonInteractive = disabled || loading;
    // 显式指定 tag 时尊重调用方，只有不可交互的 a 才降级成 div，避免 disabled 无条件抹掉 tag
    if (tag) return nonInteractive && tag === 'a' ? 'div' : tag;
    // 无 tag 时：href 且可交互才是可导航锚点，disabled / loading 都退回 div
    if (href) return nonInteractive ? 'div' : 'a';
    return disabled ? 'div' : 'button';
  }, [tag, href, disabled, loading]);

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

export default Button;
