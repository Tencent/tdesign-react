import React, { FunctionComponent, useContext, useEffect } from 'react';
import classNames from 'classnames';
import { TdAnchorItemProps } from '../_type/components/anchor-item';
import { AnchorContext } from './AnchorContext';
import { AnchorBlockType, AnchorStaticProps } from './_util/type';

export interface AnchorItemProp extends TdAnchorItemProps {}

const AnchorItem: FunctionComponent<AnchorItemProp> & AnchorStaticProps = (props) => {
  const { onClick, activeItem, registerItem, unregisterItem } = useContext(AnchorContext);
  const { href, title, target, children = [] } = props;

  const titleAttr = typeof title === 'string' ? title : null;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick({ title: titleAttr, href }, e);
  };

  useEffect(() => {
    registerItem(href);
    return () => unregisterItem(href);
  }, [href, registerItem, unregisterItem]);

  return (
    <div className={classNames('t-anchor-item', { 't-is-active': activeItem === href })}>
      <a href={href} className="t-anchor-item_link" title={titleAttr} target={target} onClick={(e) => handleClick(e)}>
        {title}
      </a>
      {children}
    </div>
  );
};
AnchorItem.blockType = AnchorBlockType.AnchorItem;
AnchorItem.displayName = 'AnchorItem';

export default AnchorItem;
