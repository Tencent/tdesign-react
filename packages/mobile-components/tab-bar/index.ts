import './style/index.js';

import _TabBar from './TabBar';
import _TabBarItem from './TabBarItem';

export type { TabBarProps } from './TabBar';
export type { TabBarItemProps } from './TabBarItem';
export * from './type';

export const TabBar = _TabBar;
export const TabBarItem = _TabBarItem;
export default {
  TabBar,
  TabBarItem,
};
