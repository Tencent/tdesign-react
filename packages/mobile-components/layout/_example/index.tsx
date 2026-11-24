import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import './style/index.less';

import BaseDemo from './base';
import OffsetDemo from './offset';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Layout 布局"
        summary="以规则的网格阵列来指导和规范页面中的版面布局以及信息分布，提高界面内布局的一致性，节约成本。"
      />
      <TDemoBlock title="01 组件类型" summary="基础用法">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock title="" summary="在列元素之间增加间距">
        <OffsetDemo />
      </TDemoBlock>
    </div>
  );
}
