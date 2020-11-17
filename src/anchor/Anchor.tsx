import React, { FunctionComponent, useState } from 'react';
import 'tslib';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import { AnchorContext, Link } from './AnchorContext';

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
  onclick?: (e: React.MouseEvent, link: Link) => void;
  /**
   * 切换锚点时触发事件
   */
  onChange?: (currentLink: Link, prefLink: Link) => void;
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
  const [actLink, setActLink] = useState<Link>({ href: '', title: '' });
  const { affix = false, children, onclick, onChange } = props;

  const handleClick = (e: React.MouseEvent<HTMLElement>, link: Link) => {
    console.log('handleClick', e, link);
    onclick && onclick(e, link);
  };
  const handleScrollTo = (link: Link) => {
    setActLink(link);
  };

  return (
    <AnchorContext.Provider
      value={{
        onChange,
        onClick: handleClick,
        scrollTo: handleScrollTo,
        actLink,
      }}
    >
      <div className={classNames('t-anchor', { 't-affix': affix })}>
        <div className="t-anchor_line">
          <div className="point"></div>
        </div>
        <div className="t-anchor__content">{children}</div>
      </div>
    </AnchorContext.Provider>
  );
};

Anchor.displayName = 'Anchor';

export default Anchor;
