import React, { MouseEvent, WheelEvent } from 'react';
import classNames from 'classnames';
import { LoadingIcon } from '@tencent/tdesign-icons-react';
import useConfig from '../_util/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import noop from '../_util/noop';
import { TdListProps } from '../_type/components/list';
import { StyledProps } from '../_type';
import ListItem from './ListItem';
import ListItemMeta from './ListItemMeta';

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
      size = 'medium',
      split = true,
      stripe = false,
      layout = 'horizontal',
      children,
      className,
      onLoadMore = noop,
      onScroll = noop,
      style = {},
    } = props;

    const { classPrefix } = useConfig();

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

    // prettier-ignore
    const loadElement = asyncLoading === undefined ? (
      ''
    ) : (
    <div
      className={classNames(`${classPrefix}-list__load`, {
        [`${classPrefix}-list__load--loading`]: asyncLoading === 'loading',
        [`${classPrefix}-list__load--load-more`]: asyncLoading === 'load-more',
      })}
      onClick={handleClickLoad}
    >
      {asyncLoading === 'loading' ? (
        <>
          <LoadingIcon />
          <span>正在加载中，请稍等</span>
        </>
      ) : (
        <span>点击加载更多</span>
      )}
    </div>
    );

    return (
      <div
        ref={ref}
        style={style}
        onScroll={handleScroll}
        className={classNames(className, 't-list', {
          [`${classPrefix}-list--split`]: split,
          [`${classPrefix}-list--stripe`]: stripe,
          [`${classPrefix}-list--vertical-action`]: layout === 'vertical',
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
        })}
      >
        {header}
        <ul className={`${classPrefix}-list-items`}>{children}</ul>
        {loadElement}
        {footer}
      </div>
    );
  },
  { ListItem, ListItemMeta },
);

List.displayName = 'List';

export default List;
