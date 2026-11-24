import _SideBar from './SideBar';
import _SideBarItem from './SideBarItem';

import './style';

export type { SideBarProps } from './SideBar';
export type { SideBarItemProps } from './SideBarItem';
export * from './type';

export const SideBar = _SideBar;
export const SideBarItem = _SideBarItem;

export default {
  SideBar,
  SideBarItem,
};
