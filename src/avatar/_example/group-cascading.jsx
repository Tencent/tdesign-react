import React from 'react';
import { Avatar } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

const { Group: AvatarGroup } = Avatar;

export default function GroupCascadingAvatar() {
  return (
    <div className="demo-avatar">
      <div className="demo-avatar-block" style={{ marginBottom: '40px' }}>
        <AvatarGroup>
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>W</Avatar>
          <Avatar icon={<UserIcon />}></Avatar>
        </AvatarGroup>
      </div>
      <div className="demo-avatar-block" style={{ marginBottom: '40px' }}>
        <AvatarGroup cascading="left-up">
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>W</Avatar>
          <Avatar icon={<UserIcon />}></Avatar>
        </AvatarGroup>
      </div>
    </div>
  );
}
