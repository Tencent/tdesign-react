import React, { useState } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { DropdownOption, TdDropdownProps } from './type';
import { StyledProps } from '../common';
import Popup, { PopupVisibleChangeContext } from '../popup';
import DropdownMenu from './DropdownMenu';
import DropdownItem from './DropdownItem';
import { dropdownDefaultProps } from './defaultProps';
import useConfig from '../hooks/useConfig';
import useDropdownOptions from './hooks/useDropdownOptions';
import useDefaultProps from '../hooks/useDefaultProps';

export interface DropdownProps extends TdDropdownProps, StyledProps {
  children?: React.ReactNode;
}

interface CompoundedComponent {
  DropdownItem: typeof DropdownItem;
  DropdownMenu: typeof DropdownMenu;
}

const Dropdown: React.FC<DropdownProps> & CompoundedComponent = (originalProps) => {
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
    onClick,
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
    onClick?.(data, context);
  };

  const handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
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
Dropdown.DropdownMenu = DropdownMenu;

Dropdown.displayName = 'Dropdown';

export default Dropdown;
