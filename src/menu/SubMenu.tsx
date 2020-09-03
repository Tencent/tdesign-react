import React, {
  FunctionComponent,
  useContext,
  useState,
  useRef,
  Ref,
} from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { MenuContext } from './MenuContext';
import { MenuStaticProps, MenuBlockType } from './_util/type';
import { isSubMenuChildrenActive } from './_util/isSubMenuChildrenActive';
// import { insertCSS } from '../_util/insertCss';
import Icon from '../icon';
// import { v4 as uuidv4 } from 'uuid';
import useClickOutside from '../_util/useClickOutside';

export interface SubMenuProps extends StyledProps {
  /**
   * 子菜单的唯一标识
   */
  name: string | number;
  /**
   * 子菜单标题
   */
  title: string | React.ReactNode;
  /**
   * 是否禁用菜单项
   * @default false
   */
  disabled?: boolean;
  /**
   * 子菜单自定义样式
   */
  subMenuStyle?: React.CSSProperties;
}

const SubMenu: FunctionComponent<SubMenuProps> & MenuStaticProps = (props) => {
  const {
    name,
    title,
    disabled,
    subMenuStyle,
    children,
    className,
    style,
  } = props;
  const { classPrefix } = useConfig();
  const {
    mode,
    active,
    setState,
    multiple,
    expand,
    onExpand,
    height,
  } = useContext(MenuContext);
  const [subMenuVisible, setSubMenuVisible] = useState<boolean>(false);
  const subMenuRef = useRef<HTMLLIElement | HTMLDivElement>(null);
  useClickOutside(subMenuRef, () => {
    setSubMenuVisible(false);
  });
  // const menuItemRef = useRef<HTMLLIElement | HTMLDivElement>(null);
  // const insertCSSId = `${classPrefix}-submenu-${uuidv4()}`;
  // 动态插入::before，使得hover时menu不消失
  // useEffect(() => {
  //   if (
  //     ['dropdown', 'popup'].includes(mode) &&
  //     menuItemRef &&
  //     menuItemRef.current &&
  //     subMenuRef &&
  //     subMenuRef.current
  //   ) {
  //     const {
  //       top: menuItemTop,
  //       bottom: menuItemBottom,
  //       left: menuItemLeft,
  //       right: menuItemRight,
  //     } = menuItemRef.current.getBoundingClientRect();
  //     const {
  //       top: subMenuTop,
  //       left: subMenuLeft,
  //     } = subMenuRef.current.getBoundingClientRect();
  //     // 考虑兼容性，不用width/height
  //     const menuHeight = menuItemBottom - menuItemTop;
  //     const insertStyle =
  //       mode === 'dropdown'
  //         ? `#${insertCSSId}::before {
  //             position: absolute;
  //             top: ${menuItemTop - subMenuTop + menuHeight}px;
  //             left: ${Math.min(menuItemLeft - subMenuLeft, 0)}px;
  //             bottom: 0;
  //             z-index: -999;
  //             width: calc(100% + ${Math.abs(subMenuLeft - menuItemLeft)}px);
  //             opacity: 0.0001;
  //             content: ' ';
  //           }`
  //         : `#${insertCSSId}::before {
  //             position: absolute;
  //             top: ${Math.min(menuItemTop - subMenuTop, 0)}px;
  //             left: ${Math.min(menuItemRight - subMenuLeft, 0)}px;
  //             z-index: -999;
  //             height:calc(100% + ${Math.max(subMenuTop - menuItemTop, 0)}px);
  //             width: calc(100% + ${Math.max(subMenuLeft - menuItemRight, 0)}px);
  //             opacity: 0.0001;
  //             content: ' ';
  //           }`;
  //     insertCSS(insertCSSId, insertStyle);
  //   }
  // }, [insertCSSId, mode]);

  if (mode === 'dropdown' || mode === 'title') {
    return (
      <li
        ref={subMenuRef as Ref<HTMLLIElement>}
        className={classNames(
          className,
          `${classPrefix}-menu__item `,
          `${classPrefix}-submenu`,
          {
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-is-active`]: isSubMenuChildrenActive(
              children,
              active
            ),
          }
        )}
        style={{ height, lineHeight: height, ...style }}
        onClick={(e) => {
          setSubMenuVisible(true);
          e.stopPropagation();
        }}
      >
        {title}
        {subMenuVisible && (
          <>
            {mode === 'dropdown' && (
              <ul
                className={classNames(`${classPrefix}-menu__dropdown`)}
                style={{ top: `calc(${height} + 4px)`, ...subMenuStyle }}
                onClick={(e) => {
                  setSubMenuVisible(false);
                  e.stopPropagation();
                }}
              >
                {children}
              </ul>
            )}
            {mode === 'title' && (
              <div
                className={classNames(
                  `${classPrefix}-head-menu__inner`,
                  `${classPrefix}-head-submenu`
                )}
                style={{ top: height, ...subMenuStyle }}
                onClick={(e) => {
                  setSubMenuVisible(false);
                  e.stopPropagation();
                }}
              >
                <ul className={`${classPrefix}-menu`} id={`${name}-submenu`}>
                  {children}
                </ul>
              </div>
            )}
          </>
        )}
      </li>
    );
  }
  if (mode === 'accordion') {
    const isExpand = expand && expand.length ? expand.includes(name) : false;
    return (
      <>
        {
          <div
            className={classNames(`${classPrefix}-submenu`, {
              [`${classPrefix}-is-opened`]: isExpand,
              [`${classPrefix}-is-active`]: isSubMenuChildrenActive(
                children,
                active
              ),
            })}
            onClick={(e) => {
              setState((state) => {
                const preExpand = state.expand;
                let nextExpand = [];
                if (preExpand.includes(name)) {
                  nextExpand = [...preExpand.filter((item) => item !== name)];
                } else {
                  nextExpand = multiple ? [name] : [...preExpand, name];
                }
                console.log('nextExpand', nextExpand);
                return {
                  ...state,
                  expand: nextExpand,
                };
              });
              onExpand(name, expand);
              e.stopPropagation();
            }}
          >
            <li className={`${classPrefix}-menu__item`}>
              {title}
              <Icon.Font
                name="arrow-down"
                className={`${classPrefix}-submenu-icon`}
              />
            </li>
            <ul
              className={classNames({
                [`${classPrefix}-menu__dropdown`]: mode === 'accordion',
              })}
              style={{ ...subMenuStyle }}
            >
              {children}
            </ul>
          </div>
        }
      </>
    );
  }
  if (mode === 'popup') {
    return (
      <div
        ref={subMenuRef as Ref<HTMLDivElement>}
        className={classNames(`${classPrefix}-submenu`, {
          [`${classPrefix}-is-active`]: isSubMenuChildrenActive(
            children,
            active
          ),
        })}
        onClick={(e) => {
          setSubMenuVisible(true);
          e.stopPropagation();
        }}
      >
        <li className={`${classPrefix}-menu__item`}>
          {title}
          <Icon.Font
            name="arrow-down"
            className={`${classPrefix}-submenu-icon`}
          />
        </li>
        {subMenuVisible && (
          <ul
            className={`${classPrefix}-menu__popup`}
            style={{ ...subMenuStyle }}
            onClick={(e) => {
              setSubMenuVisible(false);
              e.stopPropagation();
            }}
          >
            {children}
          </ul>
        )}
      </div>
    );
  }
  return null;
};
SubMenu.displayName = 'SubMenu';
SubMenu.blockType = MenuBlockType.SubMenu;
export default SubMenu;
