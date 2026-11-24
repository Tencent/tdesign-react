import React, { useRef, useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { TdListProps } from './type';
import TLoading from '../loading';
import type { StyledProps } from '../common';
import parseTNode from '../_util/parseTNode';
import getScrollParent from '../_util/getScrollParent';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';

export interface ListProps extends TdListProps, StyledProps {
  children?: React.ReactNode;
}

const List: React.FC<ListProps> = (props) => {
  const { className, style, asyncLoading, header, footer, children, onScroll } = useDefaultProps(props, {});

  const listClass = usePrefixClass('list');

  const LOADING_TEXT_MAP = {
    loading: '加载中', // TODO: i18n
    'load-more': '加载更多',
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  const onLoadMore = () => {
    if (asyncLoading === 'load-more') {
      props.onLoadMore?.();
    }
  };

  const handleScroll = useMemoizedFn((e: React.WheelEvent<HTMLDivElement> | Event): void => {
    const targetElement = e.currentTarget as HTMLElement;
    const { scrollTop, offsetHeight, scrollHeight } = targetElement;
    const bottomDistance = scrollHeight - scrollTop - offsetHeight;

    onScroll?.(bottomDistance, scrollTop);
  });

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const scrollParent = getScrollParent(element);
    if (!scrollParent) return;

    scrollParent.addEventListener('scroll', handleScroll);
    return () => {
      removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div ref={wrapperRef} className={classNames(listClass, className)} style={style}>
      {parseTNode(header)}
      {parseTNode(children)}
      <div className={`${listClass}__loading--wrapper`} onClick={onLoadMore}>
        {typeof props.asyncLoading === 'string' && ['loading', 'load-more'].includes(props.asyncLoading) && (
          <TLoading
            indicator={props.asyncLoading === 'loading'}
            text={LOADING_TEXT_MAP[props.asyncLoading]}
            className={`${listClass}__loading`}
          />
        )}
      </div>
      {parseTNode(footer)}
    </div>
  );
};

List.displayName = 'List';

export default List;
