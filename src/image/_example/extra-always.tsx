import React from 'react';
import { Image, Space, Tag } from 'tdesign-react';
import { PrintIcon } from 'tdesign-icons-react';

export default function ExtraAlwaysImage() {
  const mask = (
    <div
      style={{
        background: 'rgba(0,0,0,.4)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        lineHeight: 22
      }}
    >
      <Tag
        shape="mark"
        theme="warning"
        style={{
          borderRadius: 3,
          background: 'transparent',
          color: '#fff'
        }}
      >
        <PrintIcon size={16} /> 高清
      </Tag>
    </div>
  );

  const button = (
    <Tag
      shape="mark"
      theme="warning"
      style={{
        position: 'absolute',
        right: 8,
        bottom: 8,
        borderRadius: 3,
        background: 'rgba(236,242,254,1)',
        color: 'rgba(0,82,217,1)'
      }}
    >
      <PrintIcon size={16} /> 高清
    </Tag>
  )

  return (
    <Space size={32}>
      <Space direction="vertical">
        <strong style={{fontSize: 20}}>有遮罩</strong>
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          style={{width: 284, height: 160}}
          overlayContent={mask}
        />
      </Space>
      <Space direction="vertical">
        <strong style={{fontSize: 20}}>无遮罩</strong>
        <Image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          style={{width: 284, height: 160}}
          overlayContent={button}
        />
      </Space>
    </Space>
  );
}
