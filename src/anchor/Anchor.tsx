import React, { FunctionComponent, useState, useRef } from 'react';
import 'tslib';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import { AnchorContext, Item } from './AnchorContext';

export interface AnchorProps extends StyledProps {
  /**
   * 用于固定Anchor, 依赖Affix组件
   */
  affix?: boolean;
  /**
   * 锚点偏移以及Affix固定偏移, 传递给Affix
   */
  offsetTop?: number;
  /**
   * 与offsetTop功能类似, 仅作用于Affix
   */
  offsetBottom?: number;
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
  container?: string | Function;
  /**
   * 指定当前高亮的锚点
   */
  getCurrentAnchor?: () => string;
  /**
   * 是否显示小圆点
   */
  showInkInFixed?: boolean;
  /**
   * 传递AnchorLink
   */
  children: React.ReactNode;
  /**
   * 点击锚点时触发事件
   */
  onClick?: (e: React.MouseEvent, item: Item) => void;
  /**
   * 切换锚点时触发事件
   */
  onChange?: (currentLink: Item, prevItem: Item) => void;
}

export interface AnchorTarget {
  /**
   * 原生属性ID
   */
  id: string;
  /**
   * 内容
   */
  children: React.ReactNode;
  /**
   * 渲染标签
   */
  tag?: string;
}

const Anchor: FunctionComponent<AnchorProps> = (props) => {
  const [activeItem, setActiveItem] = useState<Item>({ href: '', title: '' });
  const [pointTop, setPointTop] = useState<number | null>(null);
  const { affix = false, children, onClick, onChange } = props;
  const anchorEl = useRef(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>, item: Item) => {
    // console.log('handleClick', e, item);
    setPointTop(e.currentTarget.offsetTop);
    onClick && onClick(e, item);
  };
  const handleScrollTo = (item: Item) => {
    setActiveItem(item);
  };

  return (
    <AnchorContext.Provider
      value={{
        onChange,
        onClick: handleClick,
        scrollTo: handleScrollTo,
        activeItem,
      }}
    >
      <div className={classNames('t-anchor', { 't-affix': affix })} ref={anchorEl}>
        <div className="t-anchor_line">
          <div className="point" style={{ top: `${pointTop}px`, left: '0px' }}></div>
        </div>
        {children}
      </div>
    </AnchorContext.Provider>
  );
};

Anchor.displayName = 'Anchor';

export default Anchor;
