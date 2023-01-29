import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  AddIcon as TdAddIcon,
  ChevronLeftIcon as TdChevronLeftIcon,
  ChevronRightIcon as TdChevronRightIcon,
} from 'tdesign-icons-react';
import debounce from 'lodash/debounce';
import { TdTabsProps, TdTabPanelProps, TabValue } from './type';
import noop from '../_util/noop';
import { useTabClass } from './useTabClass';
import TabNavItem from './TabNavItem';
import TabBar from './TabBar';
import tabBase from '../_common/js/tabs/base';
import useGlobalIcon from '../hooks/useGlobalIcon';

const { moveActiveTabIntoView, calcScrollLeft, scrollToLeft, scrollToRight, calculateCanToLeft, calculateCanToRight } =
  tabBase;
export interface TabNavProps extends TdTabsProps {
  itemList: TdTabPanelProps[];
  tabClick: (s: TabValue) => void;
  activeValue: TabValue;
  size?: 'medium' | 'large';
  children?: React.ReactNode;
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
    children,
  } = props;

  const { AddIcon, ChevronLeftIcon, ChevronRightIcon } = useGlobalIcon({
    AddIcon: TdAddIcon,
    ChevronLeftIcon: TdChevronLeftIcon,
    ChevronRightIcon: TdChevronRightIcon,
  });

  // 逻辑层较多处需要判断是否为 card 类型，进行逻辑抽象
  const isCard = theme === 'card';

  const { tdTabsClassGenerator, tdClassGenerator, tdSizeClassGenerator } = useTabClass();

  const navsContainerRef = useRef<HTMLDivElement>(null);
  // :todo 兼容老版本 TabBar 的实现
  const navsWrapRef = useRef<HTMLDivElement>(null);
  const getIndex = useCallback(
    (value) => {
      const index = itemList.findIndex((item) => item.value === value);
      return index > -1 ? index : -1;
    },
    [itemList],
  );

  const activeIndex = getIndex(activeValue);

  // 判断滚动条是否需要展示
  const [canToLeft, setToLeftBtnVisible] = useState(false);
  const [canToRight, setToRightBtnVisible] = useState(false);

  // 滚动条 ref 定义
  const scrollBarRef = useRef(null);
  const leftOperationsRef = useRef(null);
  const rightOperationsRef = useRef(null);
  const toLeftBtnRef = useRef(null);
  const toRightBtnRef = useRef(null);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeTab, setActiveTab] = useState<HTMLElement>(null);

  useEffect(() => {
    const left = moveActiveTabIntoView(
      {
        activeTab,
        navsContainer: navsContainerRef.current,
        navsWrap: navsWrapRef.current,
        toLeftBtn: toLeftBtnRef.current,
        toRightBtn: toRightBtnRef.current,
        leftOperations: leftOperationsRef.current,
        rightOperations: rightOperationsRef.current,
      },
      scrollLeft,
    );
    setScrollLeft(left);
  }, [activeTab, scrollLeft]);

  // 调用检查函数，并设置左右滑动按钮的展示状态
  const setScrollBtnVisibleHandler = useCallback(() => {
    const canToleft = calculateCanToLeft(
      {
        navsContainer: navsContainerRef.current,
        navsWrap: navsWrapRef.current,
        leftOperations: leftOperationsRef.current,
        toLeftBtn: toLeftBtnRef.current,
      },
      scrollLeft,
      placement,
    );
    const canToRight = calculateCanToRight(
      {
        navsContainer: navsContainerRef.current,
        navsWrap: navsWrapRef.current,
        rightOperations: rightOperationsRef.current,
        toRightBtn: toRightBtnRef.current,
      },
      scrollLeft,
      placement,
    );

    setToLeftBtnVisible(canToleft);
    setToRightBtnVisible(canToRight);
    // children 发生变化也要触发一次切换箭头判断
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLeft, placement, children]);

  // 滚动条处理逻辑
  const handleScroll = (position: 'left' | 'right') => {
    const val =
      position === 'left'
        ? scrollToLeft(
            {
              navsContainer: navsContainerRef.current,
              leftOperations: leftOperationsRef.current,
              toLeftBtn: toLeftBtnRef.current,
            },
            scrollLeft,
          )
        : scrollToRight(
            {
              navsWrap: navsWrapRef.current,
              navsContainer: navsContainerRef.current,
              rightOperations: rightOperationsRef.current,
              toRightBtn: toRightBtnRef.current,
            },
            scrollLeft,
          );

    setScrollLeft(val);
  };

  // handle window resize
  useEffect(() => {
    const onResize = debounce(() => {
      if (['top', 'bottom'].includes(placement.toLowerCase())) {
        const left = calcScrollLeft(
          {
            navsContainer: navsContainerRef.current,
            navsWrap: navsWrapRef.current,
            rightOperations: rightOperationsRef.current,
          },
          scrollLeft,
        );
        setScrollLeft(left);
        setScrollBtnVisibleHandler();
      }
    }, 300);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      onResize.cancel();
    };
  });

  useEffect(() => {
    if (['top', 'bottom'].includes(placement.toLowerCase())) {
      const left = calcScrollLeft(
        {
          navsContainer: navsContainerRef.current,
          navsWrap: navsWrapRef.current,
          rightOperations: rightOperationsRef.current,
        },
        scrollLeft,
      );
      setScrollLeft(left);
    }
  }, [itemList.length, scrollLeft, placement]);

  // TabBar 组件逻辑层抽象，卡片类型时无需展示，故将逻辑整合到此处
  const TabBarCom = isCard ? null : (
    <TabBar tabPosition={placement} activeId={activeIndex} containerRef={navsWrapRef} />
  );

  // 组件初始化后判断当前是否需要展示滑动按钮
  useEffect(() => {
    setScrollBtnVisibleHandler();
  }, [setScrollBtnVisibleHandler]);

  const handleTabItemRemove = (removeItem) => {
    const { value: removeValue, index: removeIndex } = removeItem;
    if (removeValue === activeValue) {
      onChange(removeIndex === 0 ? itemList[removeIndex + 1]?.value : itemList[removeIndex - 1].value);
    }
    onRemove(removeItem);
  };

  const handleTabItemClick = (clickItem) => {
    tabClick(clickItem.value);
    onChange(clickItem.value);
  };

  const handleTabAdd = (e) => {
    onAdd({ e });
  };

  return (
    <div ref={navsContainerRef} className={classNames(tdTabsClassGenerator('nav'))} style={{ minHeight: 48 }}>
      <div
        ref={leftOperationsRef}
        className={classNames(tdTabsClassGenerator('operations'), tdTabsClassGenerator('operations--left'))}
      >
        {canToLeft ? (
          <div
            onClick={() => {
              handleScroll('left');
            }}
            className={classNames(
              tdTabsClassGenerator('btn'),
              tdTabsClassGenerator('btn--left'),
              tdSizeClassGenerator(size),
            )}
            ref={toLeftBtnRef}
          >
            <ChevronLeftIcon />
          </div>
        ) : null}
      </div>
      <div
        ref={rightOperationsRef}
        className={classNames(tdTabsClassGenerator('operations'), tdTabsClassGenerator('operations--right'))}
      >
        {canToRight ? (
          <div
            onClick={() => {
              handleScroll('right');
            }}
            className={classNames(
              tdTabsClassGenerator('btn'),
              tdTabsClassGenerator('btn--right'),
              tdSizeClassGenerator(size),
            )}
            ref={toRightBtnRef}
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
            onClick={handleTabAdd}
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
            canToLeft || canToRight ? tdClassGenerator('is-scrollable') : '',
          )}
          ref={scrollBarRef}
        >
          <div
            className={classNames(
              tdTabsClassGenerator('nav-wrap'),
              ['left', 'right'].includes(placement) ? tdClassGenerator('is-vertical') : '',
              tdClassGenerator('is-smooth'),
            )}
            style={{ transform: `translate(${-scrollLeft}px, 0)` }}
            ref={navsWrapRef}
          >
            {placement !== 'bottom' ? TabBarCom : null}
            {!isCard && (
              <div className={classNames(tdTabsClassGenerator('bar'), tdClassGenerator(`is-${placement}`))} />
            )}
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
                onClick={() => handleTabItemClick(v)}
                onTabRemove={handleTabItemRemove}
                innerRef={(ref) => {
                  if (activeValue === v.value) {
                    setActiveTab(ref);
                  }
                }}
              />
            ))}
            {placement === 'bottom' ? TabBarCom : null}
          </div>
        </div>
      </div>
    </div>
  );
};

TabNav.displayName = 'TabNav';

export default TabNav;
