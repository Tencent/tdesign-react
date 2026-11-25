import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import BadgePropsDemo from './badge-props';
import BaseDemo from './base';
import CustomDemo from './custom';
import PureIconDemo from './pure-icon';
import RoundDemo from './round';
import TextDemo from './text';
import TextSpreadDemo from './text-spread';

import './style/index.less';

function TabBarMobileDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="TabBar 底部标签栏" summary="用于在不同功能模块之间进行快速切换，位于页面底部。"></TDemoHeader>
      <TDemoBlock title="01 组件类型" summary="纯文本标签栏">
        <TextDemo />
      </TDemoBlock>
      <TDemoBlock summary="图标加文本标签栏">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="纯图标标签栏">
        <PureIconDemo />
      </TDemoBlock>
      <TDemoBlock summary="双层级文本标签栏">
        <TextSpreadDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="弱选中标签栏">
        <BadgePropsDemo />
      </TDemoBlock>
      <TDemoBlock summary="悬浮胶囊标签栏">
        <RoundDemo />
      </TDemoBlock>
      <TDemoBlock title="03 自定义" summary="自定义样式">
        <CustomDemo />
      </TDemoBlock>
    </div>
  );
}

export default TabBarMobileDemo;
