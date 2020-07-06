import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { MenuItemProps, PrivateMenuItemProps } from './MenuItem';
import noop from '../_util/noop';

/**
 *
 */
interface HeadMenuProps extends StyledProps {
  /**
   * 主题，可选值为 light、dark，支持扩展颜色
   * @default light
   */
  theme?: 'light' | 'dark';
  /**
   * 激活菜单的 name 值
   */
  active?: string | number;
  /**
   * 选择菜单（MenuItem）时触发
   */
  onChange?: (menuName: string) => void;
}
const HeadMenu: FunctionComponent<HeadMenuProps> = (props) => {
  const { classPrefix } = useConfig();
  const {
    theme = 'light',
    active,
    onChange = noop,
    children,
    className,
    style,
  } = props;
  return (
    <div
      className={classNames(
        className,
        `${classPrefix}-head-menu`,
        {
          [`${classPrefix}-menu-dark`]: theme === 'dark',
        },
        {
          [`${classPrefix}-menu-light`]: theme === 'light',
        }
      )}
      style={style}
    >
      <div className={`${classPrefix}-head-menu__inner`}>
        <ul className={`${classPrefix}-menu`}>
          {React.Children.map(
            children,
            (
              child: React.ReactElement<MenuItemProps & PrivateMenuItemProps>
            ) => {
              const { name, disabled } = child.props;
              return React.cloneElement(child, {
                className:
                  name === active ? `${classPrefix}-is-active` : undefined,
                onClick: () => {
                  !disabled ? onChange(name) : undefined;
                },
              });
            }
          )}
        </ul>
      </div>
      <div
        className={`${classPrefix}-head-menu__inner ${classPrefix}-submenu`}
      ></div>
    </div>
  );
};
export default HeadMenu;
