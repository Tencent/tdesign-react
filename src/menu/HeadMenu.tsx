import React, { FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import noop from '../_util/noop';
import { MenuContext } from './MenuContext';
import { MenuState } from './Menu';
import { MenuNameType } from './_util/type';

interface HeadMenuProps extends StyledProps {
  /**
   * 主题，可选值为 light、dark
   * @default light
   */
  theme?: 'light' | 'dark';
  /**
   * 二级菜单类型、dropdown为下拉形式、tile为平铺
   * @default dropdown
   */
  mode?: 'dropdown' | 'title';
  /**
   * 顶部导航自定义高度
   * @default 60px
   */
  height?: string | number;
  /**
   * logo
   */
  logo?: React.ReactNode;
  /**
   * 右侧自定义功能区
   */
  options?: React.ReactNode;
  /**
   * 激活菜单的 name 值
   */
  active?: MenuNameType;
  /**
   * 选择菜单（MenuItem）时触发
   */
  onChange?: (name: MenuNameType) => void;
}
const HeadMenu: FunctionComponent<HeadMenuProps> = (props) => {
  const { classPrefix } = useConfig();
  const {
    theme = 'light',
    mode = 'dropdown',
    height = '60px',
    logo,
    options,
    active,
    onChange = noop,
    children,
    className,
    style,
  } = props;
  const [state, setState] = useState<MenuState>({
    active: null,
  });
  return (
    <MenuContext.Provider
      value={{
        mode,
        active: active !== undefined ? active : state.active,
        onChange,
        height,
        setState,
      }}
    >
      <div
        className={classNames(className, `${classPrefix}-head-menu`, {
          [`${classPrefix}-menu--dark`]: theme === 'dark',
          [`${classPrefix}-menu--light`]: theme === 'light',
          [`${classPrefix}-menu-mode__tile`]: mode === 'title',
          [`${classPrefix}-menu-mode__dropdown`]: mode === 'dropdown',
        })}
        style={{ height, lineHeight: height, ...style }}
      >
        <div className={`${classPrefix}-head-menu__inner`}>
          {logo && <div className={`${classPrefix}-menu__logo`}>{logo} </div>}
          <ul className={`${classPrefix}-menu`}>{children}</ul>
          {options && <div className={`${classPrefix}-menu__options`}>{options} </div>}
        </div>
      </div>
    </MenuContext.Provider>
  );
};
HeadMenu.displayName = 'HeadMenu';

export default HeadMenu;
