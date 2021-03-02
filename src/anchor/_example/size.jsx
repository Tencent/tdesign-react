import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';

export default function Affix() {
  return (
    <div>
      <h4>尺寸大小</h4>
      <Anchor>
        <AnchorItem href="/#/components/anchor/#default" title="默认" />
        <AnchorItem href="/#/components/anchor/#leveln" title="多级锚点" />
        <AnchorItem href="/#/components/anchor/#size" title="尺寸大小"></AnchorItem>
      </Anchor>
    </div>
  );
}
