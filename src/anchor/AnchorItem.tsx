import React, { FunctionComponent, useContext, useEffect } from 'react';
import classNames from 'classnames';
import { TdAnchorItemProps } from './type';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { AnchorContext } from './AnchorContext';
import { anchorItemDefaultProps } from './defaultProps';

export interface AnchorItemProps extends TdAnchorItemProps, StyledProps {
  children?: React.ReactNode;
}

const AnchorItem: FunctionComponent<AnchorItemProps> = (props) => {
  const { onClick, activeItem, registerItem, unregisterItem } = useContext(AnchorContext);
  const { href, title, target, children, className, ...rest } = props;

  const { classPrefix } = useConfig();

  const titleAttr = typeof title === 'string' ? title : null;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick({ title: titleAttr, href }, e);
  };

  useEffect(() => {
    registerItem(href);
    return () => unregisterItem(href);
  }, [href, registerItem, unregisterItem]);

  return (
    <div
      {...rest}
      className={classNames(
        `${classPrefix}-anchor__item`,
        { [`${classPrefix}-is-active`]: activeItem === href },
        className,
      )}
    >
      <a
        href={href}
        className={classNames(`${classPrefix}-anchor__item-link`)}
        title={titleAttr}
        target={target}
        onClick={(e) => handleClick(e)}
      >
        {title}
      </a>
      {children}
    </div>
  );
};

AnchorItem.displayName = 'AnchorItem';
AnchorItem.defaultProps = anchorItemDefaultProps;

export default AnchorItem;
