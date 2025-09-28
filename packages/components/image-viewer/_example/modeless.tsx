import React from 'react';
import { ImageViewer, Space } from 'tdesign-react';

const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  return (
    <Space breakLine size={16} style={{ width: 160, height: 160 }}>
      <ImageViewer draggable mode="modeless" title="预览单张图片" images={[img]} />
    </Space>
  );
}
