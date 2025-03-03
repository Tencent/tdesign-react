import { createContext } from 'react';
import noop from '../_util/noop';
import { TdMenuProps, MenuValue } from './type';

export interface MenuState {
  active?: MenuValue;
  expanded?: MenuValue[];
  collapsed?: boolean;
}

export type SetMenuState = React.Dispatch<React.SetStateAction<MenuState>>;

export type MenuMode = 'title' | 'accordion' | 'popup';

interface MenuContextType
  extends Pick<TdMenuProps, 'onChange' | 'value' | 'expanded' | 'expandMutex' | 'expandType' | 'theme' | 'collapsed'> {
  /**
   * 修改非受控组件状态
   */
  setState: SetMenuState;
  /**
   * 顶部导航 -- 二级菜单类型、dropdown为下拉形式、tile为平铺
   */
  mode?: MenuMode;
  onExpand?: (value: MenuValue, expanded: MenuValue[]) => void;
  active?: MenuValue;
}

export const MenuContext = createContext<MenuContextType>({
  setState: noop,
  onExpand: noop,
});
