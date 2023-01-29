import React, { FC, useContext, useState, ReactElement, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { StyledProps } from '../common';
import { TdSubmenuProps } from './type';
import useConfig from '../hooks/useConfig';
import { MenuContext } from './MenuContext';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useRipple from '../_util/useRipple';
import { getSubMenuMaxHeight } from './_util/getSubMenuChildStyle';
import checkSubMenuChildrenActive from './_util/checkSubMenuChildrenActive';
import FakeArrow from '../common/FakeArrow';
import { checkIsSubMenu, checkIsMenuGroup } from './_util/checkMenuType';
import { cacularPaddingLeft } from './_util/cacularPaddingLeft';

export interface SubMenuProps extends TdSubmenuProps, StyledProps {}

export interface SubMenuWithCustomizeProps extends SubMenuProps {
  level?: number;
}

const SubAccordion: FC<SubMenuWithCustomizeProps> = (props) => {
  const { content, children = content, disabled, icon, title, value, className, style, level = 1 } = props;

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

  const childrens = React.Children.map(children, (child) =>
    React.cloneElement(child as ReactElement, {
      className: classNames(
        `${classPrefix}-menu__item--plain`,
        `${classPrefix}-submenu__item`,
        `${classPrefix}-submenu__item--icon`,
      ),
    }),
  );

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

  // 计算左边距，兼容多层级子菜单
  const menuPaddingLeft = cacularPaddingLeft(level - 1);

  const fakeArrowStyle = isPopUp && level > 1 ? { transform: 'rotate(-90deg)' } : {};

  return (
    <li
      className={classNames(`${classPrefix}-submenu`, className, {
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
        <FakeArrow style={fakeArrowStyle} isActive={level === 1 && isOpen} disabled={disabled} />
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
        <ul
          key="normal"
          style={{ ...childStyle, '--padding-left': `${menuPaddingLeft}px` } as React.CSSProperties}
          className={`${classPrefix}-menu__sub`}
        >
          {childrens}
        </ul>
      )}
    </li>
  );
};

const SubTitleMenu: FC<SubMenuWithCustomizeProps> = (props) => {
  const { className, style, children, title, value, level = 1 } = props;

  const { active, onChange, expandType } = useContext(MenuContext);
  const { classPrefix } = useConfig();
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLUListElement>();

  const handleClick = () => onChange(value);

  // 斜八角动画
  const [subMenuDom, setRefCurrent] = useDomRefCallback();

  useRipple(subMenuDom);

  // pupup 导航
  const isPopUp = expandType === 'popup';
  // 当前二级导航激活
  const isActive = checkSubMenuChildrenActive(children, active) || active === value;

  const handleMouseEvent = (type: 'leave' | 'enter') => {
    if (!isPopUp) return;
    if (type === 'enter') setOpen(true);
    else if (type === 'leave') setOpen(false);
  };

  const fakeArrowStyle = level > 1 ? { transform: 'rotate(-90deg)' } : {};

  const submenuMaxHeight = getSubMenuMaxHeight(children);
  const popupMaxHeight = popRef.current?.getBoundingClientRect().height || submenuMaxHeight;
  const showPopup = isPopUp && submenuMaxHeight > 0;

  return (
    <li
      className={classNames(`${classPrefix}-submenu`, className, {
        [`${classPrefix}-is-opened`]: open,
      })}
      onMouseEnter={() => handleMouseEvent('enter')}
      onMouseLeave={() => handleMouseEvent('leave')}
    >
      <div
        ref={setRefCurrent}
        className={classNames(`${classPrefix}-menu__item`, {
          [`${classPrefix}-is-active`]: isActive,
          [`${classPrefix}-is-opened`]: open,
        })}
        onClick={handleClick}
        style={style}
      >
        <span>{title}</span>
        {showPopup && <FakeArrow style={fakeArrowStyle} isActive={level === 1 && open} />}
      </div>
      {showPopup && (
        <div
          className={classNames(`${classPrefix}-menu__popup`, {
            [`${classPrefix}-is-opened`]: open,
          })}
          style={{ '--popup-max-height': `${popupMaxHeight}px` } as React.CSSProperties}
        >
          <ul ref={popRef} className={classNames(`${classPrefix}-menu__popup-wrapper`)}>
            {children}
          </ul>
        </div>
      )}
    </li>
  );
};

const SubMenu: FC<SubMenuWithCustomizeProps> = (props) => {
  const { mode } = useContext(MenuContext);
  const { children, level = 1 } = props;

  const changeItemLevel = (item: React.ReactElement) => {
    if (checkIsSubMenu(item)) {
      return React.cloneElement(item, {
        level: level + 1,
      });
    }
    if (checkIsMenuGroup(item)) {
      const groupChildren = React.Children.map(item.props.children, (item: React.ReactElement) =>
        changeItemLevel(item),
      );
      return React.cloneElement(
        item,
        {
          level: level + 1,
        },
        groupChildren,
      );
    }
    return item;
  };

  // 如果是第二层及以及的 subMenu 需要添加 notFirstLevelSubMenu 属性
  const childElement = React.Children.map(children, (item: React.ReactElement) => changeItemLevel(item));

  if (mode === 'accordion') return <SubAccordion {...props}>{childElement}</SubAccordion>;
  if (mode === 'title') return <SubTitleMenu {...props}>{childElement}</SubTitleMenu>;
  return null;
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
