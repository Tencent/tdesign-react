import React, { FunctionComponent, isValidElement, useContext } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { MenuContext } from './MenuContext';
import { MenuStaticProps, MenuBlockType } from './_util/type';

export interface MenuItemProps extends StyledProps {
  /**
   * 菜单项的唯一标识
   */
  name: string;
  /**
   * 菜单项icon
   */
  icon?: React.ReactNode;
  /**
   * 跳转的链接，支持React-Router对象
   */
  route?: string | React.ReactNode;
  /**
   * a 链接的 target 属性
   * @default _self
   */
  target?: string;
  /**
   * 是否禁用菜单项
   * @default false
   */
  disabled?: boolean;
}

const MenuItem: FunctionComponent<MenuItemProps> & MenuStaticProps = (props) => {
  const { name, icon, route, target, disabled, children, className, style } = props;
  const { classPrefix } = useConfig();
  const { active, height, mode, onChange, setState } = useContext(MenuContext);
  const renderChildren = () => {
    if (typeof route === 'string') {
      return (
        <a href={`${route}`} target={target || '_self'}>
          {children}
        </a>
      );
    }
    if (isValidElement(route)) {
      return route;
    }
    return children;
  };
  const itemOnClick = () => {
    if (!disabled) {
      onChange(name);
      setState((state) => ({ ...state, active: name }));
    }
  };
  return (
    <li
      className={classNames(className, `${classPrefix}-menu__item`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-is-active`]: name === active,
      })}
      style={{ height, lineHeight: height, ...style }}
      onClick={(e) => {
        itemOnClick();
        // 左侧常规模式点击不收起
        mode === 'accordion' ? e.stopPropagation() : undefined;
      }}
    >
      {icon}
      <span>{renderChildren()}</span>
    </li>
  );
};

MenuItem.blockType = MenuBlockType.MenuItem;
MenuItem.displayName = 'MenuItem';

export default MenuItem;
