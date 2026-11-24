import React from 'react';
import { Avatar } from 'tdesign-mobile-react';
import { UserIcon } from 'tdesign-icons-react';

export default function SizeBadge() {
  return (
    <>
      <div className="summary">Large</div>
      <div className="block">
        <Avatar icon={<UserIcon />} size="large" badgeProps={{ count: 8, size: 'large', offset: [7, 7] }} />
      </div>

      <div className="summary">Medium</div>
      <div className="block">
        <Avatar icon={<UserIcon />} badgeProps={{ count: 8, offset: [5, 5] }} />
      </div>
    </>
  );
}
