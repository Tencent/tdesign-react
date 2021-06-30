import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdMenuItemProps } from '../_type/components/menu';
import { StyledProps } from '../_type';
import { MenuContext } from './MenuContext';

export interface MenuItemProps extends TdMenuItemProps, StyledProps {}

const MenuItem: FC<MenuItemProps> = (props) => {
  const { content, children = content, disabled, href, target = '_self', value, className, style } = props;
  const { classPrefix } = useConfig();
  const { onChange, setState, active } = useContext(MenuContext);

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
    if (disabled || active === value) return;

    onChange(value);
    setState({ active: value });
  };

  return (
    <li
      className={classNames(className, `${classPrefix}-menu__item`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-is-active`]: value === active,
      })}
      style={{ ...style }}
      onClick={handleClick}
    >
      {href ? (
        <a href={href} target={target} className={classNames(`${classPrefix}-menu__item-link`)}>
          {children}
        </a>
      ) : (
        children
      )}
    </li>
  );
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
