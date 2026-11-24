import cx from 'classnames';
import React, { ComponentProps, forwardRef, useImperativeHandle, useState } from 'react';
import { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { dropdownMenuDefaultProps } from './defaultProps';
import DropdownItem from './DropdownItem';
import DropdownMenuContext from './DropdownMenuContext';
import type { TdDropdownMenuProps } from './type';

export interface DropdownMenuProps extends TdDropdownMenuProps, StyledProps {
  children?: React.ReactNode;
}

type DropdownMenuRef = {
  collapseMenu: () => void;
};

const DropdownMenu = forwardRef<DropdownMenuRef, DropdownMenuProps>((props, ref) => {
  const { className, style, direction, zIndex, closeOnClickOverlay, showOverlay, duration } =
    useDefaultProps<DropdownMenuProps>(props, dropdownMenuDefaultProps);

  const dropdownMenuClass = usePrefixClass('dropdown-menu');

  const items = [];
  React.Children.forEach(props.children, (child: any) => {
    if (
      React.isValidElement<ComponentProps<typeof DropdownItem>>(child) &&
      (child.type as any)?.displayName === DropdownItem.displayName
    ) {
      items.push(child);
    }
  });

  const [activedId, setActivedId] = useState('');

  useImperativeHandle(ref, () => ({
    collapseMenu: () => {
      setActivedId('');
    },
  }));

  return (
    <DropdownMenuContext.Provider
      value={{
        direction,
        zIndex,
        closeOnClickOverlay,
        showOverlay,
        duration,
        activedId,
        onChangeActivedId: setActivedId,
      }}
    >
      <div className={cx(dropdownMenuClass, className)} style={style}>
        {items}
      </div>
    </DropdownMenuContext.Provider>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
