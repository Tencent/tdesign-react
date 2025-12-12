import React from 'react';
import { ImageViewer, Space } from 'tdesign-react';

const imgH = 'https://tdesign.gtimg.com/demo/demo-image-3.png';
const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const images = [img, imgV, imgH];

  return (
    <Space
      breakLine
      size={16}
      style={{
        width: 240,
        height: 240,
        border: '4px solid var(--td-bg-color-secondarycontainer)',
        borderRadius: 'var(--td-radius-medium)',
      }}
    >
      <ImageViewer images={images} title="相册封面标题" zIndex={10000} />
    </Space>
  );
}
