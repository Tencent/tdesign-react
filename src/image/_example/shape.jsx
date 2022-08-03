import React from 'react';
import { Image, Space } from 'tdesign-react';

export default function ShapeImage() {
  return (
    <Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          shape="square"
          style={{width: 240, height: 160}}
        />
        square
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          style={{width: 240, height: 160}}
          shape="round"
        />
        round
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          style={{width: 160, height: 160}}
          shape="circle"
        />
        circle
      </Space>
    </Space>
  );
}
