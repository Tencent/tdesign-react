import React, { useRef } from 'react';
import classNames from 'classnames';
import { DropdownOption, TdDropdownProps } from './type';
import { ClassName } from '../common';
import useConfig from '../_util/useConfig';
import Popup from '../popup';
import DropdownMenu from './DropdownMenu';

export interface DropdownProps extends TdDropdownProps {
  className?: ClassName;
  children?: React.ReactNode;
}

const Dropdown = (props: DropdownProps) => {
  const {
    popupProps = {},
    disabled,
    placement = 'bottom-left',
    trigger = 'hover',
    className = '',
    children,
    hideAfterItemClick = true,
  } = props;
  const { classPrefix } = useConfig();
  const dropdownClass = `${classPrefix}-dropdown`;
  const popupRef = useRef(null);
  const handleMenuClick = (data: DropdownOption, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
    if (hideAfterItemClick) {
      popupRef.current.setVisible(false);
    }
    props.onClick?.(data, context);
  };
  const DropdownContent = () => <DropdownMenu {...props} onClick={handleMenuClick}></DropdownMenu>;

  const popupParams = {
    disabled,
    placement,
    trigger,
    showArrow: false,
    overlayClassName: classNames(dropdownClass, className),
    content: DropdownContent(),
    ...popupProps,
  };

  return (
    <Popup ref={popupRef} expandAnimation={true} destroyOnClose={true} {...popupParams}>
      {children}
    </Popup>
  );
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
