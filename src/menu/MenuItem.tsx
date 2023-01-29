import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useRipple from '../_util/useRipple';
import { TdMenuItemProps } from './type';
import { StyledProps } from '../common';
import { MenuContext } from './MenuContext';

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

  const { onChange, setState, active } = useContext(MenuContext);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    if (disabled) return;

    onClick && onClick({ e });
    onChange(value);
    setState({ active: value });
  };

  return (
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
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
