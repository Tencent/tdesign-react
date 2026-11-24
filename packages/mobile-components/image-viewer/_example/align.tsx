import React, { useState } from 'react';
import { ImageViewer, Button, type ImageInfo } from 'tdesign-mobile-react';

const images: ImageInfo[] = [
  {
    url: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
    align: 'start',
  },
  {
    url: 'https://tdesign.gtimg.com/mobile/demos/swiper2.png',
    align: 'end',
  },
  {
    url: 'https://tdesign.gtimg.com/mobile/demos/swiper2.png',
    align: 'center',
  },
];

export default function AlignDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="image-example">
      <Button block size="large" variant="outline" theme="primary" onClick={() => setVisible(true)}>
        基础图片预览 + 对齐方式
      </Button>

      <ImageViewer images={images} visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
}
