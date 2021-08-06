import React from 'react';
import { Anchor } from '@tencent/tdesign-react';

const { AnchorItem } = Anchor;

export default function AnchorMutiple() {
  return (
    <>
      <div id="multiple">
        <Anchor bounds={100} targetOffset={50}>
          <AnchorItem href="#default" title="基础锚点" />
          <AnchorItem href="#multiple" title="多级锚点" />
          <AnchorItem href="#size" title="尺寸大小">
            <AnchorItem href="#size" title="size-medium"></AnchorItem>
            <AnchorItem href="#size-large" title="size-large"></AnchorItem>
          </AnchorItem>
          <AnchorItem href="#attach" title="指定容器" />
        </Anchor>
      </div>
    </>
  );
}
