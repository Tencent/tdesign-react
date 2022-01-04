import React from 'react';
import { Avatar } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

const { Group: AvatarGroup } = Avatar;

export default function GroupAvatar() {
  return (
    <div className="demo-avatar">
      <div className="demo-avatar-block" style={{ marginBottom: '40px' }}>
        <AvatarGroup>
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>W</Avatar>
          <Avatar icon={<UserIcon />}></Avatar>
        </AvatarGroup>
      </div>
      <div className="demo-avatar-block">
        <AvatarGroup size="large">
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>W</Avatar>
          <Avatar icon={<UserIcon />}></Avatar>
        </AvatarGroup>
      </div>
    </div>
  );
}
