import React from 'react';
import { UserIcon } from 'tdesign-icons-react';
import { Avatar } from 'tdesign-mobile-react';

export default function IconAvatar() {
  return (
    <div className="avatar-demo">
      <Avatar className="avatar-example" icon={<UserIcon />} />
      <Avatar className="avatar-example" shape="round" icon={<UserIcon />} />
    </div>
  );
}
