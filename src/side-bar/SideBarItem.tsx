import React, { forwardRef, memo, useContext, useEffect } from 'react';
import cls from 'classnames';
import type { StyledProps } from '../common';
import type { TdSideBarItemProps } from './type';
import { SideBarContext } from './SideBarContext';
import Badge from '../badge';
import parseTNode from '../_util/parseTNode';
import { sideBarItemDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';

export interface SideBarItemProps extends TdSideBarItemProps, StyledProps {}

const SideBarItem = forwardRef<HTMLDivElement, SideBarItemProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, sideBarItemDefaultProps);
  const { badgeProps, disabled, icon, label, value } = props;
  const { relation, removeRelation, activeValue, onClickItem } = useContext(SideBarContext);

  const sideBarItemClass = usePrefixClass('side-bar-item');

  useEffect(() => {
    relation(props);
    return () => {
      removeRelation(props);
    };
  }, [props, relation, removeRelation]);

  const isActive = activeValue === value;

  const onClick = () => {
    if (!disabled) onClickItem(value, label);
  };

  const isShowBadge = badgeProps?.count || badgeProps?.dot;

  return (
    <div
      ref={ref}
      className={cls(sideBarItemClass, {
        [`${sideBarItemClass}--active`]: isActive,
        [`${sideBarItemClass}--disabled`]: disabled,
      })}
      onClick={onClick}
    >
      {isActive && (
        <div>
          <div className={`${sideBarItemClass}__line`}></div>
          <div className={`${sideBarItemClass}__prefix`}></div>
          <div className={`${sideBarItemClass}__suffix`}></div>
        </div>
      )}
      {icon && <div className={`${sideBarItemClass}__icon`}>{parseTNode(icon)}</div>}
      {isShowBadge ? <Badge content={label} {...badgeProps} /> : <div>{label}</div>}
    </div>
  );
});

SideBarItem.displayName = 'SideBarItem';

export default memo(SideBarItem);
