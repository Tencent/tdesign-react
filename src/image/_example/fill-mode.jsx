import React from 'react';
import { Image, Space } from 'tdesign-react';

export default function FillModeImage() {
  return (
    <Space breakLine size={16}>
      {
        ['fill', 'contain', 'cover', 'none', 'scale-down'].map(item => (
          <Space direction="vertical" align="left" key={item}>
            <Image
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              fit={item}
              style={{width: 130, height: 130}}
            />
            {item}
          </Space>
        ))
      }
    </Space>
  );
}
