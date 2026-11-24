import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';

import BaseDemo from './base';
import CombinationDemo from './combination';
import ThemeDemo from './theme';
import CopyableDemo from './copyable';
import EllipsisDemo from './ellipsis';

import './style/index.less';

export default function TypographyDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Typography 排版"
        summary="排版用于文本基础编排和样式，使用排版组件，可以快速完成页面中的文本内容制作，同时配合其他组件完成深色与浅色模式切换等风格统一的需求。"
      />
      <TDemoBlock title="组件类型" summary="基础文本">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="组合用法">
        <CombinationDemo />
      </TDemoBlock>
      <TDemoBlock summary="主题样式">
        <ThemeDemo />
      </TDemoBlock>
      <TDemoBlock summary="可复制">
        <CopyableDemo />
      </TDemoBlock>
      <TDemoBlock summary="文本省略">
        <EllipsisDemo />
      </TDemoBlock>
    </div>
  );
}
