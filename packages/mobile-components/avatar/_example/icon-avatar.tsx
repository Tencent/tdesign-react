import React from 'react';
import { Avatar } from 'tdesign-mobile-react';
import { UserIcon } from 'tdesign-icons-react';

export default function IconAvatar() {
  return (
    <div className="avatar-demo">
      <Avatar className="avatar-example" icon={<UserIcon />} />
      <Avatar className="avatar-example" shape="round" icon={<UserIcon />} />
    </div>
  );
}
