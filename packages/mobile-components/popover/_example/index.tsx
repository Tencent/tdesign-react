import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import PlacementDemo from './placement';
import ThemeDemo from './theme';
import TypeDemo from './type';

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
