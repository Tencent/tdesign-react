import React, { useEffect, useState } from 'react';
import { Image, Space } from 'tdesign-react';

export default function FillModeImage() {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSrc('https://tdesign.gtimg.com/demo/demo-image-1.png');
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Space breakLine size={16}>
      {
        ['fill', 'contain', 'cover', 'none', 'scale-down'].map(item => (
          <Space direction="vertical" align="left" key={item}>
            <Image
              src={src}
              fit={item}
              // fallback='https://tdesign.gtimg.com/demo/demo-image-1.png'
              style={{width: 120, height: 120}}
            />
            {item}
          </Space>
        ))
      }
    </Space>
  );
}
