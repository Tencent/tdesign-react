import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';

import ActionDemo from './action';
import BaseDemo from './base';
import ColorDemo from './color';
import CountDemo from './count';
import CustomDemo from './custom';
import PlacementDemo from './placement';
import ShowTextDemo from './show-text';
import SizeDemo from './size';
import SpecialDemo from './special';

import './style/index.less';

export default function RateDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Rate 评分" summary="用于对某行为/事物进行打分。" />

      <TDemoBlock title="01 组件类型" summary="实心评分">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock title="" summary="自定义评分">
        <CustomDemo />
      </TDemoBlock>
      <TDemoBlock title="" summary="自定义数量评分">
        <CountDemo />
      </TDemoBlock>
      <TDemoBlock title="" summary="带描述评分">
        <ShowTextDemo />
      </TDemoBlock>
      <TDemoBlock title="" summary="评分弹框位置">
        <PlacementDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="只可选全星时">
        <ActionDemo allowHalf={false} />
      </TDemoBlock>
      <TDemoBlock title="" summary="可选半星时">
        <ActionDemo allowHalf={true} />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="评分大小">
        <SizeDemo />
      </TDemoBlock>
      <TDemoBlock title="" summary="设置评分颜色">
        <ColorDemo />
      </TDemoBlock>
      <TDemoBlock title="04 特殊样式" summary="竖向带描述评分">
        <SpecialDemo />
      </TDemoBlock>

      <TDemoBlock />
    </div>
  );
}
