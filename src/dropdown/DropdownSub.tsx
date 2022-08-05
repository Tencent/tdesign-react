import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { DropdownOption } from './type';
import useConfig from '../_util/useConfig';
import { DropdownProps } from './Dropdown';
import TDivider from '../divider';
import DropdownItem from './DropdownItem';
import DropdownSubmenu from './DropdownSubmenu';
import { ChevronRightIcon as TIconChevronRight } from 'tdesign-icons-react';

const DropdownSub = (props: DropdownProps) => {
  const {
    options = [],
    maxHeight = 300,
    minColumnWidth = 10,
    maxColumnWidth = 160,
    theme = 'default',
    icon,
    children,
    direction,
  } = props;

  const [flatItem, setFlatItem] = useState<array>([]);
  let maxColWidth = Number(maxColumnWidth) * 0.925;
  let minColWidth = Number(minColumnWidth) * 0.925;
  let arrMap = new Map();

  useEffect(() => {
    setFlatItem(arrMap);
  }, []);
  const { classPrefix } = useConfig();
  const dropdownMenuClass = `${classPrefix}-dropdown-menu`;

  const handleItemClick = (
    options: {
      context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
      value: number | string;
    },
    data: number | string,
  ) => {
    const { context, value } = options;
    if (flatItem.length !== 0) {
      data = flatItem.get(value);
    }
    data?.onClick?.(data, context);
    props.onClick(data, context);
  };
  let iconNode = <div className={`${classPrefix}-dropdown-item-icon`}>{icon}</div>;

  const handleChild = (children?: React.ReactElement) => {
    if (children[1].type === DropdownSubmenu) {
      return React.cloneElement(children[1], { className: classNames([children[1].className, 't-dropdown-submenu']) });
    }
    if (children[1].type === DropdownItem) {
      return React.cloneElement(children[1], { className: 't-dropdown-item' });
    }
  };
  const renderMenuNodes = (data: Array<DropdownOption | React.ReactChild>) => {
    let arr = [];
    let obj = '';
    data.forEach((menu, id) => {
      const tmp = { ...menu };
      const { value } = tmp;
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
              className={classNames(`${classPrefix}-dropdown-item-suffix`, `${classPrefix}-dropdown-item`)}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              disabled={optionItem.disabled}
            >
              <div className={`${classPrefix}-dropdown-item-content`}>
                {iconNode}
                <span className={`${classPrefix}-dropdown-item-text`}>{optionItem.content}</span>
              </div>
              <TIconChevronRight className={`${classPrefix}-dropdown-item-subicon`} />
              <DropdownSubmenu
                className={classNames(`${classPrefix}-dropdown-submenu`, {
                  [`${classPrefix}-dropdown-submenu-disabled`]: optionItem.disabled,
                  [`${classPrefix}-dropdown-submenu-${direction}`]: optionItem.direction,
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
              className={`${classPrefix}-dropdown-item`}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              disabled={optionItem.disabled}
              onClick={
                optionItem.disabled
                  ? () => null
                  : (context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) =>
                      handleItemClick({ context, value })
              }
            >
              {iconNode}
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
      {options.length != 0 ? renderMenuNodes(options) : handleChild(children)}
    </div>
  );
};

DropdownSub.displayName = 'DropdownSub';

export default DropdownSub;
