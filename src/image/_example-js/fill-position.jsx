import React from 'react';
import { Image, Space } from 'tdesign-react';

export default function FillPositionImage() {
  return (<Space direction="vertical" style={{ width: '100%' }}>
    <Space breakLine>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          position="center"
          style={{width: 120, height: 120}}
        />
        cover center
      </Space>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          style={{width: 120, height: 120}}
          position="left"
        />
        cover left
      </Space>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          style={{width: 120, height: 120}}
          position="right"
        />
        cover right
      </Space>
    </Space>
    <Space style={{marginTop: 20}} breakLine>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          style={{width: 280, height: 120}}
          position="top"
        />
        cover top
      </Space>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          style={{width: 280, height: 120}}
          position="bottom"
        />
        cover bottom
      </Space>
    </Space>
    <Space style={{marginTop: 20}} breakLine>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          style={{width: 120, height: 200}}
          position="top"
        />
        contain top
      </Space>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          style={{width: 120, height: 200}}
          position="bottom"
        />
        contain bottom
      </Space>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          style={{width: 120, height: 200}}
          position="center"
        />
        contain center
      </Space>
      <Space style={{marginTop: 20}} breakLine>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          style={{width: 280, height: 120}}
          position="left"
        />
        contain left
      </Space>
      <Space direction="vertical" align="left">
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          style={{width: 280, height: 120}}
          position="right"
        />
        contain right
      </Space>
    </Space>
    </Space>
  </Space>);
}
