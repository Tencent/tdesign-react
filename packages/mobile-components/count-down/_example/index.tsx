import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import BaseCountDown from './base';
import SizeCountDown from './size';

import './style/index.less';

export default function CountDownDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="CountDown 倒计时" summary="用于实时展示倒计时数值。" />
      <TDemoBlock title="01 组件类型" padding={true}>
        <BaseCountDown />
      </TDemoBlock>
      <TDemoBlock title="02 组件尺寸" summary="倒计时 large/medium/small 尺寸" padding={true}>
        <SizeCountDown />
      </TDemoBlock>
    </div>
  );
}
