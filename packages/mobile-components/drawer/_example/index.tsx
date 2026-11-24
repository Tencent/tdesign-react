import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import Base from './base';
import Icon from './icon';
import Plugin from './plugin';
import Title from './title';
import Footer from './footer';
import Placement from './placement';
import './style/index.less';

export default function Demo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Drawer 抽屉"
        summary="用作一组平行关系页面/内容的切换器，相较于 Tab，同屏可展示更多的选项数量。"
      />

      <TDemoBlock title="01 组件类型" summary="基础抽屉" padding>
        <Base />
      </TDemoBlock>

      <TDemoBlock summary="带图标抽屉" padding>
        <Icon />
      </TDemoBlock>

      <TDemoBlock title="02 组件样式" summary="带标题样式" padding>
        <Title />
      </TDemoBlock>

      <TDemoBlock summary="抽屉方向" padding>
        <Placement />
      </TDemoBlock>

      <TDemoBlock summary="带底部插槽样式" padding>
        <Footer />
      </TDemoBlock>

      <TDemoBlock title="03 使用方式" summary="使用命令行" padding>
        <Plugin />
      </TDemoBlock>
    </div>
  );
}
