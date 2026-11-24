import React from 'react';
import BaseDemo from './base';
import MaxLength from './maxlength';
import Suffix from './suffix';
import Prefix from './prefix';
import Special from './special';
import Status from './status';
import LabelDemo from './label';
import Align from './align';
import Layout from './layout';
import Banner from './banner';
import Bordered from './bordered';
import Custom from './custom';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import './style/index.less';

export default function RadioDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Input 输入框" summary="用于单行文本信息输入。" />

      <TDemoBlock title="01 组件类型" summary="基础输入框">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="带字数限制输入框">
        <MaxLength />
      </TDemoBlock>
      <TDemoBlock summary="带操作输入框">
        <Suffix />
      </TDemoBlock>
      <TDemoBlock summary="带图标输入框">
        <Prefix />
      </TDemoBlock>
      <TDemoBlock summary="特定类型输入框">
        <Special />
      </TDemoBlock>

      <TDemoBlock title="02 组件状态" summary="输入框状态">
        <Status />
      </TDemoBlock>
      <TDemoBlock summary="信息超长状态">
        <LabelDemo />
      </TDemoBlock>

      <TDemoBlock title="03 组件样式" summary="内容位置">
        <Align />
      </TDemoBlock>
      <TDemoBlock summary="竖排样式">
        <Layout />
      </TDemoBlock>
      <TDemoBlock summary="非通栏样式">
        <Banner />
      </TDemoBlock>
      <TDemoBlock summary="标签外置样式">
        <Bordered />
      </TDemoBlock>
      <TDemoBlock summary="自定义样式输入框">
        <Custom />
      </TDemoBlock>
    </div>
  );
}
