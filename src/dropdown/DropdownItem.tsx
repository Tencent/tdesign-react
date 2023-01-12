import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { DropdownOption, TdDropdownProps, DropdownItemTheme } from './type';
import useConfig from '../hooks/useConfig';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useRipple from '../_util/useRipple';
import { dropdownItemDefaultProps } from './defaultProps';
import { StyledProps } from '../common';
import { pxCompat } from '../_util/helper';

type DropdownItemProps = Pick<DropdownOption, 'value'> &
  Pick<TdDropdownProps, 'maxColumnWidth' | 'minColumnWidth'> &
  StyledProps & {
    active?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    theme?: DropdownItemTheme;
    prefixIcon?: React.ReactNode;
    onClick?: (value: DropdownOption['value'], e: unknown) => void;
    isSubmenu?: boolean;
  };

const DropdownItem = forwardRef((props: DropdownItemProps, ref: React.RefObject<HTMLLIElement>) => {
  const {
    children,
    className,
    active,
    disabled,
    value,
    theme,
    prefixIcon,
    maxColumnWidth,
    minColumnWidth,
    onClick,
    style,
    isSubmenu,
  } = props;
  const { classPrefix } = useConfig();
  const [dropdownItemDom, setRefCurrent] = useDomRefCallback();

  useRipple(isSubmenu ? null : ref?.current || dropdownItemDom);

  const handleItemClick = (e: React.MouseEvent) => {
    onClick?.(value, e);
  };
  return (
    <>
      <li
        className={classNames(className, `${classPrefix}-dropdown__item--theme-${theme}`, {
          [`${classPrefix}-dropdown__item--active`]: active,
          [`${classPrefix}-dropdown__item--disabled`]: disabled,
        })}
        onClick={handleItemClick}
        style={{
          maxWidth: pxCompat(maxColumnWidth),
          minWidth: pxCompat(minColumnWidth),
          ...style,
        }}
        ref={ref || setRefCurrent}
      >
        {prefixIcon ? <div className={`${classPrefix}-dropdown__item-icon`}>{prefixIcon}</div> : null}
        {children}
      </li>
    </>
  );
});

DropdownItem.displayName = 'DropdownItem';
DropdownItem.defaultProps = dropdownItemDefaultProps;

export default DropdownItem;
