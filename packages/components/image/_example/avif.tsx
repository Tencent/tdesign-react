import React from 'react';
import { Image } from 'tdesign-react';

export default function AvifImage() {
  return (
    <Image
      src="https://tdesign.gtimg.com/img/tdesign-image.avif"
      srcset={{
        'image/avif': 'https://tdesign.gtimg.com/img/tdesign-image.avif',
        'image/webp': 'https://tdesign.gtimg.com/img/tdesign-image.webp',
      }}
      shape="square"
      style={{ maxWidth: '100%' }}
      fit="scale-down"
    />
  );
}
