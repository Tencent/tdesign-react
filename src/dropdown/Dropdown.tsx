import React, { useState } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { DropdownOption, TdDropdownProps } from './type';
import { ClassName } from '../common';
import useConfig from '../_util/useConfig';
import Popup, { PopupVisibleChangeContext } from '../popup';
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
  const [isPopupVisible, togglePopupVisible] = useState(false);
  const dropdownClass = `${classPrefix}-dropdown`;

  const handleMenuClick = (data: DropdownOption, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
    if (hideAfterItemClick) {
      togglePopupVisible(false);
    }
    props.onClick?.(data, context);
  };

  const DropdownContent = () => <DropdownMenu {...props} onClick={handleMenuClick}></DropdownMenu>;

  const handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    togglePopupVisible(visible);
    popupProps?.onVisibleChange?.(visible, context);
  };
  const popupParams = {
    disabled,
    placement,
    trigger,
    showArrow: false,
    overlayClassName: classNames(dropdownClass, className),
    content: DropdownContent(),
    ...omit(popupProps, 'onVisibleChange'),
  };

  return (
    <Popup
      expandAnimation={true}
      destroyOnClose={true}
      visible={isPopupVisible}
      onVisibleChange={handleVisibleChange}
      {...popupParams}
    >
      {children}
    </Popup>
  );
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
