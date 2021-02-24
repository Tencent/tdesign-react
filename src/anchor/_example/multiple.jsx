import React from 'react';
import { Anchor, AnchorLink } from '@tencent/tdesign-react';
export default function AnchorLevel() {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <h4 id="leveln">多级锚点</h4>{' '}
        <Anchor>
          <AnchorLink href="/#/components/anchor/#default" title="默认" />
          <AnchorLink href="/#/components/anchor/#leveln" title="多级锚点" />
          <AnchorLink href="/#/components/anchor/#size" title="尺寸大小">
            <AnchorLink href="/#/components/anchor/#size-d" title="尺寸-默认" />
            <AnchorLink href="/#/components/anchor/#size-l" title="尺寸-大" />
            <AnchorLink href="/#/components/anchor/#size-s" title="尺寸-小" />
          </AnchorLink>
        </Anchor>
      </div>
    </>
  );
}
