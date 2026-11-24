import React from 'react';
import { Avatar, AvatarGroup } from 'tdesign-mobile-react';

export default function ExhibitionAvatar() {
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
      <AvatarGroup cascading="left-up" max={5}>
        {imageList.map((url, index) => (
          <Avatar key={`exhibition-${index}`} shape="circle" image={url} />
        ))}
      </AvatarGroup>
    </div>
  );
}
