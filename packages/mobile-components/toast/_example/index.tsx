import React from 'react';
import Base from './base';
import Theme from './theme';
import Cover from './cover';
import Close from './close';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import './style/index.less';

export default function () {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Toast 轻提示" summary="用于轻量级反馈或提示，不会打断用户操作。" />
      <TDemoBlock title="01 组件类型">
        <Base />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态">
        <Theme />
      </TDemoBlock>
      <TDemoBlock title="03 显示遮罩" summary="弹窗可显示遮罩，禁止滑动和点击" padding>
        <Cover />
      </TDemoBlock>
      <TDemoBlock title="04 手动关闭" summary="手动关闭轻提示" padding>
        <Close />
      </TDemoBlock>
    </div>
  );
}
