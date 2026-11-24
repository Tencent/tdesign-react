import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import './style/index.less';
import Base from './base';
import MinMax from './min-max';
import Status from './status';
import Theme from './theme';
import Size from './size';

export default function StepperDemo() {
  return (
    <div className="tdesign-mobile-demo stepper-container">
      <TDemoHeader title="Stepper 步进器" summary="用于数量的增减。" />
      <TDemoBlock title="01 组件类型" summary="基础步进器">
        <Base />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="最大最小状态">
        <MinMax />
      </TDemoBlock>
      <TDemoBlock summary="禁用状态">
        <Status />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="步进器样式">
        <Theme />
      </TDemoBlock>
      <TDemoBlock summary="步进器尺寸">
        <Size />
      </TDemoBlock>
    </div>
  );
}
