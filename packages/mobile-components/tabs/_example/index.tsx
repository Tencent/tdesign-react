import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import BadgeDemo from './badge';
import ContentDemo from './content';
import EvenlyDemo from './evenly';
import IconDemo from './icon';
import IsometricDemo from './isometric';
import SizeDemo from './size';
import StatusDemo from './status';
import ThemeDemo from './theme';

import './style/index.less';

export default function () {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Tabs 选项卡" summary="用于内容分类后的展示切换。" />
      <TDemoBlock title="01 组件类型" summary="均分选项卡">
        <EvenlyDemo />
      </TDemoBlock>
      <TDemoBlock summary="等距选项卡">
        <IsometricDemo />
      </TDemoBlock>
      <TDemoBlock summary="带图标选项卡">
        <IconDemo />
      </TDemoBlock>
      <TDemoBlock summary="带徽标选项卡">
        <BadgeDemo />
      </TDemoBlock>
      <TDemoBlock summary="带内容区选项卡">
        <ContentDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="选项卡状态">
        <StatusDemo />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="选项卡尺寸">
        <SizeDemo />
      </TDemoBlock>
      <TDemoBlock summary="选项卡样式">
        <ThemeDemo />
      </TDemoBlock>
    </div>
  );
}
