import React, { MouseEvent, WheelEvent } from 'react';
import classNames from 'classnames';

import isString from 'lodash/isString';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import noop from '../_util/noop';
import { TdListProps } from './type';
import { StyledProps } from '../common';
import Loading from '../loading';
import ListItem from './ListItem';
import ListItemMeta from './ListItemMeta';
import { listDefaultProps } from './defaultProps';

export interface ListProps extends TdListProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

/**
 * 列表组件
 */
const List = forwardRefWithStatics(
  (props: ListProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      header,
      footer,
      asyncLoading,
      size,
      split,
      stripe,
      layout,
      children,
      className,
      onLoadMore = noop,
      onScroll = noop,
      style,
    } = props;

    const { classPrefix } = useConfig();
    const [local, t] = useLocaleReceiver('list');

    const handleClickLoad = (e: MouseEvent<HTMLDivElement>) => {
      if (asyncLoading === 'load-more') {
        onLoadMore({ e });
      }
    };

    const handleScroll = (event: WheelEvent<HTMLDivElement>): void => {
      const { currentTarget } = event;
      const { scrollTop, offsetHeight, scrollHeight } = currentTarget;
      const scrollBottom = scrollHeight - scrollTop - offsetHeight;
      onScroll({ e: event, scrollTop, scrollBottom });
    };

    const loadElement = isString(asyncLoading) ? (
      <div
        className={classNames(`${classPrefix}-list__load`, {
          [`${classPrefix}-list__load--loading`]: asyncLoading === 'loading',
          [`${classPrefix}-list__load--load-more`]: asyncLoading === 'load-more',
        })}
        onClick={handleClickLoad}
      >
        {asyncLoading === 'loading' && (
          <div>
            <Loading loading={true} />
            <span>{t(local.loadingText)}</span>
          </div>
        )}
        {asyncLoading === 'load-more' && <span>{t(local.loadingMoreText)}</span>}
      </div>
    ) : (
      asyncLoading
    );

    return (
      <div
        ref={ref}
        style={style}
        onScroll={handleScroll}
        className={classNames(`${classPrefix}-list`, className, {
          [`${classPrefix}-list--split`]: split,
          [`${classPrefix}-list--stripe`]: stripe,
          [`${classPrefix}-list--vertical-action`]: layout === 'vertical',
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
        })}
      >
        {header && <div className={`${classPrefix}-list__header`}>{header}</div>}
        <ul className={`${classPrefix}-list__inner`}>{children}</ul>
        {asyncLoading && loadElement}
        {footer && <div className={`${classPrefix}-list__footer`}>{footer}</div>}
      </div>
    );
  },
  { ListItem, ListItemMeta },
);

List.displayName = 'List';
List.defaultProps = listDefaultProps;

export default List;
