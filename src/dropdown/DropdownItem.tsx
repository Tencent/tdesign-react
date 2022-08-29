import React, { useRef, forwardRef } from 'react';
import classNames from 'classnames';
import { DropdownOption, TdDropdownProps, DropdownItemTheme } from './type';
import useConfig from '../hooks/useConfig';
import useRipple from '../_util/useRipple';
import { dropdownItemDefaultProps } from './defaultProps';

type DropdownItemProps = Pick<DropdownOption, 'value'> &
  Pick<TdDropdownProps, 'maxColumnWidth' | 'minColumnWidth'> & {
    className?: string;
    active?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    theme?: DropdownItemTheme;
    prefixIcon?: React.ReactNode;
    onClick?: (value: any, e: any) => void;
  };

const DropdownItem = forwardRef((props: DropdownItemProps, ref: React.RefObject<HTMLDivElement>) => {
  const { children, className, active, disabled, value, theme, prefixIcon, maxColumnWidth, minColumnWidth, onClick } =
    props;
  const { classPrefix } = useConfig();
  const maxColWidth = Number(maxColumnWidth) - 28;
  const minColWidth = Number(minColumnWidth) - 28;
  const prefixIconNode = <div className={`${classPrefix}-dropdown__item-icon`}>{prefixIcon}</div>;
  const dropdownItemRef = useRef(null);

  useRipple(ref || dropdownItemRef);

  return (
    <>
      <li
        className={classNames(className, `${classPrefix}-dropdown__item--theme-${theme}`, {
          [`${classPrefix}-dropdown__item--active`]: active,
          [`${classPrefix}-dropdown__item--disabled`]: disabled,
        })}
        onClick={onClick ? (e) => onClick(value, e) : () => null}
        style={{
          maxWidth: `${maxColWidth}px`,
          minWidth: `${minColWidth}px`,
        }}
        ref={ref || dropdownItemRef}
      >
        {prefixIcon && prefixIconNode}
        {children}
      </li>
    </>
  );
});

DropdownItem.displayName = 'DropdownItem';
DropdownItem.defaultProps = dropdownItemDefaultProps;

export default DropdownItem;
