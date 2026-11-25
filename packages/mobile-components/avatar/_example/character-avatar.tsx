import React from 'react';
import { Avatar } from 'tdesign-mobile-react';

export default function CharacterAvatar() {
  return (
    <div className="avatar-demo">
      <Avatar className="avatar-example external-class-content" aria-label="字符头像">
        A
      </Avatar>
      <Avatar className="avatar-example external-class-content" shape="round">
        A
      </Avatar>
    </div>
  );
}
