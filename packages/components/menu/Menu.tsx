import React from 'react';
import classNames from 'classnames';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { DEFAULT_MENU_WIDTH } from './_util/constant';
import { menuDefaultProps } from './defaultProps';
import HeadMenu from './HeadMenu';
import useMenuContext from './hooks/useMenuContext';
import { MenuContext } from './MenuContext';
import MenuGroup from './MenuGroup';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';

import type { StyledProps } from '../common';
import type { TdMenuProps } from './type';

export interface MenuProps extends TdMenuProps, StyledProps {
  children?: React.ReactNode;
}

const Menu = forwardRefWithStatics(
  (originalProps: MenuProps, ref: React.RefObject<HTMLDivElement>) => {
    const props = useDefaultProps<MenuProps>(originalProps, menuDefaultProps);
    const { className, width = DEFAULT_MENU_WIDTH, children, theme, logo, operations, style } = props;
    const { classPrefix } = useConfig();
    const { value } = useMenuContext({ ...props, children, mode: 'accordion' });

    // 菜单宽度
    const menuWidthArr = Array.isArray(width) ? width : [width, DEFAULT_MENU_WIDTH[1]];

    const { collapsed } = value;

    return (
      <MenuContext.Provider value={value}>
        <div
          ref={ref}
          className={classNames(`${classPrefix}-default-menu`, className, {
            [`${classPrefix}-is-collapsed`]: collapsed,
            [`${classPrefix}-menu--dark`]: theme === 'dark',
          })}
          style={{ width: collapsed ? menuWidthArr[1] : menuWidthArr[0], ...style }}
        >
          <div className={`${classPrefix}-default-menu__inner`}>
            {logo && <div className={`${classPrefix}-menu__logo`}>{logo}</div>}
            <ul className={classNames(`${classPrefix}-menu`, `${classPrefix}-menu--scroll`)}>{children}</ul>
            {operations && <div className={`${classPrefix}-menu__operations`}>{operations}</div>}
          </div>
        </div>
      </MenuContext.Provider>
    );
  },
  { HeadMenu, SubMenu, MenuItem, MenuGroup },
);

Menu.displayName = 'Menu';

export default Menu;
