import React from 'react';
import { Avatar, Space } from 'tdesign-react';

export default function SizeAvatar() {
  return (
    <Space direction="vertical" size="large">
      <Space align="center">
        <Avatar size="small" style={{ marginRight: '40px' }}>
          W
        </Avatar>
        <Avatar size="medium" style={{ marginRight: '40px' }}>
          W
        </Avatar>
        <Avatar size="large" style={{ marginRight: '40px' }}>
          W
        </Avatar>
        <Avatar size="100px" style={{ marginRight: '40px' }}>
          W
        </Avatar>
      </Space>
      <Space align="center">
        <Avatar shape="round" size="small" style={{ marginRight: '40px' }}>
          W
        </Avatar>
        <Avatar shape="round" size="medium" style={{ marginRight: '40px' }}>
          W
        </Avatar>
        <Avatar shape="round" size="large" style={{ marginRight: '40px' }}>
          W
        </Avatar>
        <Avatar shape="round" size="100px" style={{ marginRight: '40px' }}>
          W
        </Avatar>
      </Space>
    </Space>
  );
}
