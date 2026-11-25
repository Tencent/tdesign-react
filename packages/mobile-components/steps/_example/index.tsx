import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import Horizontal from './horizontal';
import Special from './special';
import Status from './status';
import Vertical from './vertical';

import './style/index.less';

export default function StepsDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Steps 步骤条" summary="用于任务步骤展示或任务进度展示。" />
      <TDemoBlock title="01 组件类型">
        <Horizontal />
        <Vertical />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态">
        <Status />
      </TDemoBlock>
      <TDemoBlock title="03 特殊类型">
        <Special />
      </TDemoBlock>
    </div>
  );
}
