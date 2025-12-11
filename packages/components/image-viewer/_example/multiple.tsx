import React from 'react';
import { ImageViewer, Space } from 'tdesign-react';

const imgH = 'https://tdesign.gtimg.com/demo/demo-image-3.png';
const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const images = [
    img,
    {
      mainImage: imgH,
      download: true,
      thumbnail: imgH,
    },
    imgV,
  ];

  return (
    <Space breakLine size={16}>
      {images.map((_, index) => (
        <div
          key={index}
          style={{
            width: 160,
            height: 160,
            border: '4px solid var(--td-bg-color-secondarycontainer)',
            borderRadius: 'var(--td-radius-medium)',
          }}
        >
          <ImageViewer images={images} defaultIndex={index} zIndex={10000} />
        </div>
      ))}
    </Space>
  );
}
