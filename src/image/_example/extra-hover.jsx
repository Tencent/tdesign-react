import React from 'react';
import { Image } from 'tdesign-react';

export default function ExtraHoverImage() {
  const mask = (
    <div
      style={{
        background: 'rgba(0,0,0,.4)',
        color: '#fff',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      预览
    </div>
  );

  return (
    <Image
      src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
      style={{width: 240, height: 160}}
      overlayContent={mask}
      overlayTrigger="hover"
    />
  );
}
