import React, { Fragment } from 'react';
import classNames from 'classnames';
import Avatar from './Avatar';
import useConfig from '../hooks/useConfig';
import { AvatarContextProvider } from './AvatarContext';
import { TdAvatarGroupProps } from './type';
import { StyledProps } from '../common';
import { avatarGroupDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';

export interface AvatarGroupProps extends TdAvatarGroupProps, StyledProps {
  children?: React.ReactNode;
}

const AvatarGroup: React.FC<AvatarGroupProps> = (props) => {
  const { classPrefix } = useConfig();
  const preClass = `${classPrefix}-avatar`;
  const { className, cascading, collapseAvatar, max, size, children, ...avatarGroupProps } =
    useDefaultProps<AvatarGroupProps>(props, avatarGroupDefaultProps);

  const childrenList = React.Children.toArray(children);
  let allChildrenList: React.ReactElement[];
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
    const ellipsisAvatar = (
      <Avatar className={`${preClass}__collapse`}>{parseTNode(collapseAvatar) || `+${childrenCount - max}`}</Avatar>
    );
    showList.push(<Fragment key="t-avatar__collapse">{ellipsisAvatar}</Fragment>);
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

export default AvatarGroup;
