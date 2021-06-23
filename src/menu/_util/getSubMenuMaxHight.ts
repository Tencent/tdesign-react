import React from 'react';
import { SubMenu } from '..';
import { MenuBlockType } from './type';

export const getSubMenuMaxHight = (children: React.ReactNode) => {
  let count = 0;
  React.Children.forEach(children, (child: React.ReactElement) => {
    if ((child.type as typeof SubMenu).displayName === MenuBlockType.SubMenu) {
      count += getSubMenuMaxHight(child.props.children) + 1;
    } else {
      count += 1;
    }
  });

  return count;
};
