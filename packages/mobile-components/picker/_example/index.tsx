import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import AreaDemo from './area';
import BaseDemo from './base';
import CustomHeightDemo from './custom-height';
import TitleDemo from './with-title';

import './style/index.less';
import './style/custom-height.less';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Picker 选择器" summary="用于一组预设数据中的选择。" />
      <TDemoBlock title="01 组件类型" summary="基础选择器">
        <BaseDemo />
        <AreaDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="是否带标题">
        <TitleDemo />
        <CustomHeightDemo />
      </TDemoBlock>
    </div>
  );
}
