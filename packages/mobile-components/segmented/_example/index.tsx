import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import BaseSegmented from './base';
import BlockSegmented from './block';
import DisabledSegmented from './disabled';
import './style/index.less';

export default function SegmentedDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Segmented 分段控制器" summary="用于展示多个选项并允许用户选择其中单个选项。" />
      <TDemoBlock title="01 组件类型" summary="基础">
        <BaseSegmented />
      </TDemoBlock>
      <TDemoBlock summary="自适应宽度">
        <BlockSegmented />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="控制器状态">
        <DisabledSegmented />
      </TDemoBlock>
    </div>
  );
}
