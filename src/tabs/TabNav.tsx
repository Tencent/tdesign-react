import React, { useCallback, useEffect, useRef, useState, WheelEvent } from 'react';
import classNames from 'classnames';
import {
  AddIcon as TdAddIcon,
  ChevronLeftIcon as TdChevronLeftIcon,
  ChevronRightIcon as TdChevronRightIcon,
} from 'tdesign-icons-react';
import { omit , debounce } from 'lodash-es';
import { TdTabsProps, TdTabPanelProps, TabValue } from './type';
import noop from '../_util/noop';
import { useTabClass } from './useTabClass';
import TabNavItem from './TabNavItem';
import TabBar from './TabBar';
import { calcMaxOffset, calcValidOffset, calculateOffset, calcPrevOrNextOffset } from '../_common/js/tabs/base';
import useGlobalIcon from '../hooks/useGlobalIcon';
import type { DragSortInnerProps } from '../hooks/useDragSorter';
import parseTNode from '../_util/parseTNode';

export interface TabNavProps extends TdTabsProps, DragSortInnerProps {
  itemList: TdTabPanelProps[];
  tabClick: (s: TabValue) => void;
  activeValue: TabValue;
  size?: 'medium' | 'large';
  children?: React.ReactNode;
}

const TabNav: React.FC<TabNavProps> = (props) => {
  const {
    placement = 'top',
    itemList = [],
    tabClick = noop,
    theme,
    addable,
    onAdd,
    scrollPosition = 'auto',
    size = 'medium',
    disabled = false,
    onRemove = noop,
    onChange = noop,
    activeValue,
    children,
    action,
    getDragProps,
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
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);
  const [activeTab, setActiveTab] = useState<HTMLElement>(null);

  const setOffset = (offset: number) => {
    setScrollLeft(calcValidOffset(offset, maxScrollLeft));
  };

  const getMaxScrollLeft = useCallback(() => {
    if (['top', 'bottom'].includes(placement.toLowerCase())) {
      const maxOffset = calcMaxOffset({
        navsWrap: navsWrapRef.current,
        navsContainer: navsContainerRef.current,
        rightOperations: rightOperationsRef.current,
        toRightBtn: toRightBtnRef.current,
      });
      setMaxScrollLeft(maxOffset);
    }
  }, [placement]);

  const moveActiveTabIntoView = () => {
    const offset = calculateOffset(
      {
        activeTab,
        navsContainer: navsContainerRef.current,
        leftOperations: leftOperationsRef.current,
        rightOperations: rightOperationsRef.current,
      },
      scrollLeft,
      scrollPosition,
    );
    setOffset(offset);
  };

  // 当 activeTab 变化时，移动 activeTab 到可视区域
  useEffect(() => {
    const timeout = setTimeout(() => {
      moveActiveTabIntoView();
    }, 100);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, maxScrollLeft, scrollPosition]);

  // 左右滑动按钮的展示状态
  useEffect(() => {
    if (['top', 'bottom'].includes(placement.toLowerCase())) {
      // 这里的 1 是小数像素不精确误差修正
      const canToLeft = scrollLeft > 1;
      const canToRight = scrollLeft < maxScrollLeft - 1;

      setToLeftBtnVisible(canToLeft);
      setToRightBtnVisible(canToRight);
    }
  }, [placement, scrollLeft, maxScrollLeft]);

  // 滚动条处理逻辑
  const handleScroll = (action: 'prev' | 'next') => {
    const offset = calcPrevOrNextOffset(
      {
        activeTab,
        navsContainer: navsContainerRef.current,
      },
      scrollLeft,
      action,
    );
    setOffset(offset);
  };

  // 滚轮和触摸板
  useEffect(() => {
    const scrollBar = scrollBarRef.current;
    if (!scrollBar) return;

    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
      if (!canToLeft && !canToRight) return;
      e.preventDefault();

      const { deltaX, deltaY } = e;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setOffset(scrollLeft + deltaX);
      } else {
        setOffset(scrollLeft + deltaY);
      }
    };

    scrollBar.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollBar?.removeEventListener('wheel', handleWheel);
    };
  });

  // handle window resize
  useEffect(() => {
    const onResize = debounce(getMaxScrollLeft, 300);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      onResize.cancel();
    };
  });

  useEffect(() => {
    getMaxScrollLeft();
  }, [itemList.length, children, getMaxScrollLeft]);

  // TabBar 组件逻辑层抽象，卡片类型时无需展示，故将逻辑整合到此处
  const TabBarCom = isCard ? null : (
    <TabBar tabPosition={placement} activeId={activeIndex} containerRef={navsWrapRef} navsWrapRef={navsWrapRef} />
  );

  const handleTabItemRemove = (removeItem) => {
    const { value: removeValue, index: removeIndex } = removeItem;
    if (removeValue === activeValue) {
      onChange(removeIndex === 0 ? itemList[removeIndex + 1]?.value : itemList[removeIndex - 1].value);
    }
    onRemove(removeItem);
  };

  const handleTabItemClick = (clickItem) => {
    tabClick(clickItem.value);
    if (activeValue !== clickItem.value) {
      onChange(clickItem.value);
    }
    clickItem?.onClick?.(clickItem.value);
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
              handleScroll('prev');
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
              handleScroll('next');
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
        {action ? (
          <div
            className={classNames(
              tdTabsClassGenerator('btn'),
              tdTabsClassGenerator('nav-action'),
              tdSizeClassGenerator(size),
            )}
          >
            {parseTNode(action)}
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
                {...omit(props, ['className', 'style'])}
                {...v}
                dragProps={{ ...getDragProps?.(index, v) }}
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
