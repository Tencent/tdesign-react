import React, { useState } from 'react';
import { ImageViewer, Button } from 'tdesign-mobile-react';

const images = [
  'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
  'https://tdesign.gtimg.com/mobile/demos/swiper2.png',
];

export default function OperationDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="image-example">
      <Button block size="large" variant="outline" theme="primary" onClick={() => setVisible(true)}>
        带操作图片预览
      </Button>

      <ImageViewer
        images={images}
        visible={visible}
        showIndex={true}
        deleteBtn={true}
        onClose={() => setVisible(false)}
      />
    </div>
  );
}
