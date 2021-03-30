import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';

export default function AnchorSizeLarge() {
  return (
    <div id="/components/anchor/#size-large">
      <Anchor bounds={100} targetOffset={50}>
        <AnchorItem href="/#/components/anchor/#default" title="基础锚点" />
        <AnchorItem href="/#/components/anchor/#multiple" title="多级锚点" />
        <AnchorItem href="/#/components/anchor/#size" title="尺寸大小">
          <AnchorItem href="/#/components/anchor/#size" title="size-medium"></AnchorItem>
          <AnchorItem href="/#/components/anchor/#size-large" title="size-large"></AnchorItem>
        </AnchorItem>
        <AnchorItem href="/#/components/anchor/#attach" title="指定容器" />
      </Anchor>
    </div>
  );
}
