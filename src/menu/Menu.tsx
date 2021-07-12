import React, { FC } from 'react';
import { ViewListIcon } from '@tencent/tdesign-react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { TdMenuProps } from '../_type/components/menu';
import { MenuContext } from './MenuContext';
import { DEFAULT_MENU_WIDTH } from './_util/constant';
import useMenuContext from './hooks/useMenuContext';
export interface MenuProps extends TdMenuProps, StyledProps {}

const Menu: FC<MenuProps> = (props) => {
  const { className, width = DEFAULT_MENU_WIDTH, children, theme, logo } = props;
  const { classPrefix } = useConfig();
  const { value } = useMenuContext({ ...props, children, mode: 'accordion' });

  // 菜单宽度
  const menuWidthArr = Array.isArray(width) ? width : [width, DEFAULT_MENU_WIDTH[1]];

  const { collapsed, onCollapsed } = value;

  return (
    <MenuContext.Provider value={value}>
      <div
        className={classNames(className, `${classPrefix}-default-menu`, {
          [`${classPrefix}-is-collapsed`]: collapsed,
          [`${classPrefix}-menu-dark`]: theme === 'dark',
        })}
        style={{ width: collapsed ? menuWidthArr[1] : menuWidthArr[0] }}
      >
        <div className={`${classPrefix}-default-menu__inner`}>
          {logo && <div className={`${classPrefix}-menu__logo`}>{logo}</div>}
          <ul className={`${classPrefix}-menu`}>{children}</ul>
        </div>
        <div className={`${classPrefix}-menu__options`}>
          <ViewListIcon
            className={`${classPrefix}-collapsed-icon`}
            onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => onCollapsed({ collapsed: !collapsed, e })}
          />
        </div>
      </div>
    </MenuContext.Provider>
  );
};

export default Menu;
