import React from 'react';
import { Image, Space } from 'tdesign-react';

export default function FillPositionImage() {
  return (<Space direction="vertical" style={{ width: '100%' }}>
    <Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="cover"
          position="center"
          style={{width: 174, height: 125}}
        />
        cover center
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="cover"
          style={{width: 174, height: 125}}
          position="top"
        />
        cover top
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="cover"
          style={{width: 174, height: 125}}
          position="bottom"
        />
        cover bottom
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="cover"
          style={{width: 100, height: 125}}
          position="left"
        />
        cover left
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="cover"
          style={{width: 100, height: 125}}
          position="right"
        />
        cover right
      </Space>
    </Space>
    <Space style={{marginTop: 20}}>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="contain"
          style={{width: 170, height: 230}}
          position="top"
        />
        contain top
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="contain"
          style={{width: 170, height: 230}}
          position="bottom"
        />
        contain bottom
      </Space>
      <Space direction="vertical" align="center">
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          fit="contain"
          style={{width: 414, height: 230}}
          position="left"
        />
        contain left
      </Space>
    </Space>
  </Space>);
}
