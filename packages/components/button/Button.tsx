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

  // disabled/loading 时禁止渲染可导航的 <a href>：锚点不识别 disabled 属性，仍会触发导航（issue #4490）
  const nonInteractive = disabled || loading;
  const renderTag = useMemo(() => {
    if (!tag && disabled) return 'div';
    // href 场景：loading 同样回退，避免可导航锚点（此前仅 disabled 生效）
    if (!tag && href && nonInteractive) return 'div';
    if (!tag && href) return 'a';
    // 显式 tag='a' 且不可交互时同样回退，避免渲染可导航锚点
    if (tag === 'a' && nonInteractive) return 'div';
    return tag || 'button';
  }, [tag, href, disabled, nonInteractive]);

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
