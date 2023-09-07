import React, { Children, FunctionComponent, cloneElement, useContext, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { TdAnchorItemProps } from './type';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { AnchorContext } from './AnchorContext';
import { anchorItemDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface AnchorItemProps extends TdAnchorItemProps, StyledProps {
  children?: React.ReactNode;
}

const AnchorItem: FunctionComponent<AnchorItemProps & { _level?: number }> = (props) => {
  const { onClick, activeItem, registerItem, unregisterItem } = useContext(AnchorContext);
  const {
    href,
    title,
    target,
    children,
    className,
    _level = 0,
    ...rest
  } = useDefaultProps(props, anchorItemDefaultProps);

  const { classPrefix } = useConfig();

  const titleAttr = typeof title === 'string' ? title : null;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick({ title: titleAttr, href }, e);
  };

  useEffect(() => {
    registerItem(href);
    return () => unregisterItem(href);
  }, [href, registerItem, unregisterItem]);

  const domRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (domRef.current) {
      domRef.current.style.setProperty('--level', `${_level + 1}`);
    }
  }, [_level]);

  return (
    <>
      <div
        ref={domRef}
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
      </div>
      {Children.map(children, (child) => cloneElement(child as any, { _level: _level + 1 }))}
    </>
  );
};

AnchorItem.displayName = 'AnchorItem';

export default AnchorItem;
