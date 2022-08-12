import classNames from 'classnames';
import React from 'react';
import useConfig from '../hooks/useConfig';
import { TdLinkProps } from './type';

export interface LinkProps extends TdLinkProps, React.HTMLAttributes<HTMLAnchorElement> {}

const Link = React.forwardRef(
  (
    {
      children,
      className,
      underline,
      prefixIcon,
      suffixIcon,
      theme,
      disabled,
      hover = 'underline',
      ...props
    }: LinkProps,
    ref: React.RefObject<HTMLAnchorElement>,
  ) => {
    const { classPrefix } = useConfig();

    return (
      <a
        ref={ref}
        className={classNames(className, [`${classPrefix}-link`, `${classPrefix}-link--hover-${hover}`], {
          [`${classPrefix}-is-underline`]: underline,
          [`${classPrefix}-link--theme-success`]: theme === 'success',
          [`${classPrefix}-link--theme-danger`]: theme === 'danger',
          [`${classPrefix}-link--theme-warning`]: theme === 'warning',
          [`${classPrefix}-is-disabled`]: disabled,
        })}
        {...props}
      >
        {prefixIcon}
        <span
          className={classNames({
            [`${classPrefix}-link__text-prefix`]: !!prefixIcon,
            [`${classPrefix}-link__text-suffix`]: !!suffixIcon,
          })}
        >
          {children}
        </span>
        {suffixIcon}
      </a>
    );
  },
);

Link.displayName = 'Link';

export default Link;
