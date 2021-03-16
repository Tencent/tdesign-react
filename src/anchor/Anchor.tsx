import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import 'tslib';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import { AnchorContext, Item } from './AnchorContext';
import { ANCHOR_SHARP_REGEXP, getOffsetTop, getAttach, getScroll, scrollTo, ANCHOR_CONTAINER } from './utils';

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
  onChange?: (currentLink: string, prevLink: string) => void;
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

interface IntervalRef {
  // 收集 anchor-item
  items: string[];
  // 当前选中的
  activeItem: string;
  // 容器
  scrollContainer: ANCHOR_CONTAINER;
  // 收集各项 item 的信息与节点
  handleScrollLock: boolean;
}

const Anchor: FunctionComponent<AnchorProps> = (props) => {
  const { affix = false, bounds = 5, targetOffset = 0, attach = '', children, onClick, onChange } = props;

  const [activeItem, setActiveItem] = useState<string>('');
  const [pointStyle, setPointStyle] = useState<{ top: string; height?: string }>({ top: '0px', height: '0px' });

  const anchorEl = useRef(null);
  const intervalRef = useRef<IntervalRef>({
    items: [],
    activeItem,
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

  const getAnchorTarget = (href: string): HTMLElement => {
    const matcher = href.match(ANCHOR_SHARP_REGEXP);
    if (!matcher) return;
    return document.getElementById(matcher[1]);
  };

  const handleScrollTo = async (link: string): Promise<void> => {
    const anchor = getAnchorTarget(link);
    if (!anchor) return;
    setActiveItem(link);
    intervalRef.current.handleScrollLock = true;
    const { scrollContainer } = intervalRef.current;
    const scrollTop = getScroll(scrollContainer);
    const offsetTop = getOffsetTop(anchor, scrollContainer);
    const top = scrollTop + offsetTop - targetOffset;
    await scrollTo(top, {
      container: scrollContainer,
    });
    intervalRef.current.handleScrollLock = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>, item: Item) => {
    onClick && onClick(e, item);
    console.log(item.href);
    handleScrollTo(item.href);
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
    intervalRef.current.scrollContainer = getAttach(attach);
    const { scrollContainer, handleScrollLock } = intervalRef.current;
    const handleScroll = () => {
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
      console.log('active', active);
      if (active !== intervalRef.current.activeItem) {
        // 当前选中的 上一个
        onChange && onChange(active, intervalRef.current.activeItem);
        intervalRef.current.activeItem = active;
        setActiveItem(active);
      }
    };

    handleScroll();

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [attach, bounds, onChange, targetOffset]);

  return (
    <AnchorContext.Provider
      value={{
        onClick: handleClick,
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
