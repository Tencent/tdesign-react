import React from 'react';
import { Avatar, Space } from 'tdesign-react';

export default function ShapeAvatar() {
  return (
    <Space>
      <Avatar style={{ marginRight: '40px' }}>W</Avatar>
      <Avatar shape="round" style={{ marginRight: '40px' }}>
        W
      </Avatar>
    </Space>
  );
}
