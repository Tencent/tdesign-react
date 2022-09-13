import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TdIconChevronRight, ChevronLeftIcon as TdIconChevronLeft } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import { DropdownProps } from './Dropdown';
import TDivider from '../divider';
import DropdownItem from './DropdownItem';
import { DropdownOption } from './type';
import useGlobalIcon from '../hooks/useGlobalIcon';

const DropdownMenu = (props: DropdownProps) => {
  const { options = [], maxHeight = 300, minColumnWidth = 10, maxColumnWidth = 160, direction } = props;

  const { classPrefix } = useConfig();
  const dropdownClass = `${classPrefix}-dropdown`;
  const dropdownMenuClass = `${dropdownClass}__menu`;

  const { ChevronRightIcon, ChevronLeftIcon } = useGlobalIcon({
    ChevronRightIcon: TdIconChevronRight,
    ChevronLeftIcon: TdIconChevronLeft,
  });

  const handleItemClick = (options: {
    data: DropdownOption;
    context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
  }) => {
    const { data, context } = options;
    data?.onClick?.(data, context);
    props.onClick?.(data, context);
  };

  // 处理options渲染的场景
  const renderOptions = (data: Array<DropdownOption | React.ReactChild>) => {
    const arr = [];
    let renderContent: ReactElement;
    data.forEach?.((menu, idx) => {
      const optionItem = { ...(menu as DropdownOption) };

      if (optionItem.children) {
        optionItem.children = renderOptions(optionItem.children);
        renderContent = (
          <div key={idx}>
            <DropdownItem
              className={classNames(`${dropdownClass}__item`, `${dropdownClass}__item--suffix`)}
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
                {direction === 'right' ? (
                  <>
                    <span className={`${dropdownClass}__item-text`}>{optionItem.content}</span>
                    <ChevronRightIcon className={`${dropdownClass}__item-direction`} size="16" />
                  </>
                ) : (
                  <>
                    <ChevronLeftIcon className={`${dropdownClass}__item-direction`} size="16" />
                    <span className={`${dropdownClass}__item-text`}>{optionItem.content}</span>
                  </>
                )}
              </div>
              <div
                className={classNames(`${dropdownClass}__submenu`, {
                  [`${dropdownClass}__submenu--disabled`]: optionItem.disabled,
                  [`${dropdownClass}__submenu--${direction}`]: direction,
                })}
                style={{
                  top: `${idx * 30}px`,
                }}
              >
                <ul>{optionItem.children}</ul>
              </div>
            </DropdownItem>
            {optionItem.divider ? <TDivider /> : null}
          </div>
        );
      } else {
        renderContent = (
          <div key={idx}>
            <DropdownItem
              className={`${dropdownClass}__item`}
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
              <span className={`${dropdownClass}-text`}>{optionItem.content}</span>
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
      className={classNames(dropdownMenuClass, `${dropdownMenuClass}--${direction}`)}
      style={{
        maxHeight: `${maxHeight}px`,
      }}
    >
      {renderOptions(options)}
    </div>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
