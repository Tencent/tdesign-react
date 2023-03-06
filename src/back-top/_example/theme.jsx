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
    <Space direction="vertical">
      <Space>
        <BackTop style={style} visibleHeight={0} container={() => document} />
        <BackTop style={style} visibleHeight={0} theme="primary" container={() => document} />
        <BackTop style={style} visibleHeight={0} theme="dark" container={() => document} />
      </Space>
      <Space>
        <BackTop style={style} shape="circle" visibleHeight={0} container={() => document} />
        <BackTop style={style} shape="circle" visibleHeight={0} theme="primary" container={() => document} />
        <BackTop style={style} shape="circle" visibleHeight={0} theme="dark" container={() => document} />
      </Space>
      <Space>
        <BackTop style={style} size="small" visibleHeight={0} container={() => document} />
        <BackTop style={style} size="small" visibleHeight={0} theme="primary" container={() => document} />
        <BackTop style={style} size="small" visibleHeight={0} theme="dark" container={() => document} />
      </Space>
      <Space>
        <BackTop style={style} shape="circle" size="small" visibleHeight={0} container={() => document} />
        <BackTop
          style={style}
          shape="circle"
          size="small"
          visibleHeight={0}
          theme="primary"
          container={() => document}
        />
        <BackTop style={style} shape="circle" size="small" visibleHeight={0} theme="dark" container={() => document} />
      </Space>
    </Space>
  );
}
