import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import CheckStrictlyDemo from './check-strictly';
import FilterableDemo from './filterable';
import KeysDemo from './keys';
import LazyDemo from './lazy';
import ThemeTabDemo from './theme-tab';
import WithTitleDemo from './with-title';
import WithValueDemo from './with-value';

import './style/index.less';

export default function CascaderDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Cascader 级联选择器" summary="用于多层级数据的逐级选择。" />
      <TDemoBlock title="01 组件类型" summary="垂直级联选择器">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="水平级联选择器">
        <ThemeTabDemo />
      </TDemoBlock>
      <TDemoBlock title="02 进阶" summary="带初始值">
        <WithValueDemo />
      </TDemoBlock>
      <TDemoBlock summary="自定义 keys">
        <KeysDemo />
      </TDemoBlock>
      <TDemoBlock summary="使用次级标题">
        <WithTitleDemo />
      </TDemoBlock>
      <TDemoBlock summary="异步加载">
        <LazyDemo />
      </TDemoBlock>
      <TDemoBlock summary="选择任意一项">
        <CheckStrictlyDemo />
      </TDemoBlock>
      <TDemoBlock summary="支持搜索">
        <FilterableDemo />
      </TDemoBlock>
    </div>
  );
}
