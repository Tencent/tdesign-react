import React from 'react';
import { render } from '@test/utils';

function ImageOverlay() {
  return <div className='custom-preview-node'>预览</div>
}

export function getOverlayImageMount(Image, props, events) {
  return render(
    <Image
      src='https://tdesign.gtimg.com/demo/demo-image-1.png'
      overlayContent={<ImageOverlay />}
      {...props}
      {...events}
    ></Image>
  );
}
