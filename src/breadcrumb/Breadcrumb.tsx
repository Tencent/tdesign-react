import React from 'react';
import useConfig from '../_util/useConfig';
import { BreadcrumbItem } from './BreadcrumbItem';
import { BreadcrumbProps } from './BreadcrumbProps';

export const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>((props, ref) => {
  const { children, options, theme = 'light', separator, maxItemWidth = '120', ...restProps } = props;
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
        theme={theme}
        separator={separator}
        maxItemWidth={maxItemWidth}
      >
        {option.default || option.content}
      </BreadcrumbItem>
    ));
  }

  return (
    <div ref={ref} className={`${classPrefix}-breadcrumb`} {...restProps}>
      {content}
    </div>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
