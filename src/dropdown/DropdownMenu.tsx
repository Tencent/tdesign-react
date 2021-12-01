import React, { useState } from 'react';
import classNames from 'classnames';
import { DropdownOption } from './type';
import useConfig from '../_util/useConfig';
import { DropdownProps } from './Dropdown';
import DropdownItem from './DropdownItem';

const DropdownMenu = (props: DropdownProps) => {
  const { options = [], maxHeight = 300, maxColumnWidth = 100, minColumnWidth = 10 } = props;
  const [path, setPath] = useState<string>('');
  const { classPrefix } = useConfig();
  const dropdownMenuClass = `${classPrefix}-dropdown__menu`;
  const isActive = (item: DropdownOption, pathPrefix: string, excludeSelf = true): boolean => {
    const itemPath = `${pathPrefix}/${item.value}`;
    if (excludeSelf && path === itemPath) {
      return false;
    }
    return path.indexOf(itemPath) === 0;
  };
  const handleHoverItem = (path: string) => {
    setPath(path);
  };
  const handleItemClick = (
    data: DropdownOption,
    context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> },
    idx: number,
  ) => {
    options[idx]?.onClick?.(data, context);
    props.onClick(data, context);
  };
  const renderDropdownColumn = (children: Array<DropdownOption>, showSubmenu: boolean, pathPrefix: string) => {
    // eslint-disable-next-line
    const menuClass = [`${dropdownMenuClass}__column`, 'narrow-scrollbar', { submenu__visible: showSubmenu }];
    return (
      <div
        key={`/${pathPrefix}`}
        className={classNames(menuClass)}
        style={{
          maxHeight: `${maxHeight}px`,
        }}
      >
        {children.map((item, idx) => (
          <DropdownItem
            key={idx}
            disabled={item.disabled}
            active={isActive(item, pathPrefix) || item.active}
            value={item.value}
            content={item.content}
            divider={item.divider}
            hasChildren={item.children && item.children.length > 0}
            path={`${pathPrefix}/${item.value}`}
            maxColumnWidth={maxColumnWidth}
            minColumnWidth={minColumnWidth}
            onClick={(data: DropdownOption, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) =>
              handleItemClick(data, context, idx)
            }
            onHover={handleHoverItem}
          />
        ))}
      </div>
    );
  };

  const dropdownItems = (options: Array<DropdownOption>, pathPrefix = '') => {
    const columns = [];
    const activeItem = options.find((item) => isActive(item, pathPrefix, false));
    columns.push(renderDropdownColumn(options, !!activeItem, pathPrefix));
    if (activeItem?.children?.length) {
      columns.push(...dropdownItems(activeItem.children, `${pathPrefix}/${activeItem.value}`));
    }
    return columns;
  };
  const renderDropdownItems = dropdownItems(options);
  return <div className={dropdownMenuClass}>{renderDropdownItems}</div>;
};

export default DropdownMenu;
