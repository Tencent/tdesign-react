import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TIconChevronRight } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import { DropdownProps } from './Dropdown';
import TDivider from '../divider';
import DropdownItem from './DropdownItem';
import DropdownSubmenu from './DropdownSubmenu';
import { DropdownOption } from './type';

const DropdownSub = (props: DropdownProps) => {
  const { options = [], maxHeight = 300, minColumnWidth = 10, maxColumnWidth = 160, children, direction } = props;
  const [flatItem, setFlatItem] = useState<any>([]);
  const maxColWidth = Number(maxColumnWidth) - 12;
  const minColWidth = Number(minColumnWidth) - 12;
  const arrMap = useMemo(() => new Map(), []);

  useEffect(() => {
    setFlatItem(arrMap);
  }, [arrMap]);
  const { classPrefix } = useConfig();
  const dropdownMenuClass = `${classPrefix}-dropdown__menu`;

  const handleItemClick = (options: {
    value: string | number | { [key: string]: any };
    context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
  }) => {
    const { value, context } = options;
    let data = null;
    if (flatItem.length !== 0) {
      data = flatItem.get(value);
    }
    data?.onClick?.(data, context);
    props.onClick(data, context);
  };

  const handleChild = (children?: React.ReactNode) => {
    if (children[1].type === DropdownSubmenu) {
      return React.cloneElement(children[1], { className: classNames([children[1].className, 't-dropdown__submenu']) });
    }
    if (children[1].type === DropdownItem) {
      return React.cloneElement(children[1], { className: 't-dropdown__item' });
    }
  };
  const renderMenuNodes = (data: Array<DropdownOption | React.ReactChild>) => {
    const arr = [];
    let obj: ReactElement | null = null;
    data.forEach((menu, id) => {
      const tmp = { ...(menu as Record<string, any>) };
      // const { value } = tmp;
      const optionItem = tmp as DropdownOption;
      arrMap.set(optionItem.value, optionItem);

      if (tmp.children) {
        tmp.children = renderMenuNodes(tmp.children);
        obj = (
          <div
            key={id}
            style={{
              maxWidth: `${maxColWidth}px`,
              minWidth: `${minColWidth}px`,
            }}
          >
            <DropdownItem
              className={classNames(`${classPrefix}-dropdown__item--suffix`, `${classPrefix}-dropdown__item`)}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              prefixIcon={optionItem.prefixIcon}
              disabled={optionItem.disabled}
              minColumnWidth={minColumnWidth}
              maxColumnWidth={maxColumnWidth}
              onclick={() => null}
            >
              <div className={`${classPrefix}-dropdown__item-content`}>
                <span className={`${classPrefix}-dropdown__item-text`}>{optionItem.content}</span>
              <TIconChevronRight className={`${classPrefix}-dropdown__item-subicon`} />
              </div>
              <DropdownSubmenu
                className={classNames(`${classPrefix}-dropdown__submenu`, {
                  [`${classPrefix}-dropdown__submenu-disabled`]: optionItem.disabled,
                  [`${classPrefix}-dropdown__submenu-${direction}`]: optionItem.direction,
                })}
                style={{
                  maxWidth: `${maxColWidth}px`,
                  minWidth: `${minColWidth}px`,
                }}
              >
                {tmp.children}
              </DropdownSubmenu>
            </DropdownItem>
            {optionItem.divider ? <TDivider /> : null}
          </div>
        );
      } else {
        obj = (
          <div
            key={id}
            style={{
              maxWidth: `${maxColWidth}px`,
              minWidth: `${minColWidth}px`,
            }}
          >
            <DropdownItem
              className={`${classPrefix}-dropdown__item`}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              prefixIcon={optionItem.prefixIcon}
              disabled={optionItem.disabled}
              minColumnWidth={minColumnWidth}
              maxColumnWidth={maxColumnWidth}
              onclick={
                optionItem.disabled
                  ? () => null
                  : (
                      value: string | number | { [key: string]: any },
                      context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> },
                    ) => handleItemClick({ value, context })
              }
            >
              <span className={`${classPrefix}-dropdown-text`}>{optionItem.content}</span>
            </DropdownItem>
            {optionItem.divider ? <TDivider /> : null}
          </div>
        );
      }
      arr.push(obj);
    });
    return arr;
  };

  return (
    <div
      className={classNames(dropdownMenuClass, 'narrow-scrollbar')}
      style={{
        maxHeight: `${maxHeight}px`,
        maxWidth: `${maxColWidth}px`,
        minWidth: `${minColWidth}px`,
      }}
    >
      {options.length !== 0 ? renderMenuNodes(options) : handleChild(children)}
    </div>
  );
};

DropdownSub.displayName = 'DropdownSub';

export default DropdownSub;
