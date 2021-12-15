import React from 'react';
import { Avatar } from 'tdesign-react';

export default function ShapeAvatar() {
  return (
    <div className="demo-avatar">
      <Avatar style={{ marginRight: '40px' }}>W</Avatar>
      <Avatar shape="round" style={{ marginRight: '40px' }}>
        W
      </Avatar>
    </div>
  );
}
