import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import LineDemo from './line';
import PlumpDemo from './plump';
import CircleDemo from './circle';

import './style/index.less';

export default function ProgressDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Progress 进度条" summary="用于展示任务当前的进度。" />
      <TDemoBlock title="01 组件类型" summary="线性进度条">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="线性进度条">
        <LineDemo />
      </TDemoBlock>
      <TDemoBlock summary="百分比内显进度条">
        <PlumpDemo />
      </TDemoBlock>
      <TDemoBlock summary="环形进度条">
        <CircleDemo />
      </TDemoBlock>
    </div>
  );
}
