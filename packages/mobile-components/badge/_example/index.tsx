import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';

import BaseBadge from './base';
import ThemeBadge from './theme';
import SizeBadge from './size';

import './style/index.less';

export default function BadgeDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Badge 徽标" summary="用于告知用户，该区域的状态变化或者待处理任务的数量。" />
      <TDemoBlock title="01 组件类型">
        <BaseBadge />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式">
        <ThemeBadge />
      </TDemoBlock>
      <TDemoBlock title="03 组件尺寸">
        <SizeBadge />
      </TDemoBlock>
    </div>
  );
}
