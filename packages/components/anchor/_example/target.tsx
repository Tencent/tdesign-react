import React from 'react';
import { Anchor } from 'tdesign-react';

const { AnchorTarget } = Anchor;

export default function AnchorTargetExample() {
  return (
    <div id="/components/anchor/#anchor-target" className="anchor-demo">
      <AnchorTarget id="/components/anchor/#default" tag="h1">
        基础锚点
      </AnchorTarget>
      <AnchorTarget id="/components/anchor/#multiple" tag="h1">
        多级锚点
      </AnchorTarget>
      <AnchorTarget id="/components/anchor/#size" tag="h1">
        尺寸大小
      </AnchorTarget>
      <AnchorTarget id="/components/anchor/#attach" tag="h1">
        指定容器
      </AnchorTarget>
    </div>
  );
}
