import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TdIconChevronRight } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import { DropdownProps } from './Dropdown';
import TDivider from '../divider';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import { DropdownOption } from './type';
import useGlobalIcon from '../hooks/useGlobalIcon';

const DropdownSub = (props: DropdownProps) => {
  const { options = [], maxHeight = 300, minColumnWidth = 10, maxColumnWidth = 160, children, direction } = props;
  const { classPrefix } = useConfig();
  const [flatItem, setFlatItem] = useState<any>([]);

  const maxColWidth = Number(maxColumnWidth) - 12;
  const minColWidth = Number(minColumnWidth) - 12;
  const arrMap = useMemo(() => new Map(), []);

  const dropdownClass = `${classPrefix}-dropdown`;
  const dropdownMenuClass = `${dropdownClass}__menu`;

  const { ChevronRightIcon } = useGlobalIcon({ ChevronRightIcon: TdIconChevronRight });

  useEffect(() => {
    setFlatItem(arrMap);
  }, [arrMap]);

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
    props.onClick?.(data, context);
  };

  const renderItems = (children?: React.ReactNode) => {
    if (children[1].type === DropdownMenu) {
      return React.cloneElement(children[1], {
        className: classNames([children[1].className, `${dropdownClass}__submenu`]),
      });
    }
    if (children[1].type === DropdownItem) {
      return React.cloneElement(children[1], { className: `${dropdownClass}__item` });
    }
  };

  const renderMenuNodes = (data: Array<DropdownOption | React.ReactChild>) => {
    const arr = [];
    let obj: ReactElement | null = null;
    data.forEach((menu, idx) => {
      const tmp = { ...(menu as Record<string, any>) };
      const optionItem = tmp as DropdownOption;
      arrMap.set(optionItem.value, optionItem);

      if (tmp.children) {
        tmp.children = renderMenuNodes(tmp.children);
        obj = (
          <div
            key={idx}
            style={{
              maxWidth: `${maxColWidth}px`,
              minWidth: `${minColWidth}px`,
            }}
          >
            <DropdownItem
              className={classNames(`${dropdownClass}__item`, `${dropdownClass}__item--suffix`)}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              prefixIcon={optionItem.prefixIcon}
              disabled={optionItem.disabled}
              minColumnWidth={minColumnWidth}
              maxColumnWidth={maxColumnWidth}
            >
              <div className={`${dropdownClass}__item-content`}>
                <span className={`${dropdownClass}__item-text`}>{optionItem.content}</span>
                <ChevronRightIcon />
              </div>
              <DropdownMenu
                className={classNames(`${dropdownClass}__submenu`, {
                  [`${dropdownClass}__submenu-disabled`]: optionItem.disabled,
                  [`${dropdownClass}__submenu-${direction}`]: optionItem.direction,
                })}
                style={{
                  maxWidth: `${maxColWidth}px`,
                  minWidth: `${minColWidth}px`,
                  top: `${idx * 28}px`,
                }}
              >
                {tmp.children}
              </DropdownMenu>
            </DropdownItem>
            {optionItem.divider ? <TDivider /> : null}
          </div>
        );
      } else {
        obj = (
          <div
            key={idx}
            style={{
              maxWidth: `${maxColWidth}px`,
              minWidth: `${minColWidth}px`,
            }}
          >
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
                optionItem.disabled
                  ? () => null
                  : (
                      value: string | number | { [key: string]: any },
                      context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> },
                    ) => handleItemClick({ value, context })
              }
            >
              <span className={`${dropdownClass}-text`}>{optionItem.content}</span>
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
      className={dropdownMenuClass}
      style={{
        maxHeight: `${maxHeight}px`,
        maxWidth: `${maxColWidth}px`,
        minWidth: `${minColWidth}px`,
      }}
    >
      {options.length !== 0 ? renderMenuNodes(options) : renderItems(children)}
    </div>
  );
};

DropdownSub.displayName = 'DropdownSub';

export default DropdownSub;
