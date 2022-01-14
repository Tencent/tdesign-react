import React, { useState, isValidElement } from 'react';
import classNames from 'classnames';
import { DropdownOption } from './type';
import useConfig from '../_util/useConfig';
import { DropdownProps } from './Dropdown';
import DropdownItem from './DropdownItem';

const DropdownMenu = (props: DropdownProps) => {
  const { options = [], maxHeight = 300, maxColumnWidth = 300, minColumnWidth = 10 } = props;
  const [path, setPath] = useState<string>('');
  const { classPrefix } = useConfig();
  const dropdownMenuClass = `${classPrefix}-dropdown__menu`;

  const isActive = (item: DropdownOption | React.ReactChild, pathPrefix: string, excludeSelf = true): boolean => {
    const itemPath = isValidElement(item)
      ? `${pathPrefix}/${item.props.value}`
      : `${pathPrefix}/${(item as DropdownOption).value}`;
    if (excludeSelf && path === itemPath) {
      return false;
    }
    return path.indexOf(itemPath) === 0;
  };

  const isDropdownItem = (child) => {
    if (isValidElement(child) && child.type === DropdownItem) {
      return true;
    }
    return false;
  };

  const getActiveItemChild = (children, type: 'DropdownItem' | 'Normal' = 'DropdownItem') => {
    if (!children) {
      return [];
    }
    const activeItemChildren = React.Children.toArray(children);
    return type === 'DropdownItem'
      ? activeItemChildren.filter((e) => isDropdownItem(e))
      : activeItemChildren.filter((e) => !isDropdownItem(e));
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
  const renderDropdownColumn = (
    children: Array<DropdownOption | React.ReactChild>,
    showSubmenu: boolean,
    pathPrefix: string,
  ) => {
    // eslint-disable-next-line
    const menuClass = [`${dropdownMenuClass}-column`, 'narrow-scrollbar', { submenu__visible: showSubmenu }];
    return (
      <div
        key={`/${pathPrefix}`}
        className={classNames(menuClass)}
        style={{
          maxHeight: `${maxHeight}px`,
        }}
      >
        {children.map((item, idx) => {
          if (!isDropdownItem(item)) {
            const optionItem = item as DropdownOption;
            return (
              <DropdownItem
                key={idx}
                disabled={optionItem.disabled}
                active={isActive(optionItem, pathPrefix) || optionItem.active}
                value={optionItem.value}
                content={optionItem.content}
                divider={optionItem.divider}
                hasChildren={optionItem.children && optionItem.children.length > 0}
                path={`${pathPrefix}/${optionItem.value}`}
                maxColumnWidth={maxColumnWidth}
                minColumnWidth={minColumnWidth}
                onClick={(data: DropdownOption, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) =>
                  handleItemClick(data, context, idx)
                }
                onHover={handleHoverItem}
              />
            );
          }
          const childItem = item as React.ReactElement;
          return React.cloneElement(childItem, {
            key: idx,
            hasChildren: getActiveItemChild(childItem.props.children).length > 0,
            path: `${pathPrefix}/${childItem.props.value}`,
            maxColumnWidth,
            minColumnWidth,
            onHover: handleHoverItem,
            active: isActive(item, pathPrefix) || childItem.props.active,
            children: getActiveItemChild(childItem.props.children, 'Normal'),
          });
        })}
      </div>
    );
  };

  const dropdownItems = (options: Array<DropdownOption | React.ReactChild>, pathPrefix = '') => {
    const columns = [];
    // 获取当前活跃状态item
    const activeItem = options.find((item) => isActive(item, pathPrefix, false));
    columns.push(renderDropdownColumn(options, !!activeItem, pathPrefix));

    if (isValidElement(activeItem)) {
      const activeItemChildren = getActiveItemChild(activeItem.props.children);
      if (activeItemChildren.length > 0) {
        columns.push(...dropdownItems(activeItemChildren, `${pathPrefix}/${activeItem.props.value}`));
      }
    } else if ((activeItem as DropdownOption)?.children?.length) {
      columns.push(
        ...dropdownItems(
          (activeItem as DropdownOption).children,
          `${pathPrefix}/${(activeItem as DropdownOption).value}`,
        ),
      );
    }
    return columns;
  };

  const itemContent = getActiveItemChild(props?.children);

  const renderDropdownItems = dropdownItems(itemContent.length > 0 ? itemContent : options);
  return <div className={dropdownMenuClass}>{renderDropdownItems}</div>;
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
