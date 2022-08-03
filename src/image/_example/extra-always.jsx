import React from 'react';
import { Image, Space, Button } from 'tdesign-react';
import { DiscountIcon } from 'tdesign-icons-react';

export default function ExtraAlwaysImage() {
  const mask = (
    <div
      style={{
        background: 'rgba(0,0,0,.4)',
        color: '#fff',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      已添加
    </div>
  );

  const button = (
    <Button shape="circle" icon={<DiscountIcon />} style={{marginLeft: 190, marginTop: 15}} />
  )

  return (
    <Space size={100}>
      <Space direction="vertical">
        有遮罩
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          style={{width: 240, height: 160}}
          overlayContent={mask}
        />
      </Space>
      <Space direction="vertical">
        无遮罩
        <Image
          src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
          style={{width: 240, height: 160}}
          overlayContent={button}
        />
      </Space>
    </Space>
  );
}
