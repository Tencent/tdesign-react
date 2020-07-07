import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';
import { ListProps } from './ListProps';
import { Icon } from '@tdesign/react';

/**
 * 列表组件
 */
const List = forwardRef((props: ListProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    header,
    footer,
    loading,
    size = 'middle',
    split = true,
    stripe = false,
    actionLayout = 'horizontal',
    children,
    className,
    loadMore = noop,
    onScroll = noop,
    style = {},
  } = props;

  const { classPrefix } = useConfig();

  const handleClickLoad = (): void => {
    if (loading === 'load-more') {
      loadMore();
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLElement>): void => {
    const { currentTarget } = event;
    const { scrollTop, offsetHeight, scrollHeight } = currentTarget;
    const scrollBottom = scrollHeight - scrollTop - offsetHeight;
    onScroll(event, { scrollTop, scrollBottom });
  };

  const loadElement =
    loading === undefined ? (
      ''
    ) : (
      <div
        className={classNames(`${classPrefix}-list__load`, {
          [`${classPrefix}-list__load--loading`]: loading === 'loading',
          [`${classPrefix}-list__load--load-more`]: loading === 'load-more',
        })}
        onClick={handleClickLoad}
      >
        {loading === 'loading' ? (
          <>
            <Icon name="loading" />
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
        [`${classPrefix}-list--vertical-action`]: actionLayout === 'vertical',
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
});

List.displayName = 'List';

export default List;
