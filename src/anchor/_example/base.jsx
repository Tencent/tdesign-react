import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';

export default function AnchorBase() {
  return (
    <>
      <div style={{ height: '50px', width: '50px', border: '1px solid' }}></div>
      <div id="/components/anchor/#default">
        <Anchor bounds={50}>
          <AnchorItem href="/#/components/anchor/#default" title="定义" />
          <AnchorItem href="/#/components/anchor/#multiple" title="服务功能" />
        </Anchor>
      </div>
    </>
  );
}
