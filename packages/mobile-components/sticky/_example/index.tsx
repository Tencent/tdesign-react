import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import BaseDemo from './base';
import ContainerDemo from './container';
import OffsetTopDemo from './offset';

import './style/index.less';

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
