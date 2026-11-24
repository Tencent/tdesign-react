import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import ThemeDemo from './theme';

import './style/index.less';

export default function DividerDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Divider 分割线" summary="用于分割、组织、细化有一定逻辑的组织元素内容和页面结构。" />
      <TDemoBlock title="01 组件类型" summary="水平分割线">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="虚线样式">
        <ThemeDemo />
      </TDemoBlock>
    </div>
  );
}
