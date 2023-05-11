import React from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import BreadcrumbItem from './BreadcrumbItem';
import { BreadcrumbProps } from './BreadcrumbProps';
import { BreadcrumbContext } from './BreadcrumbContext';
import { breadcrumbDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { TdBreadcrumbItemProps } from './type';

const Breadcrumb = forwardRefWithStatics(
  (props: BreadcrumbProps, ref: React.Ref<HTMLDivElement>) => {
    const { children, options, separator, maxItemWidth, className, ...restProps } = useDefaultProps(
      props,
      breadcrumbDefaultProps,
    );
    const { classPrefix } = useConfig();

    let content = children;
    if (options && options.length) {
      content = options.map((option, index) => {
        const targetProps: TdBreadcrumbItemProps = {};
        if (option.target) {
          targetProps.target = option.target;
        }
        return (
          <BreadcrumbItem
            {...targetProps}
            key={index}
            maxWidth={option.maxWidth}
            disabled={option.disabled}
            href={option.href}
            to={option.to}
            router={option.router}
            replace={option.replace}
            separator={separator}
            maxItemWidth={maxItemWidth}
            icon={option.icon}
          >
            {option.content || option.children}
          </BreadcrumbItem>
        );
      });
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

export default Breadcrumb;
