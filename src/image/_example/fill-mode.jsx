import React from 'react';
import { Image, Space } from 'tdesign-react';

export default function FillModeImage() {
  return (
    <Space>
      {
        ['fill', 'contain', 'cover', 'none', 'scale-down'].map(item => (
          <Space direction="vertical" align="center" key={item}>
            <Image
              src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
              fit={item}
              style={{width: 140, height: 86}}
            />
            {item}
          </Space>
        ))
      }
    </Space>
  );
}
