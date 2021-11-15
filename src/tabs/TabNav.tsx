import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-react';
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

  // 逻辑层较多处需要判断是否为 card 类型，进行逻辑抽象
  const isCard = theme === 'card';

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
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [leftScrollBtnVisible, setLeftScrollBtnVisible] = useState(false);
  const [rightScrollBtnVisible, setRightScrollBtnVisible] = useState(false);

  // 滚动条 ref 定义
  const scrollBarRef = useRef(null);

  /**
   * @date 2021-07-26 15:57:46
   * @desc 检查当前内容区块是否超出滚动区块，判断左右滑动按钮是否展示
   * @param scrollLeft undefined|number undefined 时根据当前的滑块位置决定，number 时，以传入的参数作为当前滑块位置判断
   *        需要此参数的目的: 滚动之后需要重新判断是否需要展示左右的滑块，而滚动过程中根据滑块位置判断会有误差，scrollTo 也不支持完成回调。
   * @returns result [是否需要展示滚动, 是否需要展示左边调整滚动的按钮，是否需要展示右边调整滚动的按钮]
   */
  const getScrollBtnVisible = (scrollLeft: undefined | number = undefined): [boolean, boolean, boolean] => {
    if (!scrollBarRef.current || !navContainerRef.current) {
      // :todo 滚动条和内容区的 ref 任意一个不合法时，不执行此函数，暂时 console.error 打印错误
      console.error('[tdesign-tabs]滚动条和内容区 dom 结构异常');
      return [false, false, false];
    }

    let innerScrollLeft = scrollBarRef.current.scrollLeft;
    if (scrollLeft !== undefined) {
      innerScrollLeft = scrollLeft;
    }

    const isScrollVisible = scrollBarRef.current.clientWidth < navContainerRef.current.clientWidth;
    const leftVisible = innerScrollLeft > 0;
    const rightVisible =
      isScrollVisible && innerScrollLeft < navContainerRef.current.clientWidth - scrollBarRef.current.clientWidth;

    return [isScrollVisible, leftVisible, rightVisible];
  };

  // 调用检查函数，并设置左右滑动按钮的展示状态
  const setScrollBtnVisibleHandler = (scrollLeft: undefined | number = undefined) => {
    const [isScrollVisible, leftVisible, rightVisible] = getScrollBtnVisible(scrollLeft);
    setIsScrollVisible(isScrollVisible);
    setLeftScrollBtnVisible(leftVisible);
    setRightScrollBtnVisible(rightVisible);
  };

  // 滚动条处理逻辑
  const scrollClickHandler = (position: 'left' | 'right') => {
    const ref = scrollBarRef.current;
    if (ref) {
      const scrollLeft = position === 'left' ? ref.scrollLeft - 200 : ref.scrollLeft + 200;
      ref.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
      setScrollBtnVisibleHandler(scrollLeft);
    }
  };

  // 滚动到最右侧 (目前专用在新增之后)
  const scrollToRightEnd = () => {
    if (navContainerRef.current && scrollBarRef.current) {
      const scrollLeft = navContainerRef.current.clientWidth - scrollBarRef.current.clientWidth;
      scrollBarRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
      setScrollBtnVisibleHandler(scrollLeft);
    }
  };

  // TabBar 组件逻辑层抽象，卡片类型时无需展示，故将逻辑整合到此处
  const TabBarCom = isCard ? null : (
    <TabBar tabPosition={placement} activeId={activeIndex} containerRef={navContainerRef} />
  );

  // 组件初始化后判断当前是否需要展示滑动按钮
  useEffect(() => {
    setScrollBtnVisibleHandler();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classNames(tdTabsClassGenerator('header'), tdClassGenerator(`is-${placement}`))}>
      <div className={classNames(tdTabsClassGenerator('nav'))}>
        <div className={classNames(tdTabsClassGenerator('operations'), tdTabsClassGenerator('operations--left'))}>
          {leftScrollBtnVisible ? (
            <div
              onClick={() => {
                scrollClickHandler('left');
              }}
              className={classNames(
                tdTabsClassGenerator('btn'),
                tdTabsClassGenerator('btn--left'),
                tdSizeClassGenerator(size),
              )}
            >
              <ChevronLeftIcon />
            </div>
          ) : null}
        </div>
        <div className={classNames(tdTabsClassGenerator('operations'), tdTabsClassGenerator('operations--right'))}>
          {rightScrollBtnVisible ? (
            <div
              onClick={() => {
                scrollClickHandler('right');
              }}
              className={classNames(
                tdTabsClassGenerator('btn'),
                tdTabsClassGenerator('btn--right'),
                tdSizeClassGenerator(size),
              )}
            >
              <ChevronRightIcon />
            </div>
          ) : null}
          {addable ? (
            <div
              className={classNames(
                tdTabsClassGenerator('add-btn'),
                tdTabsClassGenerator('btn'),
                tdSizeClassGenerator(size),
              )}
              onClick={(e) => {
                onAdd({ e });
                // 新增逻辑执行完成，数据渲染完成之后，判断是否需要展示右侧的数据
                setTimeout(() => {
                  scrollToRightEnd();
                }, 0);
              }}
            >
              <AddIcon />
            </div>
          ) : null}
        </div>
        <div
          className={classNames(
            tdTabsClassGenerator('nav-container'),
            isCard ? tdTabsClassGenerator('nav--card') : '',
            tdClassGenerator(`is-${placement}`),
            addable ? tdClassGenerator('is-addable') : '',
          )}
        >
          <div
            className={classNames(
              tdTabsClassGenerator('nav-scroll'),
              isScrollVisible ? tdClassGenerator('is-scrollable') : '',
            )}
            ref={scrollBarRef}
          >
            <div
              className={classNames(
                tdTabsClassGenerator('nav-wrap'),
                ['left', 'right'].includes(placement) ? tdClassGenerator('is-vertical') : '',
              )}
              ref={navContainerRef}
            >
              {placement !== 'bottom' ? TabBarCom : null}
              <div className={classNames(tdTabsClassGenerator('bar'), tdClassGenerator(`is-${placement}`))} />
              {itemList.map((v, index) => (
                <TabNavItem
                  {...props}
                  {...v}
                  // 显式给 onRemove 赋值，防止 props 的 onRemove 事件透传
                  onRemove={v.onRemove}
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
                  onTabRemove={onRemove}
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
