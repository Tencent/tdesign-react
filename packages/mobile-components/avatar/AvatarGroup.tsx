import type { MouseEvent } from 'react';
import React from 'react';
import cls from 'classnames';
import Avatar from './Avatar';
import { AvatarGroupContextProvider } from './AvatarGroupContext';
import parseTNode from '../_util/parseTNode';
import { isValidSize } from '../_common/js/avatar/utils';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { avatarGroupDefaultProps } from './defaultProps';
import type { TdAvatarGroupProps } from './type';
import type { StyledProps } from '../common';

export interface AvatarGroupProps extends TdAvatarGroupProps, StyledProps {
  children?: React.ReactNode;
}

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as React.ReactElement<AvatarGroupProps>[];
}

const AvatarGroup = (props: AvatarGroupProps) => {
  const { cascading, children, size, shape, max, collapseAvatar, onCollapsedItemClick } = useDefaultProps(
    props,
    avatarGroupDefaultProps,
  );
  const rootClassName = usePrefixClass('avatar-group');

  const direction = cascading ? cascading.split('-')[0] : 'right';
  const isCustomSize = !isValidSize(size);

  const avatarGroupClasses = cls(
    rootClassName,
    `${rootClassName}-offset-${direction}`,
    `${rootClassName}-offset-${direction}-${isCustomSize ? 'medium' : size}`,
  );

  const handleCollapsedItemClick = (e: MouseEvent<HTMLSpanElement>) => {
    onCollapsedItemClick?.({ e });
  };

  const renderAvatar = () => {
    const validChildren = getValidChildren(children);
    if (validChildren.length <= max) {
      return validChildren;
    }
    const showAvatarList = validChildren.slice(0, max);
    const renderCollapseAvatar = () => parseTNode(collapseAvatar);
    showAvatarList.push(
      <div
        key="avatar-group-extension"
        className={`${rootClassName}__collapse--default`}
        onClick={handleCollapsedItemClick}
      >
        <Avatar size={showAvatarList[0].props.size || size} shape={shape}>
          {renderCollapseAvatar() || `+${validChildren.length - max}`}
        </Avatar>
      </div>,
    );
    return showAvatarList;
  };

  return (
    <div className={avatarGroupClasses}>
      <AvatarGroupContextProvider size={size} shape={shape}>
        {renderAvatar()}
      </AvatarGroupContextProvider>
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
