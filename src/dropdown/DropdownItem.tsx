import React from 'react';
import classNames from 'classnames';
import { DropdownOption, TdDropdownProps, DropdownItemTheme } from './type';
import useConfig from '../hooks/useConfig';
import { dropdownItemDefaultProps } from './defaultProps';

type DropdownItemProps = Pick<DropdownOption, 'value'> &
  Pick<TdDropdownProps, 'maxColumnWidth' | 'minColumnWidth'> & {
    className?: string;
    active?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    theme?: DropdownItemTheme;
    prefixIcon?: React.ReactNode;
    onclick?: (value: any, e: any) => void;
  };

const DropdownItem = (props: DropdownItemProps) => {
  const { children, className, active, disabled, value, theme, prefixIcon, maxColumnWidth, minColumnWidth, onclick } =
    props;
  const { classPrefix } = useConfig();
  const maxColWidth = Number(maxColumnWidth) - 28;
  const minColWidth = Number(minColumnWidth) - 28;
  const keyOnly = String(value);
  const prefixIconNode = <div className={`${classPrefix}-dropdown__item-icon`}>{prefixIcon}</div>;
  return (
    <li
      key={keyOnly}
      className={classNames(className, `${classPrefix}-dropdown__item--theme-${theme}`, {
        [`${classPrefix}-dropdown__item--active`]: active,
        [`${classPrefix}-dropdown__item-disabled`]: disabled,
      })}
      onClick={onclick ? (e) => onclick(value, e) : () => null}
      style={{
        maxWidth: `${maxColWidth}px`,
        minWidth: `${minColWidth}px`,
      }}
    >
      {prefixIcon && prefixIconNode}
      {children}
    </li>
  );
};

DropdownItem.displayName = 'DropdownItem';
DropdownItem.defaultProps = dropdownItemDefaultProps;

export default DropdownItem;
