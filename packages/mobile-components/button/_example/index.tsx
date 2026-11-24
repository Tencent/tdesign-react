import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import './style/index.less';
import BaseDemo from './base';
import IconDemo from './icon';
import GhostDemo from './ghost';
import GroupDemo from './group';
import BlockDemo from './block';
import SizeDemo from './size';
import StatusDemo from './status';
import ShapeDemo from './shape';
import ThemeDemo from './theme';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Button 按钮" summary="用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。" />
      <TDemoBlock title="01 组件类型" summary="基础按钮">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="图标按钮">
        <IconDemo />
      </TDemoBlock>
      <TDemoBlock summary="幽灵按钮">
        <GhostDemo />
      </TDemoBlock>
      <TDemoBlock summary="组合按钮">
        <GroupDemo />
      </TDemoBlock>
      <TDemoBlock summary="通栏按钮">
        <BlockDemo />
      </TDemoBlock>

      <TDemoBlock title="02 组件状态" summary="按钮禁用态">
        <StatusDemo />
      </TDemoBlock>

      <TDemoBlock title="03 组件样式" summary="按钮尺寸">
        <SizeDemo />
      </TDemoBlock>

      <TDemoBlock summary="按钮形状">
        <ShapeDemo />
      </TDemoBlock>

      <TDemoBlock summary="按钮主题">
        <ThemeDemo />
      </TDemoBlock>
    </div>
  );
}
