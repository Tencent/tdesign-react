import React from 'react';
import { Avatar, Space } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

export default function BasicAvatar() {
  return (
    <Space>
      <Avatar icon={<UserIcon />} style={{ marginRight: '40px' }} />
      <Avatar
        image="https://tdesign.gtimg.com/site/avatar.jpg"
        hideOnLoadFailed="false"
        style={{ marginRight: '40px' }}
      />
      <Avatar style={{ marginRight: '40px' }}>W</Avatar>
    </Space>
  );
}
