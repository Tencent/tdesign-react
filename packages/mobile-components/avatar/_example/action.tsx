import React from 'react';
import { Avatar, AvatarGroup } from 'tdesign-mobile-react';
import { UserAddIcon } from 'tdesign-icons-react';

export default function ActionAvatar() {
  const imageList = [
    'https://tdesign.gtimg.com/mobile/demos/avatar1.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar2.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar3.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar4.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar5.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar1.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar2.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar3.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar4.png',
    'https://tdesign.gtimg.com/mobile/demos/avatar5.png',
  ];
  return (
    <div className="avatar-group-demo">
      <AvatarGroup max={5} collapseAvatar={<UserAddIcon style={{ fontSize: '24px' }} />}>
        {imageList.map((url, index) => (
          <Avatar key={`action-${index}`} shape="circle" image={url} />
        ))}
      </AvatarGroup>
    </div>
  );
}
