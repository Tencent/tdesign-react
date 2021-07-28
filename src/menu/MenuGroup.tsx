import React from 'react';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import { TNode } from '../_type/common';
import { TdMenuGroupProps } from '../_type/components/menu';
import useConfig from '../_util/useConfig';

export interface MenuGroupProps extends TdMenuGroupProps, StyledProps {
  children?: TNode;
}

const MenuGroup = ({ title, children }: MenuGroupProps) => {
  const { classPrefix } = useConfig();

  return (
    <div className={classNames(`${classPrefix}-menu-group`)}>
      <div className={classNames(`${classPrefix}-menu-group-title`)}>{title}</div>
      {children}
    </div>
  );
};

export default MenuGroup;
