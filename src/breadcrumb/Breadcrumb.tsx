import React from 'react';
import useConfig from '../_util/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { BreadcrumbItem } from './BreadcrumbItem';
import { BreadcrumbProps } from './BreadcrumbProps';

const Breadcrumb = forwardRefWithStatics(
  (props: BreadcrumbProps, ref) => {
    const { children, options, separator, maxItemWidth, ...restProps } = props;
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
      <div ref={ref} className={`${classPrefix}-breadcrumb`} {...restProps}>
        {content}
      </div>
    );
  },
  { BreadcrumbItem },
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
