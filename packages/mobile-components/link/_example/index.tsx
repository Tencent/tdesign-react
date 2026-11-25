import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import BaseDemo from './base';
import SizeDemo from './link-size';
import PrefixDemo from './prefix';
import StatusDemo from './status';
import SuffixDemo from './suffix';
import ThemeDemo from './theme';
import UnderlineDemo from './underline';

import './style/index.less';

export default function LinkDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Link 链接" summary="文字超链接用于跳转一个新页面，如当前项目跳转，友情链接等。" />
      <TDemoBlock title="01 组件类型" summary="基础文字链接">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="下划线文字链接">
        <UnderlineDemo />
      </TDemoBlock>
      <TDemoBlock summary="前置图标文字链接">
        <PrefixDemo />
      </TDemoBlock>
      <TDemoBlock summary="后置图标文字链接">
        <SuffixDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="不同主题">
        <ThemeDemo />
      </TDemoBlock>
      <TDemoBlock summary="禁用状态">
        <StatusDemo />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="链接尺寸">
        <SizeDemo />
      </TDemoBlock>
    </div>
  );
}
