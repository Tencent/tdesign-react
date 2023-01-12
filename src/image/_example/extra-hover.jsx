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
        justifyContent: 'center',
      }}
    >
      预览
    </div>
  );

  return (
    <Image
      src="https://tdesign.gtimg.com/demo/demo-image-1.png"
      style={{width: 284, height: 160}}
      overlayContent={mask}
      overlayTrigger="hover"
    />
  );
}
