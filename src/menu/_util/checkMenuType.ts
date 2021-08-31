import MenuItem from '../MenuItem';
import SubMenu from '../SubMenu';
import { MenuBlockType } from './type';

export const checkIsSubMenu = (child: React.ReactElement) => {
  const { displayName } = child.type as typeof MenuItem | typeof SubMenu;
  return displayName === MenuBlockType.SubMenu;
};

export const checkIsMenuItem = (child: React.ReactElement) => {
  const { displayName } = child.type as typeof MenuItem | typeof SubMenu;
  return displayName === MenuBlockType.MenuItem;
};
