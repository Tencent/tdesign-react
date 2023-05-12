import React, { forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-react';
import isFunction from 'lodash/isFunction';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useCommonClassName from '../_util/useCommonClassName';
import { BreadcrumbItemProps } from './BreadcrumbProps';
import { BreadcrumbContext } from './BreadcrumbContext';
import parseTNode from '../_util/parseTNode';
import { breadcrumbItemDefaultProps } from './defaultProps';
import { isNodeOverflow } from '../_util/dom';
import { TooltipLite } from '../tooltip';
import useDefaultProps from '../hooks/useDefaultProps';

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
    content,
    ...restProps
  } = useDefaultProps<BreadcrumbItemProps>(props, breadcrumbItemDefaultProps);

  const { maxItemWidthInContext, separator: separatorInContext } = useContext(BreadcrumbContext);
  const breadcrumbText = useRef<HTMLSpanElement>(null);
  const [isCutOff, setIsCutOff] = useState(false);

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

  useEffect(() => {
    if (!breadcrumbText.current) return;
    return setIsCutOff(isNodeOverflow(breadcrumbText.current));
  }, [breadcrumbText]);

  const textContent = (
    <span className={textWrapperClassName} style={maxWidthForItem}>
      {isFunction(icon) ? icon() : icon}
      <span ref={breadcrumbText} className={textClassName}>
        {children || content}
      </span>
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
      {isCutOff ? <TooltipLite content={children || content}>{itemContent}</TooltipLite> : itemContent}
      <span className={separatorClassName}>{separatorContent}</span>
    </div>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

export default BreadcrumbItem;
