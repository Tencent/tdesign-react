import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useRipple from '../_util/useRipple';
import { TdMenuItemProps } from './type';
import { StyledProps } from '../common';
import { MenuContext } from './MenuContext';
import TooltipLite from '../tooltip';

export interface MenuItemProps extends TdMenuItemProps, StyledProps {}

const MenuItem: FC<MenuItemProps> = (props) => {
  const {
    content,
    children = content,
    disabled,
    href,
    target = '_self',
    value,
    className,
    style,
    icon,
    onClick,
  } = props;
  const { classPrefix } = useConfig();

  // 斜八角动画
  const [menuItemDom, setRefCurrent] = useDomRefCallback();
  useRipple(menuItemDom);

  const { onChange, setState, active, collapsed } = useContext(MenuContext);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    if (disabled) return;

    onClick && onClick({ e });
    onChange(value);
    setState({ active: value });
  };

  const liContent = (
    <li
      ref={setRefCurrent}
      className={classNames(`${classPrefix}-menu__item`, className, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-is-active`]: value === active,
        [`${classPrefix}-menu__item--plain`]: !icon,
      })}
      style={{ ...style }}
      onClick={handleClick}
    >
      <>
        {icon}
        {href ? (
          <a href={href} target={target} className={classNames(`${classPrefix}-menu__item-link`)}>
            <span className={`${classPrefix}-menu__content`}>{children}</span>
          </a>
        ) : (
          <span className={`${classPrefix}-menu__content`}>{children}</span>
        )}
      </>
    </li>
  );

  // 菜单收起，且只有本身为一级菜单才需要显示 tooltip
  if (collapsed && !disabled && !/submenu/i.test(className)) {
    return (
      <TooltipLite content={children} placement="right">
        {liContent}
      </TooltipLite>
    );
  }

  return liContent;
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
