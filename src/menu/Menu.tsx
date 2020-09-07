import React, { FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import noop from '../_util/noop';
import { MenuContext } from './MenuContext';
import { MenuNameType } from './_util/type';

interface MenuProps extends StyledProps {
  /**
   * 主题，可选值为 light、dark（待支持）
   * @default light
   */
  theme?: 'light' | 'dark';
  /**
   * 激活菜单的 name 值
   */
  active?: MenuNameType;
  /**
   * 展开的 Submenu 的 name 集合
   * @default []
   */
  expand?: MenuNameType[];
  /**
   * 是否开启手风琴模式，开启后每次至多展开一个子菜单。受控组件请通过expand控制，否则若受控组件显式传入expand，则取 expand 第一项
   * @default false
   */
  multiple?: boolean;
  /**
   * 侧边宽度，宽度范围200-256px，中间宽度以8的倍数为档位变化
   * @default 256px
   */
  width?: '200px' | '208px' | '216px' | '224px' | '232px' | '240px' | '248px' | '256px';
  /**
   * 是否收起
   * @default false
   */
  collapsed?: boolean;
  /**
   * 收起的宽度
   * @default 64px
   */
  collapsedWidth?: string | number;
  /**
   * 二级菜单类型、accordion为常规形式、popup为侧边气泡形式
   * @default accordion
   */
  mode?: 'accordion' | 'popup';
  /**
   * 自定义logo
   */
  logo?: React.ReactNode;
  /**
   * 底部自定义功能区
   */
  options?: React.ReactNode;
  /**
   * 选择菜单（MenuItem）时触发
   */
  onChange?: (menuName?: MenuNameType) => void;
  /**
   * 当 展开/收起 子菜单时触发
   */
  onExpand?: (menuName?: MenuNameType, allExpand?: MenuNameType[]) => void;
}
export interface MenuState {
  active?: MenuNameType;
  expand?: MenuNameType[];
}
const Menu: FunctionComponent<MenuProps> = (props) => {
  const {
    active,
    expand = [],
    multiple = false,
    width = '256px',
    collapsed = false,
    collapsedWidth = '64px',
    mode = 'accordion',
    logo,
    options,
    onChange = noop,
    onExpand = noop,
    children,
    className,
    style,
  } = props;
  const { classPrefix } = useConfig();
  const [state, setState] = useState<MenuState>({
    active: null,
    expand: [],
  });
  const contextExpand = (() => {
    if (props.expand === undefined) {
      return state.expand;
    }
    return expand && expand.length && multiple ? expand.slice(0, 1) : expand;
  })();

  return (
    <MenuContext.Provider
      value={{
        active: props.active !== undefined ? active : state.active,
        expand: contextExpand,
        multiple,
        mode,
        onChange,
        onExpand,
        setState,
      }}
    >
      <div
        className={classNames(className, `${classPrefix}-default-menu`, {
          [`${classPrefix}-is-collapsed`]: collapsed,
        })}
        style={{ width: collapsed ? collapsedWidth : width, ...style }}
      >
        <div className={`${classPrefix}-default-menu__inner`}>
          {logo && <div className={`${classPrefix}-menu__logo`}>{logo} </div>}
          <ul className={`${classPrefix}-menu`}>{children}</ul>
          {options && <div className={`${classPrefix}-menu__options`}>{options} </div>}
        </div>
      </div>
    </MenuContext.Provider>
  );
};
Menu.displayName = 'Menu';
export default Menu;
