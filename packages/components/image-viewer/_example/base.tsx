import React from 'react';
import { ImageViewer, Space } from 'tdesign-react';

const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  return (
    <Space
      breakLine
      size={16}
      style={{
        width: 160,
        height: 160,
        border: '4px solid var(--td-bg-color-secondarycontainer)',
        borderRadius: 'var(--td-radius-medium)',
      }}
    >
      <ImageViewer images={[img]} zIndex={10000} />
    </Space>
  );
}
