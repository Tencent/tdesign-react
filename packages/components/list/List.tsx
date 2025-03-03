import React, { MouseEvent, useImperativeHandle, useMemo, useRef, WheelEvent } from 'react';
import classNames from 'classnames';
import { isString } from 'lodash-es';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import noop from '../_util/noop';
import { TdListProps } from './type';
import { ComponentScrollToElementParams, StyledProps } from '../common';
import Loading from '../loading';
import ListItem from './ListItem';
import ListItemMeta from './ListItemMeta';
import { listDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { useListVirtualScroll } from './hooks/useListVirtualScroll';
import parseTNode from '../_util/parseTNode';

export interface ListProps extends TdListProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

export type ListRef = {
  scrollTo: (params: ComponentScrollToElementParams) => void;
};

/**
 * 列表组件
 */
const List = forwardRefWithStatics(
  (props: ListProps, ref: React.Ref<ListRef>) => {
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
      scroll,
    } = useDefaultProps<ListProps>(props, listDefaultProps);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { classPrefix } = useConfig();
    const [local, t] = useLocaleReceiver('list');

    const listItems = useMemo(
      () => React.Children.map(children, (child: React.ReactElement) => child.props) ?? [],
      [children],
    );

    const { virtualConfig, cursorStyle, listStyle, isVirtualScroll, onInnerVirtualScroll, scrollToElement } =
      useListVirtualScroll(scroll, wrapperRef, listItems);

    const COMPONENT_NAME = `${classPrefix}-list`;

    const handleClickLoad = (e: MouseEvent<HTMLDivElement>) => {
      if (asyncLoading === 'load-more') {
        onLoadMore({ e });
      }
    };

    const handleScroll = (event: WheelEvent<HTMLDivElement>): void => {
      const { currentTarget } = event;
      const { scrollTop, offsetHeight, scrollHeight } = currentTarget;
      const scrollBottom = scrollHeight - scrollTop - offsetHeight;
      if (isVirtualScroll) onInnerVirtualScroll(event as unknown as globalThis.WheelEvent);
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

    useImperativeHandle(ref, () => ({
      scrollTo: scrollToElement,
    }));

    const renderContent = () => (
      <>
        {isVirtualScroll ? (
          <>
            <div style={cursorStyle}></div>
            <ul className={`${COMPONENT_NAME}__inner`} style={listStyle}>
              {virtualConfig.visibleData.map((item, index) => (
                <ListItem key={index} content={item.children}></ListItem>
              ))}
            </ul>
          </>
        ) : (
          <ul className={`${COMPONENT_NAME}__inner`}>{children}</ul>
        )}
      </>
    );

    return (
      <div
        ref={wrapperRef}
        style={{
          ...style,
          position: isVirtualScroll ? 'relative' : undefined,
        }}
        onScroll={handleScroll}
        className={classNames(`${COMPONENT_NAME}`, className, {
          [`${COMPONENT_NAME}--split`]: split,
          [`${COMPONENT_NAME}--stripe`]: stripe,
          [`${COMPONENT_NAME}--vertical-action`]: layout === 'vertical',
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
        })}
      >
        {header && <div className={`${COMPONENT_NAME}__header`}>{parseTNode(header)}</div>}
        {renderContent()}
        {asyncLoading && loadElement}
        {footer && <div className={`${COMPONENT_NAME}__footer`}>{parseTNode(footer)}</div>}
      </div>
    );
  },
  { ListItem, ListItemMeta },
);

List.displayName = 'List';

export default List;
