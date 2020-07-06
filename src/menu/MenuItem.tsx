import React, { FunctionComponent, isValidElement } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import noop from '../_util/noop';

/**
 *
 */
export interface MenuItemProps extends StyledProps {
  /**
   * 菜单项的唯一标识
   */
  name: string;
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
export interface PrivateMenuItemProps {
  /**
   * 内部props，透传Menu的onChange
   */
  onClick?: (menuName: string) => void;
}
const MenuItem: FunctionComponent<MenuItemProps & PrivateMenuItemProps> = (
  props
) => {
  const { classPrefix } = useConfig();
  const {
    name,
    route,
    target,
    disabled,
    children,
    className,
    style,
    onClick = noop,
  } = props;
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
  return (
    <li
      className={classNames(className, `${classPrefix}-menu__item`, {
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      style={style}
      onClick={!disabled ? () => onClick(name) : undefined}
    >
      {renderChildren()}
    </li>
  );
};
export default MenuItem;
