import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import Base from './base';
import Color from './color';
import Label from './label';
import Status from './status';
import Size from './size';

import './style/index.less';

export default function () {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Switch 开关" summary="用于控制某个功能的开启和关闭。" />
      <TDemoBlock title="01 组件类型" summary="基础开关">
        <Base />
      </TDemoBlock>
      <TDemoBlock summary="带描述开关">
        <Label />
      </TDemoBlock>
      <TDemoBlock summary="自定义颜色开关">
        <Color />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="加载状态">
        <Status />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="开关尺寸">
        <Size />
      </TDemoBlock>
    </div>
  );
}
