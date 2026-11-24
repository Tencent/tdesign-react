import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import './style/index.less';

import BaseDemo from './base';
import OffsetTopDemo from './offset';
import ContainerDemo from './container';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Sticky 吸顶容器" summary="用于常驻页面顶部的信息、操作展示。" />
      <div className="tdesign-demo-block-wrap">
        <TDemoBlock title="01 组件类型" summary="基础吸顶">
          <BaseDemo />
        </TDemoBlock>
        <TDemoBlock summary="吸顶距离">
          <OffsetTopDemo />
        </TDemoBlock>
        <TDemoBlock summary="指定容器">
          <ContainerDemo />
        </TDemoBlock>
      </div>
    </div>
  );
}
