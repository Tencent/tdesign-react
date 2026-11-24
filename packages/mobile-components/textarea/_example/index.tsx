import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import Base from './base';
import Label from './label';
import Autosize from './autosize';
import Events from './custom';
import Disable from './disabled';
import Maxcharacter from './maxcharacter';
import Maxlength from './maxlength';
import Card from './card';
import Layout from './layout';

import './style/index.less';

export default function () {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Textarea 多行文本框" summary="用于多行文本信息输入。" />
      <TDemoBlock title="01 组件类型" summary="基础多行文本框">
        <Base />
      </TDemoBlock>
      <TDemoBlock summary="带标题多行文本框">
        <Label />
      </TDemoBlock>
      <TDemoBlock summary="自动增高多行文本框">
        <Autosize />
      </TDemoBlock>
      <TDemoBlock summary="设置字符数限制">
        <Maxlength />
      </TDemoBlock>
      <TDemoBlock>
        <Maxcharacter />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="禁用状态">
        <Disable />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="竖排样式">
        <Layout />
      </TDemoBlock>
      <TDemoBlock summary="卡片样式">
        <Card />
      </TDemoBlock>
      <TDemoBlock title="04 特殊样式" summary="标签外置输入框">
        <Events />
      </TDemoBlock>
    </div>
  );
}
