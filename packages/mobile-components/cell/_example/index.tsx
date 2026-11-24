import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import './style/index.less';

import Single from './single';
import Multiple from './multiple';
import Group from './group';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Cell 单元格" summary="用于各个类别行的信息展示。" />
      <TDemoBlock title="01 组件类型" summary="单行单元格">
        <Single />
      </TDemoBlock>
      <TDemoBlock summary="多行单元格">
        <Multiple />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="卡片单元格">
        <Group />
      </TDemoBlock>
    </div>
  );
}
