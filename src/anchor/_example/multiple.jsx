import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';

export default function AnchorMutiple() {
  return (
    <>
      <div id="/components/anchor/#multiple">
        <Anchor bounds={50}>
          <AnchorItem href="/#/components/anchor/#default" title="定义" />
          <AnchorItem href="/#/components/anchor/#multiple" title="服务功能" />
        </Anchor>
      </div>
    </>
  );
}
