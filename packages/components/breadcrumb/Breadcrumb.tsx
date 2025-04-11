import React, { Children, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { EllipsisIcon } from 'tdesign-icons-react';
import { isFunction } from 'lodash-es';
import log from '@tdesign/common-js/log/index';
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
    const { children, options, separator, maxItemWidth, className, maxItems, itemsAfterCollapse, itemsBeforeCollapse, ellipsis, ...restProps } = useDefaultProps(
      props,
      breadcrumbDefaultProps,
    );
    const { classPrefix } = useConfig();

    const renderOptionsToItems = useCallback((options: TdBreadcrumbItemProps[]) => {
      if (!options || !options.length) {
        return undefined;
      }

      return options.map((option, index) => {
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
            content={option.content}
          >
            {option.content || option.children}
          </BreadcrumbItem>
        );
      });
    }, [maxItemWidth, separator]);

    const renderEllipsis = useCallback((items: TdBreadcrumbItemProps[]) => {
      if (!ellipsis) {
        return <EllipsisIcon />;
      }

      if (isFunction(ellipsis)) {
        return ellipsis({items, separator});
      }

      return ellipsis;
    }, [ellipsis, separator]);

    const content = useMemo(() => {
      let items = renderOptionsToItems(options) || Children.toArray(children);

      const itemsCount = items?.length || 0;

      if (!items || !maxItems) {
        return items;
      }

      if (maxItems >= itemsCount) {
        return items;
      }

      // 配置有误的情况，不显示省略并告警
      if (
        maxItems &&
        (!itemsBeforeCollapse || !itemsAfterCollapse)
      ) {
        log.error('Breadcrumb', '需要设置 itemsBeforeCollapse 和 itemsAfterCollapse 属性来控制省略号前后的显示项数。');
        return items;
      }

      if (
        maxItems &&
        maxItems < (itemsAfterCollapse || 0) + (itemsBeforeCollapse || 0)
      ) {
        log.error('Breadcrumb', `maxItems={${maxItems}} 必须大于或等于 itemsBeforeCollapse={${itemsBeforeCollapse}} + itemsAfterCollapse={${itemsAfterCollapse}}`);
        return items;
      }

      const startCount = itemsBeforeCollapse;
      const endCount = itemsAfterCollapse;

      const collapsedItems = items.slice(startCount, itemsCount - endCount);

      const beforeItems = items.slice(0, startCount);
      const afterItems = items.slice(itemsCount - endCount);

      const ellipsis = renderEllipsis(collapsedItems.map((item) => item.props));

      items = [
        ...beforeItems,
        <BreadcrumbItem key="ellipsis" readOnly>{ellipsis}</BreadcrumbItem>,
        ...afterItems,
      ];

      return items;
    }, [renderOptionsToItems, options, children, maxItems, itemsBeforeCollapse, itemsAfterCollapse, renderEllipsis]);

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
