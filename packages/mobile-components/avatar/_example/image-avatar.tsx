import React from 'react';
import { Avatar } from 'tdesign-mobile-react';

export default function ImageAvatar() {
  return (
    <div className="avatar-demo">
      <Avatar className="avatar-example" image="https://tdesign.gtimg.com/mobile/demos/avatar1.png" />
      <Avatar className="avatar-example" image="https://tdesign.gtimg.com/mobile/demos/avatar1.png" shape="round" />
    </div>
  );
}
