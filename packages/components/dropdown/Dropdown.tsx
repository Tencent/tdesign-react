import React, { isValidElement, useState } from 'react';
import classNames from 'classnames';
import { omit } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import Popup from '../popup';
import { dropdownDefaultProps } from './defaultProps';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import useDropdownOptions from './hooks/useDropdownOptions';

import type { StyledProps } from '../common';
import type { PopupVisibleChangeContext } from '../popup';
import type { DropdownOption, TdDropdownProps } from './type';

export interface DropdownProps extends TdDropdownProps, StyledProps {
  children?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> & {
  DropdownItem: typeof DropdownItem;
  DropdownMenu: typeof DropdownMenu;
} = (originalProps) => {
  const props = useDefaultProps<DropdownProps>(originalProps, dropdownDefaultProps);
  const {
    popupProps = {},
    disabled,
    placement,
    trigger,
    className,
    children,
    hideAfterItemClick,
    options: propsOptions,
    style,
  } = props;

  const arrayChildren = React.Children.toArray(children);
  const { classPrefix } = useConfig();
  const [isPopupVisible, togglePopupVisible] = useState(false);
  const dropdownClass = `${classPrefix}-dropdown`;

  const options = useDropdownOptions(arrayChildren, propsOptions);

  const handleMenuClick = (data: DropdownOption, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
    if (hideAfterItemClick) {
      togglePopupVisible(false);
      popupProps?.onVisibleChange?.(false, context);
    }
    props.onClick?.(data, context);
  };

  const handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    if (disabled || !options.length) return;
    togglePopupVisible(visible);
    popupProps?.onVisibleChange?.(visible, context);
  };

  const renderContent = <DropdownMenu {...props} options={options} onClick={handleMenuClick} />;

  const popupParams = {
    disabled,
    placement,
    trigger,
    showArrow: false,
    content: renderContent,
    ...omit(popupProps, 'onVisibleChange'),
    overlayInnerClassName: classNames(dropdownClass, className, popupProps?.overlayInnerClassName),
    overlayInnerStyle: style,
  };

  const child = arrayChildren?.[0];
  const dropDownTrigger = isValidElement(child)
    ? React.cloneElement(child as React.ReactElement<{ disabled: boolean }>, { disabled })
    : child;

  return (
    <Popup
      expandAnimation={true}
      destroyOnClose={true}
      visible={isPopupVisible}
      onVisibleChange={handleVisibleChange}
      {...popupParams}
    >
      {dropDownTrigger}
    </Popup>
  );
};

Dropdown.DropdownItem = DropdownItem;
Dropdown.DropdownMenu = DropdownMenu;

Dropdown.displayName = 'Dropdown';

export default Dropdown;
