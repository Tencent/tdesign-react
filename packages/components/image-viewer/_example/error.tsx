import React from 'react';
import { ImageViewer, Space } from 'tdesign-react';

const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const images = [
    img,
    'https://tdesign.gtimg.com/demo/demo-image-error1.png',
    'https://tdesign.gtimg.com/demo/demo-image-error2.png',
    'https://tdesign.gtimg.com/demo/demo-image-error3.png',
  ];

  return (
    <Space>
      {images.map((imgSrc, index) => (
        <div
          key={imgSrc}
          style={{
            width: 160,
            height: 160,
            border: '4px solid var(--td-bg-color-secondarycontainer)',
            borderRadius: 'var(--td-radius-medium)',
          }}
        >
          <ImageViewer key={imgSrc} images={images} defaultIndex={index} zIndex={10000} />
        </div>
      ))}
    </Space>
  );
}
