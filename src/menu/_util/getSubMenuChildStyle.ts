import React from 'react';
import SubMenu from '../SubMenu';
import { MenuBlockType } from './type';

export const getSubMenuChildCount = (children: React.ReactNode) => {
  let count = 0;
  React.Children.forEach(children, (child: React.ReactElement) => {
    if ((child.type as typeof SubMenu).displayName === MenuBlockType.SubMenu) {
      count += getSubMenuChildCount(child.props.children) + 1;
    } else {
      count += 1;
    }
  });

  return count;
};

const MENU_ITEM_HEIGHT = 50;
export const getSubMenuMaxHeight = (children: React.ReactNode) =>
  `${getSubMenuChildCount(children) * MENU_ITEM_HEIGHT}px`;
