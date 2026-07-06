import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { throttle } from 'lodash-es';
import { ChevronRightIcon as TdIconChevronRight } from 'tdesign-icons-react';

import TDivider from '../divider';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import DropdownItem from './DropdownItem';

import type { DropdownProps } from './Dropdown';
import type { DropdownOption } from './type';

const DropdownMenu: React.FC<DropdownProps> = (props) => {
  const {
    options = [],
    maxHeight = 300,
    minColumnWidth = 10,
    maxColumnWidth = 160,
    direction,
    panelTopContent,
    panelBottomContent,
  } = props;

  const { classPrefix } = useConfig();
  const dropdownClass = `${classPrefix}-dropdown`;
  const dropdownMenuClass = `${dropdownClass}__menu`;
  const [panelTopContentHeight, setPanelTopContentHeight] = useState(0);
  const { ChevronRightIcon } = useGlobalIcon({
    ChevronRightIcon: TdIconChevronRight,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const [isOverMaxHeight, setIsOverMaxHeight] = useState(false);
  const [calcScrollTopMap, setScrollTopMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const menuChildren = menuElement.children;
      requestAnimationFrame(() => {
        if (panelTopContent) {
          const firstEl = menuChildren[0];
          const panelTopHeight = firstEl ? parseInt(getComputedStyle(firstEl)?.height, 10) : 0;
          setPanelTopContentHeight(panelTopHeight || 0);
        }
      });
      const menuHeight = menuChildren?.length * 30;
      if (menuHeight >= maxHeight) setIsOverMaxHeight(true);
    }
  }, [maxHeight, panelTopContent]);

  const handleItemClick = (options: {
    data: DropdownOption;
    context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
  }) => {
    const { data, context } = options;
    data?.onClick?.(data, context);
    props.onClick?.(data, context);
  };

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>, deep = 0) => {
    const { scrollTop } = e.target as HTMLElement;
    setScrollTopMap({ ...calcScrollTopMap, [deep]: scrollTop });
  };

  const throttleUpdate = throttle(handleScroll, 100);

  // 处理options渲染的场景
  const renderOptions = (data: Array<DropdownOption | React.ReactElement>, deep: number) => {
    const arr: React.ReactElement[] = [];
    let renderContent: React.ReactElement;
    data.forEach?.((menu, idx) => {
      const optionItem = { ...(menu as DropdownOption) };
      const onViewIdx = Math.ceil(calcScrollTopMap[deep] / 30);
      const isOverflow = idx >= onViewIdx;
      // 只有第一层子节点需要加上 panelTopContent 的高度
      const shouldCalcPanelTopContent = panelTopContent && deep > 0;

      const itemIdx = isOverflow ? idx - onViewIdx : idx;
      if (optionItem.children) {
        (optionItem.children as unknown as React.ReactElement[]) = renderOptions(optionItem.children, deep + 1);
        renderContent = (
          <div key={idx}>
            <DropdownItem
              className={classNames(optionItem.className, `${dropdownClass}__item`, `${dropdownClass}__item--suffix`)}
              style={optionItem.style}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              prefixIcon={optionItem.prefixIcon}
              disabled={optionItem.disabled}
              minColumnWidth={minColumnWidth}
              maxColumnWidth={maxColumnWidth}
              isSubmenu={true}
            >
              <div className={`${dropdownClass}__item-content`}>
                <span className={`${dropdownClass}__item-text`}>{optionItem.content}</span>
                <ChevronRightIcon className={`${dropdownClass}__item-direction`} size="16" />
              </div>
              <div
                className={classNames(`${dropdownClass}__submenu-wrapper`, {
                  [`${dropdownClass}__submenu-wrapper--${props.direction}`]: props.direction,
                })}
                style={{
                  position: 'absolute',
                  top: `${itemIdx * 30 + (shouldCalcPanelTopContent ? 0 : panelTopContentHeight)}px`,
                }}
              >
                <div
                  className={classNames(`${dropdownClass}__submenu`, {
                    [`${dropdownClass}__submenu--disabled`]: optionItem.disabled,
                  })}
                  style={{
                    position: 'static',
                    maxHeight: `${props.maxHeight}px`,
                  }}
                  onScroll={(e: React.MouseEvent<HTMLDivElement>) => handleScroll(e, deep + 1)}
                >
                  <ul>{optionItem.children as React.ReactNode}</ul>
                </div>
              </div>
            </DropdownItem>
            {optionItem.divider ? <TDivider /> : null}
          </div>
        );
      } else {
        renderContent = (
          <div key={idx}>
            <DropdownItem
              className={classNames(optionItem.className, `${dropdownClass}__item`)}
              style={optionItem.style}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              prefixIcon={optionItem.prefixIcon}
              disabled={optionItem.disabled}
              minColumnWidth={minColumnWidth}
              maxColumnWidth={maxColumnWidth}
              onClick={
                optionItem.disabled || optionItem.children
                  ? () => null
                  : (
                      value: string | number | { [key: string]: any },
                      context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> },
                    ) => handleItemClick({ data: optionItem, context })
              }
            >
              <span className={`${dropdownClass}__item-text`}>{optionItem.content}</span>
            </DropdownItem>
            {optionItem.divider ? <TDivider /> : null}
          </div>
        );
      }
      arr.push(renderContent);
    });
    return arr;
  };

  return (
    <div
      className={classNames(dropdownMenuClass, `${dropdownMenuClass}--${direction}`, {
        [`${dropdownMenuClass}--overflow`]: isOverMaxHeight,
      })}
      style={{
        maxHeight: `${maxHeight}px`,
      }}
      ref={menuRef}
      onScroll={throttleUpdate}
    >
      {panelTopContent ? <div className={`${dropdownClass}__top-content`}>{panelTopContent}</div> : null}
      {renderOptions(options, 0)}
      {panelBottomContent ? <div className={`${dropdownClass}__bottom-content`}>{panelBottomContent}</div> : null}
    </div>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
