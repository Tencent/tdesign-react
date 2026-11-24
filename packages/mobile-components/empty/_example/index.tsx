import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import ImageEmptyDemo from './image-empty';
import ButtonEmptyDemo from './button-empty';

import './style/index.less';

export default function EmptyDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Empty 空状态" summary="用于空状态时的占位提示。" />
      <TDemoBlock title="组件类型" summary="图标空状态">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="自定义图片空状态">
        <ImageEmptyDemo />
      </TDemoBlock>
      <TDemoBlock summary="带操作空状态">
        <ButtonEmptyDemo />
      </TDemoBlock>
    </div>
  );
}
