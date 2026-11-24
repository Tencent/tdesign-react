import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import BaseDemo from './base';
import RangDemo from './range';
import LabelDemo from './label';
import StepDemo from './step';
import DisabledDemo from './disabled';
import CapsuleDemo from './capsule';
import VerticalDemo from './vertical';
import './style/index.less';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Slider 滑动选择器" summary="用于选择横轴上的数值、区间、档位。" />
      <TDemoBlock title="01 组件类型" summary="单游标滑块">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="双游标滑块">
        <RangDemo />
      </TDemoBlock>
      <TDemoBlock summary="带数值滑动选择器">
        <LabelDemo />
      </TDemoBlock>
      <TDemoBlock summary="带刻度滑动选择器">
        <StepDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="滑块禁用状态">
        <DisabledDemo />
      </TDemoBlock>
      <TDemoBlock title="03 特殊样式" summary="胶囊型滑块">
        <CapsuleDemo />
      </TDemoBlock>
      <TDemoBlock summary="垂直滑块">
        <VerticalDemo />
      </TDemoBlock>
    </div>
  );
}
