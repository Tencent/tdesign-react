import React from 'react';
import { Avatar, Space } from 'tdesign-react';
import { UserIcon, EllipsisIcon } from 'tdesign-icons-react';

const { Group: AvatarGroup } = Avatar;

export default function GroupMaxAvatar() {
  return (
    <Space direction="vertical">
      <AvatarGroup size="large" max={2}>
        <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
        <Avatar>Avatar</Avatar>
        <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
      </AvatarGroup>

      <AvatarGroup size="large" max={2} collapseAvatar={<EllipsisIcon />}>
        <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
        <Avatar>Avatar</Avatar>
        <Avatar icon={<UserIcon />}></Avatar>
      </AvatarGroup>

      <AvatarGroup size="large" max={2} collapseAvatar="more">
        <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
        <Avatar>Avatar</Avatar>
        <Avatar icon={<UserIcon />}></Avatar>
      </AvatarGroup>
    </Space>
  );
}
