import React from 'react';
import { MenuValue } from '../type';
import { checkIsMenuItem, checkIsSubMenu } from './checkMenuType';

const checkSubMenuChildrenActive = (children: React.ReactNode, active: MenuValue) => {
  let activeFlag = false;
  React.Children.forEach(children, (child: React.ReactElement<any>) => {
    if (activeFlag) return;
    if (checkIsSubMenu(child)) {
      activeFlag = checkSubMenuChildrenActive(child.props.children, active);
    } else if (checkIsMenuItem(child)) {
      activeFlag = active === child.props.value ? true : activeFlag;
    }
  });
  return activeFlag;
};
export default checkSubMenuChildrenActive;
