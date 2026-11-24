import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import DescDemo from './desc';
import BorderedDemo from './bordered';
import BadgeDemo from './badge';
import ScrollDemo from './scroll';
import IconDemo from './icon';
import MultipleDemo from './multiple';
import CardDemo from './card';

import './style/index.less';

export default function GridDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Grid 宫格"
        summary="用于功能入口布局，将页面或特定区域切分成若干等大的区块，形成若干功能入口。"
      />
      <TDemoBlock title="01 组件类型" summary="基础宫格">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="带说明的宫格">
        <DescDemo />
      </TDemoBlock>
      <TDemoBlock summary="带边框宫格">
        <BorderedDemo />
      </TDemoBlock>
      <TDemoBlock summary="带徽标宫格">
        <BadgeDemo />
      </TDemoBlock>
      <TDemoBlock summary="可滑动宫格">
        <ScrollDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="可传图标的宫格">
        <IconDemo />
      </TDemoBlock>
      <TDemoBlock summary="通栏宫格">
        <MultipleDemo />
      </TDemoBlock>
      <TDemoBlock summary="卡片宫格">
        <CardDemo />
      </TDemoBlock>
    </div>
  );
}
