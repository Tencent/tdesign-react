import React, { useCallback, useRef, useState, useEffect } from 'react';
import useConfig from '../_util/useConfig';
import classNames from 'classnames';
import { TabsProps } from './TabProps';
import { Combine } from 'src/_type';
import { TabPanelProps } from './TabPanel';
import TabBar from './TabBar';
import { IconFont } from '../icon';

const TabNav: React.FC<Combine<
  TabsProps,
  {
    panels: Combine<TabPanelProps, { key: string }>[];
    activeId: any;
    onClick: (idx: number) => any;
  }
>> = (props) => {
  const { classPrefix } = useConfig();
  const navContainerRef = useRef<HTMLDivElement>(null);
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
    // onClose,
    // onAdd,
  } = props;

  const [isScroll, setIsScroll] = useState<boolean>(false);

  useEffect(() => {
    /**
     * scroll 处理逻辑
     */

    if (theme === 'card') {
    } else {
      setIsScroll(false);
    }
  }, [panels, tabPosition, theme]);

  const tabNavClick = useCallback(
    (idx: number) => {
      onClick(idx);
    },
    [onClick]
  );

  // const handleScroll = useCallback(() => {}, []);

  useEffect(() => {
    // 处理变动
    // setInterval(() => {}, 500);
  }, []);

  return (
    <div
      className={classNames(`${tabsClassPrefix}__header`, {
        [`t-is-${tabPosition}`]: true,
      })}
    >
      <div className={classNames(`${navClassPrefix}`)}>
        <span className="t-tabs__add-btn t-size-m"> + </span>
        <div
          className={classNames({
            [`${navClassPrefix}-container`]: true,
            [`t-is-${tabPosition}`]: true,
            ['t-is-addable']: addable,
          })}
        >
          {isScroll && (
            <span
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
          >
            <div
              className={classNames(`${tabsClassPrefix}__nav-wrap`)}
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
                  onClick={() => {
                    if (panel.disabled) {
                      return;
                    }
                    tabNavClick(index);
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
                      onClick={null}
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
