import { createContext } from 'react';
import { MenuState } from './Menu';
import noop from '../_util/noop';
import { MenuNameType } from './_util/type';

export interface MenuContextType {
  // common context
  /**
   * 顶部导航 -- 二级菜单类型、dropdown为下拉形式、tile为平铺
   */
  mode?: 'dropdown' | 'title' | 'accordion' | 'popup';
  /**
   * 激活菜单的 name 值
   */
  active: MenuNameType;
  /**
   * 选择菜单（MenuItem）时触发
   */
  onChange: (menuName: MenuNameType) => void;
  /**
   * 修改非受控组件状态
   */
  setState: React.Dispatch<React.SetStateAction<MenuState>>;

  // menu context
  /**
   * (menu context)是否开启手风琴模式，开启后每次至多展开一个子菜单，若显式传入expand，则取 expand 第一项
   */
  multiple?: boolean;
  /**
   * (menu context)展开项
   */
  expand?: MenuNameType[];
  /**
   * (menu context)当 展开/收起 子菜单时触发
   */
  onExpand?: (menuName: MenuNameType, allExpand: MenuNameType[]) => void;

  // headMenu context
  /**
   * (headMenu context)高度
   */
  height?: string | number;
}

export const MenuContext = createContext<MenuContextType>({
  mode: 'dropdown',
  active: null,
  onChange: noop,
  multiple: false,
  expand: [],
  onExpand: noop,
  setState: noop,
  height: '64px',
});
