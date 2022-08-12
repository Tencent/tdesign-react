import React, { useState } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { DropdownOption, TdDropdownProps } from './type';
import { ClassName } from '../common';
import useConfig from '../hooks/useConfig';
import Popup, { PopupVisibleChangeContext } from '../popup';
import DropdownSub from './DropdownSub';
import DropdownSubmenu from './DropdownSubmenu';
import DropdownItem from './DropdownItem';
import { dropdownDefaultProps } from './defaultProps';

export interface DropdownProps extends TdDropdownProps {
  className?: ClassName;
  children?: React.ReactNode;
}

const Dropdown = (props: DropdownProps) => {
  const { popupProps = {}, disabled, placement, trigger, className, children, hideAfterItemClick } = props;
  const content = null;
  const arrayChildren = React.Children.toArray(children);

  const { classPrefix } = useConfig();
  const [isPopupVisible, togglePopupVisible] = useState(false);
  const dropdownClass = `${classPrefix}-dropdown`;

  const handleMenuClick = (data: DropdownOption, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
    if (hideAfterItemClick) {
      togglePopupVisible(false);
    }
    props?.onClick?.(data, context);
  };

  const DropdownContent = () => <DropdownSub {...props} onClick={handleMenuClick}></DropdownSub>;

  const handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    togglePopupVisible(visible);
    popupProps?.onVisibleChange?.(visible, context);
  };

  const popupParams = {
    disabled,
    placement,
    trigger,
    showArrow: false,
    content: content || DropdownContent(),
    ...omit(popupProps, 'onVisibleChange'),
    overlayClassName: classNames(dropdownClass, className, popupProps?.overlayClassName),
  };

  return (
    <Popup
      expandAnimation={true}
      destroyOnClose={true}
      visible={isPopupVisible}
      onVisibleChange={handleVisibleChange}
      {...popupParams}
    >
      {arrayChildren?.[0]}
    </Popup>
  );
};

Dropdown.DropdownItem = DropdownItem;
Dropdown.DropdownSub = DropdownSub;
Dropdown.DropdownSubmenu = DropdownSubmenu;

Dropdown.displayName = 'Dropdown';
Dropdown.defaultProps = dropdownDefaultProps;

export default Dropdown;
