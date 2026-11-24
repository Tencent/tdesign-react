import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TypeDemo from './type';
import ThemeDemo from './theme';
import PlacementDemo from './placement';

import './style/index.less';

export default function LinkDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Popover 弹出气泡" summary="用于文字提示的气泡框。" />
      <TDemoBlock title="01 组件类型">
        <TypeDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式">
        <ThemeDemo />
      </TDemoBlock>
      <TDemoBlock>
        <PlacementDemo />
      </TDemoBlock>
    </div>
  );
}
