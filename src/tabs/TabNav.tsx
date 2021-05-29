import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '../icon';
import { TdTabsProps, TdTabPanelProps, TabValue } from '../_type/components/tabs';
import noop from '../_util/noop';
import { useTabClass } from './useTabClass';
import TabNavItem from './TabNavItem';
import TabBar from './TabBar';

export interface TabNavProps extends TdTabsProps {
  itemList: TdTabPanelProps[];
  tabClick: (s: TabValue) => void;
  activeValue: TabValue;
  size?: 'medium' | 'large';
}

const TabNav: React.FC<TabNavProps> = (props) => {
  const {
    placement = 'top',
    itemList,
    tabClick = noop,
    theme,
    addable,
    onAdd,
    size = 'medium',
    disabled = false,
    onRemove = noop,
    onChange = noop,
    activeValue,
  } = props;

  const { tdTabsClassGenerator, tdClassGenerator, tdSizeClassGenerator } = useTabClass();

  // :todo 兼容老版本 TabBar 的实现
  const navContainerRef = useRef<HTMLDivElement>(null);
  const getIndex = (value = activeValue) => {
    let index = 0;
    itemList.forEach((v, i) => {
      if (v.value === value) {
        index = i;
      }
    });
    return index;
  };

  const [activeIndex, setActiveIndex] = useState(getIndex());

  // 判断滚动条是否需要展示
  const [scrollBtnVisible, setScrollBtnVisible] = useState(true);

  // 滚动条处理逻辑
  const scrollBarRef = useRef(null);
  const scrollClickHandler = (position: 'left' | 'right') => {
    const ref = scrollBarRef.current;
    if (ref) {
      ref.scrollTo({
        left: position === 'left' ? ref.scrollLeft - 200 : ref.scrollLeft + 200,
        behavior: 'smooth',
      });
    }
  };

  // 检查当前内容区块是否超出滚动区块，判断左右滑动按钮是否展示
  const checkScrollBtnVisible = (): boolean => {
    if (!scrollBarRef.current || !navContainerRef.current) {
      // :todo 滚动条和内容区的 ref 任意一个不合法时，不执行此函数，暂时 console.error 打印错误
      console.error('[tdesign-tabs]滚动条和内容区 dom 结构异常');
      return false;
    }

    return scrollBarRef.current.clientWidth < navContainerRef.current.clientWidth;
  };

  // 调用检查函数，并设置左右滑动按钮的展示状态
  const setScrollBtnVisibleHandler = () => {
    setScrollBtnVisible(checkScrollBtnVisible());
  };

  // TabBar 组件逻辑层抽象，卡片类型时无需展示，故将逻辑整合到此处
  // eslint-disable-next-line operator-linebreak
  const TabBarCom =
    theme === 'card' ? null : <TabBar tabPosition={placement} activeId={activeIndex} containerRef={navContainerRef} />;

  // 组件初始化后判断当前是否需要展示滑动按钮
  useEffect(() => {
    setScrollBtnVisibleHandler();
  });

  return (
    <div className={classNames(tdTabsClassGenerator('header'), tdClassGenerator(`is-${placement}`))}>
      <div className={classNames(tdTabsClassGenerator('nav'))}>
        {addable ? (
          <div
            className={classNames(tdTabsClassGenerator('add-btn'), tdSizeClassGenerator(size))}
            onClick={(e) => onAdd({ e })}
          >
            <AddIcon name={'add'} />
          </div>
        ) : null}
        <div
          className={classNames(
            tdTabsClassGenerator('nav-container'),
            tdClassGenerator(`is-${placement}`),
            addable ? tdClassGenerator('is-addable') : '',
          )}
        >
          {addable && scrollBtnVisible ? (
            <>
              <span
                onClick={() => {
                  scrollClickHandler('left');
                }}
                className={classNames(
                  tdTabsClassGenerator('scroll-btn'),
                  tdTabsClassGenerator('scroll-btn--left'),
                  tdSizeClassGenerator(size),
                )}
              >
                <ChevronLeftIcon />
              </span>
              <span
                onClick={() => {
                  scrollClickHandler('right');
                }}
                className={classNames(
                  tdTabsClassGenerator('scroll-btn'),
                  tdTabsClassGenerator('scroll-btn--right'),
                  tdSizeClassGenerator(size),
                )}
              >
                <ChevronRightIcon />
              </span>
            </>
          ) : null}
          <div
            className={classNames(
              tdTabsClassGenerator('nav-scroll'),
              scrollBtnVisible ? tdClassGenerator('is-scrollable') : '',
            )}
            ref={scrollBarRef}
          >
            <div className={classNames(tdTabsClassGenerator('nav-wrap'))} ref={navContainerRef}>
              {placement !== 'bottom' ? TabBarCom : null}
              <div className={classNames(tdTabsClassGenerator('bar'), tdClassGenerator(`is-${placement}`))} />
              {itemList.map((v, index) => (
                <TabNavItem
                  {...props}
                  {...v}
                  key={v.value}
                  label={v.label}
                  isActive={activeValue === v.value}
                  theme={theme}
                  placement={placement}
                  index={index}
                  disabled={disabled || v.disabled}
                  onClick={() => {
                    tabClick(v.value);
                    onChange(v.value);
                    setActiveIndex(getIndex(v.value));
                  }}
                  onRemove={onRemove}
                />
              ))}
              {placement === 'bottom' ? TabBarCom : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TabNav.displayName = 'TabNav';

export default TabNav;
