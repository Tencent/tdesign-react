import React from 'react';
import { ImageViewer, Space } from 'tdesign-react';

const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const images = [
    {
      mainImage: imgV,
      thumbnail: img,
    },
  ];

  return (
    <Space breakLine size={16}>
      <div
        style={{
          width: 160,
          height: 160,
          border: '4px solid var(--td-bg-color-secondarycontainer)',
          borderRadius: 'var(--td-radius-medium)',
        }}
      >
        <ImageViewer images={images} zIndex={10000} />
      </div>
      <div
        style={{
          width: 160,
          height: 160,
          border: '4px solid var(--td-bg-color-secondarycontainer)',
          borderRadius: 'var(--td-radius-medium)',
        }}
      >
        <ImageViewer images={[images[0].mainImage]} zIndex={10000} />
      </div>
    </Space>
  );
}
