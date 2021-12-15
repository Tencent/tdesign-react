import React from 'react';
import { Avatar } from 'tdesign-react';

export default function SizeAvatar() {
  return (
    <div className="demo-avatar">
      <div className="demo-avatar-block" style={{ marginBottom: '40px' }}>
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
      </div>
      <div className="demo-avatar-block">
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
      </div>
    </div>
  );
}
