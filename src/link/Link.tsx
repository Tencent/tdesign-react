import classNames from 'classnames';
import React from 'react';
import useConfig from '../hooks/useConfig';
import { TdLinkProps } from './type';
import parseTNode from '../_util/parseTNode';

export interface LinkProps extends TdLinkProps, Omit<React.HTMLAttributes<HTMLAnchorElement>, 'children'> {}

const Link = React.forwardRef(
  (
    {
      children,
      content,
      className,
      underline,
      prefixIcon,
      suffixIcon,
      theme = 'default',
      disabled,
      hover = 'underline',
      onClick,
      href,
      size,
      ...props
    }: LinkProps,
    ref: React.RefObject<HTMLAnchorElement>,
  ) => {
    const { classPrefix } = useConfig();

    const childNode = content || children;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (disabled) return;
      onClick?.(e);
    };

    return (
      <a
        {...props}
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
        {prefixIcon && (
          <span className={classNames([`${classPrefix}-link__prefix-icon`])}>{parseTNode(prefixIcon)}</span>
        )}
        {childNode}
        {suffixIcon && (
          <span className={classNames([`${classPrefix}-link__suffix-icon`])}>{parseTNode(suffixIcon)}</span>
        )}
      </a>
    );
  },
);

Link.displayName = 'Link';

export default Link;
