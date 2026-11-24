import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseImage from './base';
import PositionImage from './position';
import ShapeImage from './shape';
import StatusImage from './status';

import './style/index.less';

export default function ImageDemo() {
  return (
    <>
      <TDemoHeader title="Image 图片" summary="用于展示效果，主要为上下左右居中裁切、拉伸、平铺等方式。" />
      <TDemoBlock title="01 组件类型" padding={true}>
        <BaseImage />
        <PositionImage />
        <ShapeImage />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态">
        <StatusImage />
      </TDemoBlock>
    </>
  );
}
