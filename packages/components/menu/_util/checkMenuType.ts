import MenuItem from '../MenuItem';
import SubMenu from '../SubMenu';
import MenuGroup from '../MenuGroup';
import { MenuBlockType } from './type';

export const checkIsSubMenu = (child: React.ReactElement) => {
  if (!child) return false;
  const { displayName } = child.type as typeof MenuItem | typeof SubMenu;
  return displayName === MenuBlockType.SubMenu;
};

export const checkIsMenuItem = (child: React.ReactElement) => {
  if (!child) return false;
  const { displayName } = child.type as typeof MenuItem | typeof SubMenu;
  return displayName === MenuBlockType.MenuItem;
};

export const checkIsMenuGroup = (child: React.ReactElement) => {
  if (!child) return false;
  const { displayName } = child.type as typeof MenuGroup;
  return displayName === MenuBlockType.MenuGroup;
};
