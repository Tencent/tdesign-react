import React, { FunctionComponent, useContext } from 'react';
import classNames from 'classnames';
import { AnchorContext, Item } from './AnchorContext';
import { AnchorBlockType, AnchorStaticProps } from './_util/type';

export interface AnchorItemProp extends Item {
  /**
   * 原生a标签的target属性
   */
  target?: string;
  /**
   * 子元素，可以是嵌套的AnchorItem
   */
  children?: React.ReactNode;
}

const AnchorItem: FunctionComponent<AnchorItemProp> & AnchorStaticProps = (props) => {
  const { onClick, scrollTo, activeItem } = useContext(AnchorContext);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const { href, title } = props;
    if (onClick) {
      onClick(e, { title, href });
    }
    scrollTo({ href, title });
  };
  const { href, title, target, children = [] } = props;
  return (
    <div className={classNames('t-anchor-item', { 't-is-active': activeItem.href === href })}>
      <a href={href} className="t-anchor-item_link" title={title} target={target} onClick={(e) => handleClick(e)}>
        {title}
      </a>
      {/* itmes */}
      {children}
    </div>
  );
};
AnchorItem.blockType = AnchorBlockType.AnchorItem;
AnchorItem.displayName = 'AnchorItem';

export default AnchorItem;
