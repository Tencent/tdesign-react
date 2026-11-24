import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';

import BaseIcon from './base';
import EnhancedIcon from './enhanced';
import IconfontEnhancedIcon from './iconfont-enhanced';
import IconfontIcon from './iconfont';
import SingleIcon from './single';

import './style/index.less';

export default function IconDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Icon 图标" summary="Icon 作为UI构成中重要的元素，一定程度上影响UI界面整体呈现出的风格。" />
      <TDemoBlock title="SVG 全量引入" padding={true}>
        <BaseIcon />
      </TDemoBlock>
      <TDemoBlock summary="SVG 按需引入" padding={true}>
        <SingleIcon />
      </TDemoBlock>
      <TDemoBlock summary="SVG 高级用法" padding={true}>
        <EnhancedIcon />
      </TDemoBlock>
      <TDemoBlock title="iconfont 图标" padding={true}>
        <IconfontIcon />
      </TDemoBlock>
      <TDemoBlock summary="iconfont 高级用法" padding={true}>
        <IconfontEnhancedIcon />
      </TDemoBlock>
    </div>
  );
}
