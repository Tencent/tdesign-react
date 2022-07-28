import React from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import BreadcrumbItem from './BreadcrumbItem';
import { BreadcrumbProps } from './BreadcrumbProps';
import { BreadcrumbContext } from './BreadcrumbContext';
import { breadcrumbDefaultProps } from './defaultProps';

const Breadcrumb = forwardRefWithStatics(
  (props: BreadcrumbProps, ref) => {
    const { children, options, separator, maxItemWidth, className, ...restProps } = props;
    const { classPrefix } = useConfig();

    let content = children;
    if (options && options.length) {
      content = options.map((option, index) => (
        <BreadcrumbItem
          key={index}
          maxWidth={option.maxWidth}
          disabled={option.disabled}
          href={option.href}
          target={option.target}
          to={option.to}
          router={option.router}
          replace={option.replace}
          separator={separator}
          maxItemWidth={maxItemWidth}
        >
          {option.content || option.children}
        </BreadcrumbItem>
      ));
    }

    return (
      <BreadcrumbContext.Provider
        value={{
          maxItemWidthInContext: maxItemWidth,
          separator,
        }}
      >
        <div ref={ref} className={classNames(`${classPrefix}-breadcrumb`, className)} {...restProps}>
          {content}
        </div>
      </BreadcrumbContext.Provider>
    );
  },
  { BreadcrumbItem },
);

Breadcrumb.displayName = 'Breadcrumb';
Breadcrumb.defaultProps = breadcrumbDefaultProps;

export default Breadcrumb;
