import React from 'react';
import { Avatar } from 'tdesign-react';
import { UserIcon, EllipsisIcon } from 'tdesign-icons-react';

const { Group: AvatarGroup } = Avatar;

export default function GroupMaxAvatar() {
  return (
    <div className="demo-avatar">
      <div className="demo-avatar-block" style={{ marginBottom: '40px' }}>
        <AvatarGroup size="large" max={2}>
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>Avatar</Avatar>
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
        </AvatarGroup>
      </div>
      <div className="demo-avatar-block" style={{ marginBottom: '40px' }}>
        <AvatarGroup size="large" max={2} collapseAvatar={<EllipsisIcon />}>
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>Avatar</Avatar>
          <Avatar icon={<UserIcon />}></Avatar>
        </AvatarGroup>
      </div>
      <div className="demo-avatar-block">
        <AvatarGroup size="large" max={2} collapseAvatar="more">
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>Avatar</Avatar>
          <Avatar icon={<UserIcon />}></Avatar>
        </AvatarGroup>
      </div>
    </div>
  );
}
