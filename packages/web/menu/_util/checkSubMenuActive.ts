import React, { ReactElement } from 'react';
import { MenuValue } from '../type';
import { checkIsSubMenu } from './checkMenuType';
import checkSubMenuChildrenActive from './checkSubMenuChildrenActive';

const checkSubMenuActive = (children: React.ReactNode, active: MenuValue): ReactElement =>
  React.Children.toArray(children).find(
    (child: React.ReactElement) =>
      checkIsSubMenu(child) &&
      (child.props.value === active || checkSubMenuChildrenActive(child.props.children, active)),
  ) as ReactElement;
export default checkSubMenuActive;
