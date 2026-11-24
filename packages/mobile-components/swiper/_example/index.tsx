import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import './style/index.less';
import BaseDemo from './base';
import CustomDemo from './custom';
import FractionDemo from './fraction';
import ControlDemo from './control';
import OutsideDemo from './outside';
import VerticalDemo from './vertical';
import AnimationDemo from './animation';
import CardDemo from './card';
import CurrentDemo from './current';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Swiper 轮播图"
        summary="用于循环轮播一组图片或内容，也可以滑动进行切换，轮播动效时间可以设置。"
      />
      <TDemoBlock title="01 组件类型" summary="点状（dots）">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="点条状（dots-bar）">
        <CustomDemo />
      </TDemoBlock>
      <TDemoBlock summary="分式（fraction）">
        <FractionDemo />
      </TDemoBlock>
      <TDemoBlock summary="切换按钮（controls）">
        <ControlDemo />
      </TDemoBlock>
      <TDemoBlock summary="手动跳转(current)">
        <CurrentDemo />
      </TDemoBlock>
      <TDemoBlock summary="卡片式（cards）">
        <CardDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="指示器位置">
        <BaseDemo />
        <OutsideDemo />
        <VerticalDemo />
      </TDemoBlock>
      <TDemoBlock title="03 组件动效" summary="调整动效参数">
        <AnimationDemo />
      </TDemoBlock>
    </div>
  );
}
