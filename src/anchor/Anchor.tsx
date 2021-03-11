import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import 'tslib';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import { AnchorContext, Item } from './AnchorContext';
import { ANCHOR_SHARP_REGEXP, getOffsetTop } from './utils';

export interface AnchorProps extends StyledProps {
  /**
   * 用于固定Anchor, 依赖Affix组件
   */
  affix?: boolean;
  /**
   * 判定锚点激活的区域边界
   */
  bounds?: number;
  /**
   * 锚点定位时候的偏移（距离顶部n时，切换到当前锚点）
   */
  targetOffset?: number;
  /**
   * 指定滚动容器
   */
  attach?: string | Function;
  /**
   * 切换锚点时触发事件
   */
  onChange?: (currentItem: Item, prevItem: Item) => void;
  /**
   * 点击锚点时触发事件
   */
  onClick?: (e: React.MouseEvent, item: Item) => void;
}

export interface AnchorTarget {
  /**
   * 原生属性ID
   */
  id: string;
  /**
   * 渲染标签
   */
  tag?: string;
}

// 收集各项 item 的信息与节点
let items: string[] = [];

const Anchor: FunctionComponent<AnchorProps> = (props) => {
  const { affix = false, bounds = 5, targetOffset = 0, children, onClick, onChange } = props;
  // 当前选中 item
  const [activeItem, setActiveItem] = useState<string>('');
  const [pointStyle, setPointStyle] = useState<null | { top: string; height: string }>(null);

  const anchorEl = useRef(null);
  let handleScrollLock = false;

  const registerItem = (href: string): void => {
    if (ANCHOR_SHARP_REGEXP.test(href) && items.indexOf(href) < 0) items.push(href);
  };

  const unregisterItem = (href: string): void => {
    items = items.filter((item) => href !== item);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>, item: Item) => {
    onClick && onClick(e, item);
  };

  const getAnchorTarget = (href: string): HTMLElement => {
    const matcher = href.match(ANCHOR_SHARP_REGEXP);
    if (!matcher) {
      return;
    }
    const anchor = document.getElementById(matcher[1]);
    if (!anchor) {
      return;
    }
    return anchor;
  };

  const handleScrollTo = (href: string) => {
    const anchor = getAnchorTarget(href);
    setActiveItem(href);
    if (!anchor) return;
    handleScrollLock = true;
  };

  useEffect(() => {
    // update point style
    const pointEl = anchorEl.current.querySelector('.t-is-active>a') as HTMLAnchorElement;
    if (!pointEl) {
      setPointStyle(null);
    } else {
      const { offsetTop: top, offsetHeight: height } = pointEl;
      setPointStyle({ top: `${top}px`, height: `${height}px` });
    }
  }, [activeItem]);

  useEffect(() => {
    const handleScroll = () => {
      if (handleScrollLock) return;
      const filters: { top: number; href: string }[] = [];
      let active = '';
      // 找出所有当前top小于预设值
      items.forEach((href) => {
        const anchor = getAnchorTarget(href);
        if (!anchor) {
          return;
        }
        const top = getOffsetTop(anchor, window);
        if (top < bounds + targetOffset) {
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
      setActiveItem(active);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bounds, handleScrollLock, targetOffset]);

  return (
    <AnchorContext.Provider
      value={{
        onChange,
        onClick: handleClick,
        scrollTo: handleScrollTo,
        activeItem,
        registerItem,
        unregisterItem,
      }}
    >
      <div className={classNames('t-anchor', { 't--affix': affix })} ref={anchorEl}>
        <div className="t-anchor_line">
          <div className="point" style={pointStyle}></div>
        </div>
        {children}
      </div>
    </AnchorContext.Provider>
  );
};

Anchor.displayName = 'Anchor';

export default Anchor;
