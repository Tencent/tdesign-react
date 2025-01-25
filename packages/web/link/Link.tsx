import classNames from 'classnames';
import React from 'react';
import useConfig from '../hooks/useConfig';
import { TdLinkProps } from './type';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';
import { linkDefaultProps } from './defaultProps';

export interface LinkProps extends TdLinkProps, StyledProps {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {
    children,
    content,
    className,
    underline,
    prefixIcon,
    suffixIcon,
    theme,
    disabled,
    hover,
    onClick,
    href,
    size,
    ...otherProps
  } = useDefaultProps<LinkProps>(props, linkDefaultProps);

  const { classPrefix } = useConfig();

  const childNode = content || children;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      return;
    }
    onClick?.(e);
  };

  return (
    <a
      {...otherProps}
      href={disabled || !href ? undefined : href}
      ref={ref}
      className={classNames(className, [`${classPrefix}-link`, `${classPrefix}-link--theme-${theme}`], {
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-is-disabled`]: !!disabled,
        [`${classPrefix}-is-underline`]: !!underline,
        [`${classPrefix}-link--hover-${hover}`]: !disabled,
      })}
      onClick={handleClick}
    >
      {prefixIcon && <span className={classNames([`${classPrefix}-link__prefix-icon`])}>{parseTNode(prefixIcon)}</span>}
      {childNode}
      {suffixIcon && <span className={classNames([`${classPrefix}-link__suffix-icon`])}>{parseTNode(suffixIcon)}</span>}
    </a>
  );
});

Link.displayName = 'Link';

export default Link;
