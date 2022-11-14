import React, { forwardRef, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useCommonClassName from '../_util/useCommonClassName';

import { BreadcrumbItemProps } from './BreadcrumbProps';
import { BreadcrumbContext } from './BreadcrumbContext';
import parseTNode from '../_util/parseTNode';
import { breadcrumbItemDefaultProps } from './defaultProps';

const BreadcrumbItem = forwardRef<HTMLDivElement, BreadcrumbItemProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const commonClassNames = useCommonClassName();
  const { ChevronRightIcon } = useGlobalIcon({ ChevronRightIcon: TdChevronRightIcon });

  const {
    children,
    separator,
    disabled,
    maxItemWidth,
    maxWidth,
    icon,
    href,
    to,
    target,
    router,
    replace,
    className,
    ...restProps
  } = props;

  const { maxItemWidthInContext, separator: separatorInContext } = useContext(BreadcrumbContext);

  const breadcrumbItemClassNames = classNames(`${classPrefix}-breadcrumb__item`);
  const textWrapperClassName = `${classPrefix}-breadcrumb__inner`;
  const textClassName = `${classPrefix}-breadcrumb__inner-text`;

  const textClassNames = classNames(`${classPrefix}-breadcrumb--text-overflow`, {
    [commonClassNames.STATUS.disabled]: disabled,
  });
  const separatorClassName = `${classPrefix}-breadcrumb__separator`;
  const linkClassName = `${classPrefix}-link`;

  const maxWidthForItem = useMemo(
    () => ({
      maxWidth: maxWidth || maxItemWidth || maxItemWidthInContext || '120px',
    }),
    [maxItemWidth, maxWidth, maxItemWidthInContext],
  );

  const textContent = (
    <span className={textWrapperClassName} style={maxWidthForItem}>
      {typeof icon === 'function' ? icon() : icon}
      <span className={textClassName}>{children}</span>
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

  const separatorInProps = parseTNode(separator);
  const separatorContent = separatorInProps || separatorInContext || (
    <ChevronRightIcon style={{ color: 'rgba(0,0,0,.3)' }} />
  );

  return (
    <div className={classNames(breadcrumbItemClassNames, className)} ref={ref} {...restProps}>
      {itemContent}
      <span className={separatorClassName}>{separatorContent}</span>
    </div>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbItem.defaultProps = breadcrumbItemDefaultProps;

export default BreadcrumbItem;
