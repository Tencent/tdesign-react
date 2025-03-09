import React from 'react';
import { Anchor } from 'tdesign-react';

const { AnchorItem } = Anchor;

export default function AnchorMultiple() {
  return (
    <>
      <Anchor bounds={100} targetOffset={50}>
        <AnchorItem href="#基础锚点" title="基础锚点" />
        <AnchorItem href="#多级锚点" title="多级锚点" />
        <AnchorItem href="#指定容器锚点" title="指定容器锚点" />
        <AnchorItem href="#特定交互锚点" title="特定交互锚点" />
        <AnchorItem href="#尺寸" title="尺寸">
          <AnchorItem href="#size" title="size-medium"></AnchorItem>
          <AnchorItem href="#size-large" title="size-large"></AnchorItem>
        </AnchorItem>
      </Anchor>
    </>
  );
}
