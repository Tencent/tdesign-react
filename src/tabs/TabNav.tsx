import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Combine } from 'src/_type';
import useConfig from '../_util/useConfig';
import { IconFont } from '../icon';
import noop from '../_util/noop';
import { TabsProps, TabPanelProps } from './TabProps';
import TabBar from './TabBar';

const TabNav: React.FC<Combine<
  TabsProps,
  {
    panels: Combine<TabPanelProps, { key: string }>[];
    activeId: any;
    onClick: (e, idx: number) => any;
  }
>> = (props) => {
  const { classPrefix } = useConfig();
  const [wrapTranslateX, setWrapTranslateX] = useState<number>(0);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const wrapDifference = useRef<number>(0);
  const tabsClassPrefix = `${classPrefix}-tabs`;
  const navClassPrefix = `${tabsClassPrefix}__nav`;

  const {
    panels,
    tabPosition,
    size,
    activeId,
    theme,
    onClick,
    addable,
    onClose,
    onAdd = noop,
  } = props;

  const [isScroll, setIsScroll] = useState<boolean>(false);

  const tabNavClick = useCallback(
    (event, idx: number) => {
      onClick(event, idx);
    },
    [onClick],
  );

  const handleScroll = useCallback(
    ({ position }: { position: 'left' | 'right' }) => {
      if (!isScroll) return;
      const absWrapTranslateX = Math.abs(wrapTranslateX);
      let delt = 0;
      if (position === 'left') {
        delt = absWrapTranslateX < 0 ? 0 : Math.min(absWrapTranslateX, 100);
        setWrapTranslateX(() => wrapTranslateX + delt);
      } else if (position === 'right') {
        delt =
          absWrapTranslateX >= wrapDifference.current
            ? 0
            : Math.min(wrapDifference.current - absWrapTranslateX, 100);
        setWrapTranslateX(() => wrapTranslateX - delt);
      }
    },
    [isScroll, wrapTranslateX],
  );

  const wrapStyle = useMemo(
    () => ({
      transform: `translateX(${wrapTranslateX}px)`,
    }),
    [wrapTranslateX],
  );

  const checkScroll = useCallback(() => {
    if (theme === 'card' && ['bottom', 'top'].includes(tabPosition)) {
      if (navScrollRef.current && navContainerRef.current) {
        wrapDifference.current =
          navContainerRef.current.offsetWidth - navScrollRef.current.offsetWidth;
        if (wrapDifference.current > 0) {
          setIsScroll(true);
        }
      }
    } else {
      setIsScroll(false);
    }
  }, [theme, tabPosition]);

  const scrollToActiveItem = () => {
    if (!isScroll) return;
    const $navScroll = navScrollRef.current as any;
    const $navWrap = navContainerRef.current as any;
    const $tabActive = $navWrap.querySelector('.t-is-active');
    if (!$tabActive) return;
    const navScrollBounding = $navScroll.getBoundingClientRect();
    const tabActiveBounding = $tabActive.getBoundingClientRect();
    const currOffset = wrapTranslateX;
    let newOffset = currOffset;

    if (tabActiveBounding.left < navScrollBounding.left) {
      newOffset = currOffset + (navScrollBounding.left - tabActiveBounding.left);
    }
    if (tabActiveBounding.right > navScrollBounding.right) {
      newOffset = currOffset - (tabActiveBounding.right - navScrollBounding.right);
    }
    newOffset = Math.min(newOffset, 0);
    setWrapTranslateX(newOffset);
  };

  useEffect(() => {
    /**
     * scroll 处理逻辑
     */
    checkScroll();
  }, [panels, tabPosition, theme, checkScroll]);

  useEffect(() => {
    let timer = null;
    // 处理变动
    if (theme === 'card') {
      timer = setInterval(() => {
        checkScroll();
      }, 500);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [checkScroll, theme]);

  return (
    <div
      className={classNames(`${tabsClassPrefix}__header`, {
        [`t-is-${tabPosition}`]: true,
      })}
    >
      <div className={classNames(`${navClassPrefix}`)}>
        {theme === 'card' && addable && (
          <span
            className="t-tabs__add-btn t-size-m"
            onClick={(e) => {
              scrollToActiveItem();
              onAdd(e);
            }}
          >
            +
          </span>
        )}
        <div
          className={classNames({
            [`${navClassPrefix}-container`]: true,
            [`t-is-${tabPosition}`]: true,
            ['t-is-addable']: addable,
          })}
        >
          {isScroll && (
            <span
              onClick={() => handleScroll({ position: 'left' })}
              className={classNames({
                ['t-tabs__scroll-btn']: true,
                ['t-tabs__scroll-btn--left']: true,
                ['t-size-m']: size === 'middle',
                ['t-size-l']: size === 'large',
              })}
            >
              <IconFont name={'arrow-left'} />
            </span>
          )}
          {isScroll && (
            <span
              onClick={() => handleScroll({ position: 'right' })}
              className={classNames({
                ['t-tabs__scroll-btn']: true,
                ['t-tabs__scroll-btn--right']: true,
                ['t-size-m']: size === 'middle',
                ['t-size-l']: size === 'large',
              })}
            >
              <IconFont name={'arrow-right'} />
            </span>
          )}
          <div
            className={classNames({
              ['t-tabs__nav-scroll']: true,
              ['t-is-scrollable']: isScroll,
            })}
            ref={navScrollRef}
          >
            <div
              className={classNames(`${tabsClassPrefix}__nav-wrap`)}
              style={wrapStyle}
              ref={navContainerRef}
            >
              <TabBar
                tabPosition={tabPosition}
                activeId={activeId}
                containerRef={navContainerRef}
              />
              {panels.map((panel, index) => (
                <div
                  key={index}
                  onClick={(event) => {
                    if (panel.disabled) {
                      return;
                    }
                    tabNavClick(event, index);
                  }}
                  className={classNames({
                    [`${navClassPrefix}-item`]: true,
                    [`${navClassPrefix}--card`]: theme === 'card',
                    ['t-is-disabled']: panel.disabled,
                    ['t-is-active']: activeId === index,
                    ['t-is-left']: tabPosition === 'left',
                    ['t-is-right']: tabPosition === 'right',
                    ['t-size-m']: size === 'middle',
                    ['t-size-l']: size === 'large',
                  })}
                >
                  {panel.label}
                  {panel.closable && theme === 'card' && (
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose(e, String(panel.name));
                      }}
                      viewBox="0 0 16 16"
                      className={classNames({
                        ['remove-btn']: true,
                        ['t-icon']: true,
                        ['t-icon-close']: true,
                      })}
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 8L13 12 12 13 8 9 4 13 3 12 7 8 3 4 4 3 8 7 12 3 13 4z"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TabNav.displayName = 'TabNav';

export default TabNav;
