import React from 'react';
import classNames from 'classnames';
import { StyledProps, TNode } from '../common';
import { TdMenuGroupProps } from './type';
import useConfig from '../hooks/useConfig';
import { cacularPaddingLeft } from './_util/cacularPaddingLeft';

export interface MenuGroupProps extends TdMenuGroupProps, StyledProps {
  children?: TNode;
  level?: number;
}

const MenuGroup: React.FC<MenuGroupProps> = ({ title, className, style, children, level = 1 }) => {
  const { classPrefix } = useConfig();

  const itemAndGroupPaddingBias = 28;
  const menuPaddingLeft = cacularPaddingLeft(level - 1) - itemAndGroupPaddingBias;

  return (
    <div className={classNames(className, `${classPrefix}-menu-group`)} style={style}>
      <div className={classNames(`${classPrefix}-menu-group__title`)} style={{ paddingLeft: `${menuPaddingLeft}px` }}>
        {title}
      </div>
      {children}
    </div>
  );
};

MenuGroup.displayName = 'MenuGroup';

export default MenuGroup;
