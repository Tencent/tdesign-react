import classNames from 'classnames';
import React from 'react';
import useConfig from '../hooks/useConfig';
import { TdLinkProps } from './type';

export interface LinkProps extends TdLinkProps, Omit<React.HTMLAttributes<HTMLAnchorElement>, 'children'> {}

const Link = React.forwardRef(
  (
    {
      children,
      className,
      underline,
      prefixIcon,
      suffixIcon,
      theme = 'default',
      disabled,
      hover = 'underline',
      ...props
    }: LinkProps,
    ref: React.RefObject<HTMLAnchorElement>,
  ) => {
    const { classPrefix } = useConfig();

    const handleClick = () => {
      console.log('a');
    };
    return (
      <a
        {...props}
        ref={ref}
        className={classNames(
          className,
          [`${classPrefix}-link`, `${classPrefix}-link--theme-${theme}`, `${classPrefix}-link--hover-${hover}`],
          {
            [`${classPrefix}-is-underline`]: !!underline,
            [`${classPrefix}-is-disabled`]: !!disabled,
          },
        )}
        onClick={handleClick}
      >
        <span className={classNames([`${classPrefix}-link__prefix-icon`])}>{prefixIcon}</span>
        {children}
        <span className={classNames([`${classPrefix}-link__suffix-icon`])}>{suffixIcon}</span>
      </a>
    );
  },
);

Link.displayName = 'Link';

export default Link;
