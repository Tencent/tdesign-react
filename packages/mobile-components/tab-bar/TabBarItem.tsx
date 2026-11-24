import cls from 'classnames';
import React, { forwardRef, memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ViewListIcon } from 'tdesign-icons-react';
import type { StyledProps } from '../common';
import type { TdTabBarItemProps } from './type';
import { TabBarContext } from './TabBarContext';
import Badge from '../badge';
import useTabBarCssTransition from './hooks/useTabBarCssTransition';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';

export interface TabBarItemProps extends TdTabBarItemProps, StyledProps {}

const defaultBadgeOffset = [0, 0];
const defaultBadgeMaxCount = 99;

const TabBarItem = forwardRef<HTMLDivElement, TabBarItemProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, {});
  const { subTabBar, icon, badgeProps, value, children, className, style } = props;

  const hasSubTabBar = useMemo(() => !!subTabBar, [subTabBar]);
  const { defaultIndex, activeValue, updateChild, shape, split, theme, itemCount } = useContext(TabBarContext);

  const tabBarItemClass = usePrefixClass('tab-bar-item');

  const textNode = useRef<HTMLDivElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const [iconOnly, setIconOnly] = useState(false);

  // 组件每次 render 生成一个临时的当前组件唯一值
  const [currentName] = useState<undefined | number | string>(() => {
    if (value) {
      return value;
    }
    return (defaultIndex.current += 1);
  });

  useEffect(() => {
    const height = textNode?.current?.clientHeight;
    setIconOnly(Number(height) === 0);
  }, [textNode]);

  const [isSpread, setIsSpread] = useState(false);

  const isChecked = useMemo(() => {
    if (hasSubTabBar && Array.isArray(activeValue)) {
      return activeValue.includes(currentName);
    }
    return currentName === activeValue;
  }, [currentName, activeValue, hasSubTabBar]);

  const mergedBadgeProps = useMemo(
    () => ({
      count: 0,
      dot: false,
      offset: defaultBadgeOffset,
      maxCount: defaultBadgeMaxCount,
      ...badgeProps,
    }),
    [badgeProps],
  );

  useEffect(() => {
    if (!isChecked) {
      setIsSpread(() => false);
    }
  }, [isChecked]);

  const isToggleCurrent = useMemo(
    () => Array.isArray(activeValue) && activeValue[0] === currentName,
    [activeValue, currentName],
  );

  const shouldShowSubTabBar = useMemo(() => subTabBar && Array.isArray(subTabBar) && subTabBar.length > 0, [subTabBar]);
  const showSubTabBar = useMemo(() => shouldShowSubTabBar && isSpread, [shouldShowSubTabBar, isSpread]);

  const toggle = () => {
    if (hasSubTabBar) {
      setIsSpread(true);

      if (!isToggleCurrent) {
        updateChild([currentName]);
      }
      return;
    }

    updateChild(currentName);
  };

  const selectChild = (childName: number | string) => {
    if (!(Array.isArray(activeValue) && activeValue[1] === childName)) {
      updateChild([currentName, childName]);
    }
    setIsSpread(() => false);
  };

  /** 拥挤否 */
  const crowded = itemCount > 3;

  const tabItemCls = cls(
    tabBarItemClass,
    className,
    {
      [`${tabBarItemClass}--split`]: split,
      [`${tabBarItemClass}--crowded`]: crowded,
    },
    `${tabBarItemClass}--${shape}`,
  );
  const tabItemInnerCls = cls(
    `${tabBarItemClass}__content`,
    {
      [`${tabBarItemClass}__content--checked`]: isChecked,
    },
    `${tabBarItemClass}__content--${theme}`,
  );
  const tabItemTextCls = cls(`${tabBarItemClass}__text`, {
    [`${tabBarItemClass}__text--small`]: icon,
  });

  const transitionClsNames = useTabBarCssTransition({
    name: 'spread',
  });

  const iconSize = `${iconOnly ? 24 : 20}px`;

  const iconContent = () =>
    // @ts-ignore
    icon && React.cloneElement(icon, { style: { fontSize: iconSize } });

  return (
    <div className={tabItemCls} ref={ref} style={style}>
      <div
        role="tab"
        aria-label="TabBar"
        aria-selected={isChecked}
        aria-haspopup={shouldShowSubTabBar}
        className={tabItemInnerCls}
        onClick={toggle}
      >
        {icon && (
          <div className={`${tabBarItemClass}__icon`} style={{ height: iconSize }}>
            {badgeProps && (badgeProps?.dot || badgeProps?.count) ? (
              <Badge content={iconContent()} {...mergedBadgeProps} />
            ) : (
              iconContent()
            )}
          </div>
        )}
        {children && (
          <div ref={textNode} className={tabItemTextCls}>
            {shouldShowSubTabBar && (
              <>
                <ViewListIcon size="16" />
                <div className={`${tabBarItemClass}__icon-menu`} />
              </>
            )}
            {parseTNode(children)}
          </div>
        )}
      </div>

      <CSSTransition
        nodeRef={menuRef}
        timeout={200}
        in={showSubTabBar}
        classNames={transitionClsNames}
        mountOnEnter
        unmountOnExit
      >
        <ul role="menu" className={`${tabBarItemClass}__spread`}>
          {subTabBar?.map((child, index) => (
            <div
              key={child.value || index}
              role="menuitem"
              aria-label={child.label}
              className={`${tabBarItemClass}__spread-item`}
              onClick={(e) => {
                e.stopPropagation();
                selectChild(child.value || index);
              }}
            >
              {index !== 0 && <div className={`${tabBarItemClass}__spread-item-split`} />}
              <div className={`${tabBarItemClass}__spread-item-text`}>{child.label}</div>
            </div>
          ))}
        </ul>
      </CSSTransition>
    </div>
  );
});

export default memo(TabBarItem);
