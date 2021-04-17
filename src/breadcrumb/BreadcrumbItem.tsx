import React, { useMemo } from 'react';
import classNames from 'classnames';

import useConfig from '../_util/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
import IconChevronRight from '../icon/icons/ChevronRightIcon';

import { BreadcrumbItemProps } from './BreadcrumbProps';

export const BreadcrumbItem = React.forwardRef<HTMLDivElement, BreadcrumbItemProps>((props, ref) => {
  const {
    children,
    theme = 'light',
    separator = <IconChevronRight color="rgba(0,0,0,.3)" />,
    disabled,
    maxItemWidth,
    maxWidth,
    href,
    to,
    target,
    router,
    replace,
    ...restProps
  } = props;

  const { classPrefix } = useConfig();
  const commonClassNames = useCommonClassName();

  const breadcrumbItemClassNames = classNames(`${classPrefix}-breadcrumb__item`, theme);
  const textWrapperClassName = `${classPrefix}-breadcrumb__inner`;
  const textClassNames = classNames(`${classPrefix}-breadcrumb--text-oveflow`, {
    [commonClassNames.STATUS.disabled]: disabled,
  });
  const separatorClassName = `${classPrefix}-breadcrumb__separator`;
  const linkClassName = `${classPrefix}-link`;

  const maxWith = useMemo(
    () => ({
      maxWidth: maxWidth || maxItemWidth || '120' + 'px',
    }),
    [maxItemWidth, maxWidth],
  );

  const textContent = (
    <span className={textWrapperClassName} style={maxWith}>
      {children}
    </span>
  );

  let itemContent = <span className={textClassNames}>{textContent}</span>;
  if ((href || to) && !disabled) {
    const handleRouting = () => {
      if (href || !router) return;

      replace ? router.replace(to) : router.push(to);
    };
    itemContent = (
      <a className={classNames(textClassNames, linkClassName)} href={href} target={target} onClick={handleRouting}>
        {textContent}
      </a>
    );
  }

  const separatorContent = typeof separator === 'function' ? separator() : separator;

  return (
    <div className={breadcrumbItemClassNames} ref={ref} {...restProps}>
      {itemContent}
      <span className={separatorClassName}>{separatorContent}</span>
    </div>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';
