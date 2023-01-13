import React from 'react';
import classNames from 'classnames';
import Avatar from './Avatar';
import Popup from '../popup/Popup';
import useConfig from '../hooks/useConfig';
import { AvatarContextProvider } from './AvatarContext';
import { TdAvatarGroupProps } from './type';
import { StyledProps } from '../common';
import { avatarGroupDefaultProps } from './defaultProps';

export interface AvatarGroupProps extends TdAvatarGroupProps, StyledProps {
  children?: React.ReactNode;
}
const AvatarGroup = (props: AvatarGroupProps) => {
  const { classPrefix } = useConfig();
  const preClass = `${classPrefix}-avatar`;
  const { className, cascading, collapseAvatar, max, placement, popupProps, size, children, ...avatarGroupProps } =
    props;

  const childrenList = React.Children.toArray(children);
  let allChildrenList;
  if (childrenList.length > 0) {
    allChildrenList = childrenList.map((child: JSX.Element, index: number) =>
      React.cloneElement(child, { key: `avatar-group-item-${index}`, ...child.props }),
    );
  }
  const groupClass = classNames(`${preClass}-group`, className, {
    [`${preClass}--offset-right`]: cascading === 'right-up',
    [`${preClass}--offset-left`]: cascading === 'left-up',
  });
  const childrenCount = childrenList.length;
  if (max && childrenCount > max) {
    const showList = allChildrenList.slice(0, max);
    const hiddenList = allChildrenList.slice(max, childrenCount);
    // written by sheep： Avatar 内部的 Popup 即将移除，用户可以通过 ReactNode 自己组合 Popup，不需要组件内嵌
    const popupNum = `+${childrenCount - max}`;
    const popupMergeProps = { ...popupProps, placement };
    const popupNodes = popupProps ? (
      <Popup {...popupMergeProps}>
        {collapseAvatar ? (
          <Avatar className={`${preClass}__collapse`} size={size}>
            {collapseAvatar}
          </Avatar>
        ) : (
          <Avatar className={`${preClass}__collapse`} size={size}>
            {popupNum}
          </Avatar>
        )}
      </Popup>
    ) : (
      <Popup key="avatar-popup-key" placement={placement} content={hiddenList} trigger="hover" showArrow>
        {collapseAvatar ? (
          <Avatar className={`${preClass}__collapse`} size={size}>
            {collapseAvatar}
          </Avatar>
        ) : (
          <Avatar className={`${preClass}__collapse`} size={size}>
            {popupNum}
          </Avatar>
        )}
      </Popup>
    );
    showList.push(popupNodes);
    return (
      <AvatarContextProvider size={size}>
        <div className={groupClass}>{showList}</div>
      </AvatarContextProvider>
    );
  }
  return (
    <AvatarContextProvider size={size}>
      <div className={groupClass} {...avatarGroupProps}>
        {allChildrenList}
      </div>
    </AvatarContextProvider>
  );
};

AvatarGroup.displayName = 'AvatarGroup';
AvatarGroup.defaultProps = avatarGroupDefaultProps;

export default AvatarGroup;
