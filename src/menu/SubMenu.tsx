import React, { FC, useContext, useState, ReactElement, useMemo } from 'react';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import { TdSubmenuProps } from '../_type/components/menu';
import useConfig from '../_util/useConfig';
import { MenuContext } from '../menu/MenuContext';
import { getSubMenuMaxHeight } from './_util/getSubMenuChildStyle';
import checkSubMenuChildrenActive from './_util/checkSubMenuChildrenActive';

const ArrawSvg = ({ className }: { className: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.75 5.7998L7.99274 10.0425L12.2361 5.79921" stroke="black" strokeOpacity="0.9" strokeWidth="1.3" />
  </svg>
);

export interface SubMenuProps extends TdSubmenuProps, StyledProps {}

const SubAccordion: FC<SubMenuProps> = (props) => {
  const { content, children = content, disabled, icon, title, value, className, style } = props;
  const { classPrefix } = useConfig();
  // popup 状态下控制开关
  const [open, setOpen] = useState(false);
  const { expanded = [], onExpand, active, expandType } = useContext(MenuContext);

  const isPopUp = expandType === 'popup';
  // 非 popup 展开
  const isExpand = expanded.includes(value) && !disabled && !isPopUp;

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand(value, expanded);
  };

  const handleMouseEvent = (type: 'leave' | 'enter') => {
    if (!isPopUp) return;
    if (type === 'enter') setOpen(true);
    else if (type === 'leave') setOpen(false);
  };

  const childrens = React.Children.map(children, (child) => React.cloneElement(child as ReactElement, {
    className: classNames(
      `${classPrefix}-menu__item--plain`,
      `${classPrefix}-submenu__item`,
      `${classPrefix}-submenu__item--icon`,
    ),
  }));

  // 计算有多少子节点并设置最大高度，为做出动画效果
  const childStyle = {
    maxHeight: isExpand || (open && isPopUp) ? getSubMenuMaxHeight(children) : 0,
  };

  // 是否展开（popup 与 expand 两种状态）
  const isOpen = useMemo(() => {
    if (disabled) return false;
    if (isPopUp) return open;
    return isExpand;
  }, [disabled, isPopUp, open, isExpand]);

  return (
    <li
      className={classNames(className, `${classPrefix}-submenu`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-is-opened`]: isOpen,
      })}
      onClick={handleClick}
      style={style}
      onMouseEnter={() => handleMouseEvent('enter')}
      onMouseLeave={() => handleMouseEvent('leave')}
    >
      <div
        className={classNames(`${classPrefix}-menu__item`, {
          [`${classPrefix}-is-opened`]: isOpen,
          [`${classPrefix}-is-active`]: checkSubMenuChildrenActive(children, active),
        })}
      >
        {icon} <span className={`${classPrefix}-menu__content`}>{title}</span>
        <ArrawSvg
          className={classNames(`${classPrefix}-fake-arrow`, {
            [`${classPrefix}-fake-arrow--active`]: isOpen,
          })}
        />
      </div>
      {isPopUp ? (
        <div
          className={classNames(`${classPrefix}-menu__popup`, `${classPrefix}-is-vertical`, {
            [`${classPrefix}-is-opened`]: isOpen,
          })}
        >
          <ul
            className={classNames(`${classPrefix}-menu__popup-wrapper`, {
              [`${classPrefix}-is-opened`]: isOpen,
            })}
            key="popup"
            style={childStyle}
          >
            {childrens}
          </ul>
        </div>
      ) : (
        <ul key="normal" style={childStyle} className={`${classPrefix}-menu__sub`}>
          {childrens}
        </ul>
      )}
    </li>
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
    <li
      className={classNames(`${classPrefix}-submenu`, {
        [`${classPrefix}-is-opened`]: open,
      })}
      onMouseEnter={() => handleMouseEvent('enter')}
      onMouseLeave={() => handleMouseEvent('leave')}
    >
      <div
        className={classNames(className, `${classPrefix}-menu__item`, {
          [`${classPrefix}-is-active`]: isActive,
          [`${classPrefix}-is-opened`]: open,
        })}
        onClick={handleClick}
        style={style}
      >
        <span>{title}</span>
        {isPopUp && (
          <ArrawSvg
            className={classNames(`${classPrefix}-fake-arrow`, {
              [`${classPrefix}-fake-arrow--active`]: open,
            })}
          />
        )}
      </div>
      {isPopUp && (
        <div
          className={classNames(`${classPrefix}-menu__popup`, {
            [`${classPrefix}-is-opened`]: open,
          })}
          style={{ '--popup-max-height': getSubMenuMaxHeight(children) } as any}
        >
          <ul className={classNames(`${classPrefix}-menu__popup-wrapper`)}>{children}</ul>
        </div>
      )}
    </li>
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
