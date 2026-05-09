import type { ReactElement } from 'react';
import React from 'react';

import { checkIsSubMenu } from './checkMenuType';
import checkSubMenuChildrenActive from './checkSubMenuChildrenActive';

import type { MenuValue } from '../type';

const checkSubMenuActive = (children: React.ReactNode, active: MenuValue): ReactElement =>
  React.Children.toArray(children).find(
    (child: React.ReactElement<any>) =>
      checkIsSubMenu(child) &&
      (child.props.value === active || checkSubMenuChildrenActive(child.props.children, active)),
  ) as ReactElement;
export default checkSubMenuActive;
