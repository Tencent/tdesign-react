import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';
export default function AnchorLevel() {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <h4 id="leveln">多级锚点</h4>{' '}
        <Anchor>
          <AnchorItem href="/#/components/anchor/#default" title="默认" />
          <AnchorItem href="/#/components/anchor/#leveln" title="多级锚点" />
          <AnchorItem href="/#/components/anchor/#size" title="尺寸大小">
            <AnchorItem href="/#/components/anchor/#size-d" title="尺寸-默认" />
            <AnchorItem href="/#/components/anchor/#size-l" title="尺寸-大" />
            <AnchorItem href="/#/components/anchor/#size-s" title="尺寸-小" />
          </AnchorItem>
        </Anchor>
      </div>
    </>
  );
}
