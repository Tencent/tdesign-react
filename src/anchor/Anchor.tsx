import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import { StyledProps } from '../_type';
import { TdAnchorProps } from '../_type/components/anchor';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';
import { getScrollContainer } from '../_util/dom';
import Affix from '../affix';
import { AnchorContext, Item } from './AnchorContext';
import { getOffsetTop, getScroll, scrollTo, AnchorContainer } from './_util/dom';
import AnchorItem from './AnchorItem';
import AnchorTarget from './AnchorTarget';

export interface AnchorProps extends TdAnchorProps, StyledProps {
  children?: React.ReactNode;
}

interface IntervalRef {
  // 收集 anchor-item
  items: string[];
  // 容器
  scrollContainer: AnchorContainer;
  // 收集各项 item 的信息与节点
  handleScrollLock: boolean;
}

const ANCHOR_SHARP_REGEXP = /#(\S+)$/;

const Anchor = (props: AnchorProps) => {
  const {
    affixProps,
    bounds = 5,
    targetOffset = 0,
    container = '',
    size = 'medium',
    children,
    cursor,
    onClick = noop,
    onChange = noop,
  } = props;

  const { classPrefix } = useConfig();

  const [activeItem, setActiveItem] = useState<string>('');
  const [cursorStyle, setCursorStyle] = useState<{ top: string; height?: string; opacity: number }>({
    top: '0px',
    height: '0px',
    opacity: 0,
  });

  const anchorEl = useRef(null);
  const intervalRef = useRef<IntervalRef>({
    items: [],
    scrollContainer: window,
    handleScrollLock: false,
  });

  /**
   * 注册锚点
   * @param href 链接
   */
  const registerItem = (href: string): void => {
    const { items } = intervalRef.current;
    if (ANCHOR_SHARP_REGEXP.test(href) && items.indexOf(href) < 0) items.push(href);
  };

  const unregisterItem = (href: string): void => {
    const { items } = intervalRef.current;
    intervalRef.current.items = items.filter((item) => href !== item);
  };

  const getAnchorTarget = (href: string): HTMLElement => document.querySelector(href);

  const handleScrollTo = (link: string) => {
    const anchor = getAnchorTarget(link);
    if (!anchor) return;
    if (isFunction(onChange)) onChange(link, activeItem);
    setActiveItem(link);
    intervalRef.current.handleScrollLock = true;
    const { scrollContainer } = intervalRef.current;
    const scrollTop = getScroll(scrollContainer);
    const offsetTop = getOffsetTop(anchor, scrollContainer);
    const top = scrollTop + offsetTop - targetOffset;
    scrollTo(top, {
      container: scrollContainer,
    }).then(() => {
      intervalRef.current.handleScrollLock = false;
    });
  };

  const handleClick = (item: Item, e: React.MouseEvent<HTMLDivElement>) => {
    onClick({ e, ...item });
    handleScrollTo(item.href);
  };

  useEffect(() => {
    // update point style
    const pointEl = anchorEl.current.querySelector(`.${classPrefix}-is-active>a`) as HTMLAnchorElement;
    if (!pointEl) {
      setCursorStyle(null);
    } else {
      const { offsetTop: top, offsetHeight: height } = pointEl;
      setCursorStyle({ top: `${top}px`, height: `${height}px`, opacity: 1 });
    }
  }, [activeItem, classPrefix]);

  const handleScroll = useCallback(() => {
    const { scrollContainer, handleScrollLock } = intervalRef.current;
    if (handleScrollLock) return;
    const { items } = intervalRef.current;
    const filters: { top: number; href: string }[] = [];
    let active = '';
    // 找出所有当前top小于预设值
    items.forEach((href) => {
      const anchor = getAnchorTarget(href);
      if (!anchor) return;
      const top = getOffsetTop(anchor, scrollContainer);
      if (top <= bounds + targetOffset) {
        filters.push({
          href,
          top,
        });
      }
    });

    // 找出小于预设值集合中top最大的
    if (filters.length) {
      const latest = filters.reduce((prev, cur) => (prev.top > cur.top ? prev : cur));
      active = latest.href;
    }
    if (active !== activeItem) {
      if (isFunction(onChange)) onChange(active, activeItem);
      setActiveItem(active);
    }
  }, [activeItem, bounds, onChange, targetOffset]);

  useEffect(() => {
    intervalRef.current.scrollContainer = getScrollContainer(container);
    const { scrollContainer } = intervalRef.current;

    handleScroll();
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [container, handleScroll]);

  const anchorClass = classNames(`${classPrefix}-anchor`, {
    [`${classPrefix}-size-s`]: size === 'small',
    [`${classPrefix}-size-m`]: size === 'medium',
    [`${classPrefix}-size-l`]: size === 'large',
  });

  const CursorCmp = () => {
    if (isFunction(cursor)) return cursor();
    if (isEmpty(cursor)) return <div className="cursor"></div>;
    return cursor;
  };

  const Cmp = (
    <AnchorContext.Provider
      value={{
        onClick: handleClick,
        activeItem,
        registerItem,
        unregisterItem,
      }}
    >
      <div className={anchorClass} ref={anchorEl}>
        <div className={`${classPrefix}-anchor_line`}>
          <div className="cursor-wrapper" style={cursorStyle}>
            {CursorCmp()}
          </div>
        </div>
        {children}
      </div>
    </AnchorContext.Provider>
  );

  return isEmpty(affixProps) ? Cmp : <Affix {...affixProps}>{Cmp}</Affix>;
};

Anchor.AnchorItem = AnchorItem;
Anchor.AnchorTarget = AnchorTarget;

Anchor.displayName = 'Anchor';

export default Anchor;
