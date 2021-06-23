import React, { FC, useContext, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@tencent/tdesign-react';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import { TdSubmenuProps } from '../_type/components/menu';
import useConfig from '../_util/useConfig';
import { MenuContext } from '../menu/MenuContext';
import checkSubMenuChildrenActive from './_util/checkSubMenuChildrenActive';
import { getSubMenuMaxHight } from './_util/getSubMenuMaxHight';

export interface SubMenuProps extends TdSubmenuProps, StyledProps {}

const SubAccordion: FC<SubMenuProps> = (props) => {
  const { content, children = content, disabled, icon, title, value, className, style } = props;
  const { classPrefix } = useConfig();
  const [open, setOpen] = useState(false);
  const { expanded = [], onExpand, active, expandType } = useContext(MenuContext);

  const isPopUp = expandType === 'popup';
  const isExpand = expanded.includes(value) && !disabled && !isPopUp;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand(value, expanded);
  };

  const handleMouseEvent = (type: 'leave' | 'enter') => {
    if (!isPopUp) return;
    if (type === 'enter') setOpen(true);
    else if (type === 'leave') setOpen(false);
  };

  const Icon = isPopUp ? ChevronRightIcon : ChevronDownIcon;

  return (
    <div
      className={classNames(className, `${classPrefix}-submenu`, {
        [`${classPrefix}-is-opened`]: isExpand && !disabled,
        [`${classPrefix}-is-active`]: checkSubMenuChildrenActive(children, active),
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      onClick={handleClick}
      style={style}
      onMouseEnter={() => handleMouseEvent('enter')}
      onMouseLeave={() => handleMouseEvent('leave')}
    >
      <li className={`${classPrefix}-menu__item`}>
        {icon} <span>{title}</span>
        <Icon className={`${classPrefix}-submenu-icon`} />
      </li>
      <ul
        className={classNames({
          [`${classPrefix}-menu__dropdown`]: !isPopUp,
          [`${classPrefix}-menu__dropdown--show`]: isExpand && !isPopUp,
          [`${classPrefix}-menu__popup`]: isPopUp,
          [`${classPrefix}-menu__popup-scale`]: isPopUp,
          [`${classPrefix}-is-opened`]: isPopUp && open,
        })}
        // 计算有多少子节点并设置最大高度，为做出动画效果
        style={{ maxHeight: open && (isExpand || isPopUp) ? getSubMenuMaxHight(children) * 50 : 0 }}
      >
        {children}
      </ul>
    </div>
  );
};

const SubTitleMenu: FC<SubMenuProps> = (props) => {
  const { className, style, children, title, value } = props;
  const { active, onChange, expandType } = useContext(MenuContext);
  const { classPrefix } = useConfig();
  const [open, setOpen] = useState(false);

  const handleClick = () => onChange(value);

  // pupup 导航
  const isPopUp = expandType === 'popup';
  // 当前二级导航激活
  const isActive = checkSubMenuChildrenActive(children, active) || active === value;

  const handleMouseEvent = (type: 'leave' | 'enter') => {
    if (!isPopUp) return;
    if (type === 'enter') setOpen(true);
    else if (type === 'leave') setOpen(false);
  };

  return (
    <>
      <li
        className={classNames(className, `${classPrefix}-menu__item`, {
          [`${classPrefix}-is-active`]: isActive,
        })}
        onClick={handleClick}
        style={style}
        onMouseEnter={() => handleMouseEvent('enter')}
        onMouseLeave={() => handleMouseEvent('leave')}
      >
        <span>{title}</span>
        {isPopUp && <ChevronDownIcon className={`${classPrefix}-submenu-icon`} />}
        {isPopUp && (
          <ul
            className={classNames(
              `${classPrefix}-menu__popup`,
              `${classPrefix}-menu__popup-scale`,
              `${classPrefix}-menu__popup-inner`,
              {
                [`${classPrefix}-is-opened`]: open,
              },
            )}
          >
            {children}
          </ul>
        )}
      </li>
      {isActive && !isPopUp && <ul className={`${classPrefix}-head-menu__submenu-box`}>{children}</ul>}
    </>
  );
};

const SubMenu: FC<SubMenuProps> = (props) => {
  const { mode } = useContext(MenuContext);

  if (mode === 'accordion') return <SubAccordion {...props} />;
  if (mode === 'title') return <SubTitleMenu {...props} />;
  return null;
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
