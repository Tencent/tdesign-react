import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import Base from './base';
import Placement from './placement';
import Action from './action';
import Accordion from './accordion';
import Card from './card';

export default function CheckboxDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Collapse 折叠面板" summary="可以折叠/展开的内容区域。" />

      <TDemoBlock title="01 组件类型" summary="基础折叠面板">
        <Base />
      </TDemoBlock>

      <TDemoBlock summary="向上展开">
        <Placement />
      </TDemoBlock>

      <TDemoBlock summary="带操作说明">
        <Action />
      </TDemoBlock>

      <TDemoBlock summary="手风琴式">
        <Accordion />
      </TDemoBlock>

      <TDemoBlock title="02 组件样式" summary="卡片折叠面板">
        <Card />
      </TDemoBlock>
    </div>
  );
}
