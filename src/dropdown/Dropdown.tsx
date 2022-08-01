import React, { useState } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { DropdownOption, TdDropdownProps } from './type';
import { ClassName } from '../common';
import useConfig from '../hooks/useConfig';
import Popup, { PopupVisibleChangeContext } from '../popup';
import DropdownMenu from './DropdownMenu';
import DropdownItem from './DropdownItem';
import { dropdownDefaultProps } from './defaultProps';

export interface DropdownProps extends TdDropdownProps {
  className?: ClassName;
  children?: React.ReactNode;
}

const Dropdown = (props: DropdownProps) => {
  const { popupProps = {}, disabled, placement, trigger, className, children, hideAfterItemClick } = props;
  let content = null;
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

  const DropdownContent = () => <DropdownMenu {...props} onClick={handleMenuClick}></DropdownMenu>;

  const handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    togglePopupVisible(visible);
    popupProps?.onVisibleChange?.(visible, context);
  };

  React.Children.forEach(arrayChildren, (child: React.ReactChild, idx) => {
    if (typeof child !== 'object') return;

    if (child.type === DropdownMenu) {
      content = React.cloneElement(child, { onClick: handleMenuClick });
      arrayChildren.splice(idx, 1);
    }
  });

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
      {arrayChildren}
    </Popup>
  );
};

Dropdown.DropdownMenu = DropdownMenu;
Dropdown.DropdownItem = DropdownItem;

Dropdown.displayName = 'Dropdown';
Dropdown.defaultProps = dropdownDefaultProps;

export default Dropdown;
