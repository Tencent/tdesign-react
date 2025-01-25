import React from 'react';
import { Avatar, Space } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

const { Group: AvatarGroup } = Avatar;

export default function GroupAvatar() {
  return (
    <Space direction="vertical">
      <AvatarGroup>
        <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
        <Avatar>W</Avatar>
        <Avatar icon={<UserIcon />}></Avatar>
      </AvatarGroup>

      <AvatarGroup size="large">
        <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
        <Avatar>W</Avatar>
        <Avatar icon={<UserIcon />}></Avatar>
      </AvatarGroup>
    </Space>
  );
}
