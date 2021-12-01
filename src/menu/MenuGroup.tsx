import React from 'react';
import classNames from 'classnames';
import { StyledProps , TNode } from '../common';
import { TdMenuGroupProps } from './type';
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
