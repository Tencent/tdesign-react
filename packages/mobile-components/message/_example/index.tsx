import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import Base from './base';
import Theme from './theme';
import CloseAll from './close-all';
import './style/index.less';

export default function Demo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Message 消息通知" summary="用于轻量级反馈或提示，不会打断用户操作。" />
      <TDemoBlock title="01 组件类型" summary="消息通知内容为文本、带操作按钮" padding>
        <Base />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="消息组件风格" padding>
        <Theme />
      </TDemoBlock>
      <TDemoBlock title="03 关闭所有通知" summary="关闭所有通知" padding>
        <CloseAll />
      </TDemoBlock>
    </div>
  );
}
