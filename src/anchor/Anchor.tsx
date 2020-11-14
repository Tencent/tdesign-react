import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { CloseIcon, PromptFillIcon, SuccessFillIcon, WarningFillIcon } from '../icon';
import { Interface } from 'readline';

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
  Onclick?: (e: Event, link: Link) => void;
  /**
   * 切换锚点时触发事件
   */
  onChange?: (e: Event, link: Link) => void;
}

interface Link {
  /**
   * 锚点链接
   */
  href: string;
  /**
   * 锚点描述
   */
  title: string;
}

export interface AnchorLink extends Link {
  /**
   * 原生a标签的target属性
   */
  target?: string;
  /**
   * 子元素，可以是嵌套的AnchorLink
   */
  chirldren?: string;
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

const Anchor = forwardRef((props: AnchorProps, ref: React.Ref<HTMLDivElement>) => {
  const { ...anchorProps } = props;

  const [closed, setClosed] = React.useState(false);

  return (
    <div className="t-anchor t-affix">
        <div className="t-anchor__line">
          <div className="point"></div>
        </div>
        <div className="t-anchor__content">
          <div className="t-anchor__item">
            <a href="#default" title="默认">默认</a>
          </div>
          <div className="t-anchor__item">
            <a href="#leveln" title="多级锚点">多级锚点</a>
          </div>
          <div className="t-anchor__item"><a href="#act" title="状态">状态</a></div>
          <div className="t-anchor__item">
            <a href="#size" title="尺寸">尺寸</a>
            <div className="t-anchor__item">
              <a href="#size-l" title="尺寸">尺寸-大</a>
            </div>
            <div className="t-anchor__item">
              <a href="#size-s" title="尺寸">尺寸-小</a>
            </div>
          </div>
        </div>
      </div>
  );
});

Anchor.displayName = 'Anchor';

export default Anchor;
