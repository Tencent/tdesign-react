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
    <Space size={24}>
      <BackTop style={style} visibleHeight={0} offset={['24px', '500px']} container={() => document}>
        <span className="custom-node">返回</span>
      </BackTop>
      <BackTop
        style={style}
        visibleHeight={0}
        default={<span>TOP</span>}
        offset={['124px', '500px']}
        container={() => document}
      />
      <BackTop
        style={style}
        visibleHeight={0}
        content={<span>UP</span>}
        offset={['224px', '500px']}
        container={() => document}
      />
    </Space>
  );
}
