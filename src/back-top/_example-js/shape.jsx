// @ts-nocheck
import React from 'react';
import { BackTop, Space } from 'tdesign-react';

export default function BasicBackTop() {
  const style = {
    position: 'relative',
    insetInlineEnd: 0,
    insetBlockEnd: 0,
  };

  return (
    <Space direction="vertical" size={32}>
      <Space size={24}>
        <BackTop style={style} visibleHeight={0} shape="circle" container={() => document} />
        <BackTop style={style} visibleHeight={0} shape="square" container={() => document} />
      </Space>
      <Space size={24}>
        <BackTop style={style} visibleHeight={0} shape="circle" theme="primary" container={() => document} />
        <BackTop style={style} visibleHeight={0} shape="square" theme="primary" container={() => document} />
      </Space>
      <Space size={24}>
        <BackTop style={style} visibleHeight={0} shape="circle" theme="dark" container={() => document} />
        <BackTop style={style} visibleHeight={0} shape="square" theme="dark" container={() => document} />
      </Space>
    </Space>
  );
}
