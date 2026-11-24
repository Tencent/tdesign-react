import React from 'react';
import BaseDemo from './base';
import IconDemo from './icon-demo';
import SuffixIcon from './suffix-icon';
import Event from './event';
import CustomDemo from './custom';
import Customization from './customization';
import ThemeDemo from './theme';
import ScrollDemo from './scrolling';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';

import './style/index.less';

function MobileDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="NoticeBar 公告栏" summary="在导航栏下方，用于给用户显示提示消息。" />
      <TDemoBlock title="01 组件类型" summary="纯文字的公告栏">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="可滚动的公告栏">
        <ScrollDemo />
      </TDemoBlock>
      <TDemoBlock summary="带图标的公告栏">
        <IconDemo />
      </TDemoBlock>
      <TDemoBlock summary="带关闭的公告栏">
        <SuffixIcon />
      </TDemoBlock>
      <TDemoBlock summary="带入口的公告栏">
        <Event />
      </TDemoBlock>
      <TDemoBlock summary="自定义样式的公告栏">
        <CustomDemo />
      </TDemoBlock>
      <TDemoBlock summary="自定义内容的公告栏">
        <Customization />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态">
        <ThemeDemo />
      </TDemoBlock>
    </div>
  );
}

export default MobileDemo;
