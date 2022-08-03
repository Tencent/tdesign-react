import React from 'react';
import { Image, Tag } from 'tdesign-react';

export default function AlbumCoverImage() {
  const label = (
    <Tag shape="mark" theme="warning" style={{marginTop: 15}}>标签一</Tag>
  );

  return (
    <Image
      src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
      style={{width: 240, height: 160}}
      gallery
      overlayContent={label}
    />
  );
}
