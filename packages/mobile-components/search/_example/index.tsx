import React from 'react';
import BaseDemo from './base';
import ActionDemo from './action';
import ShapeDemo from './shape';
import OtherDemo from './other';
import MaxLengthDemo from './max-length';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';

import './style/index.less';

export default function RadioDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Search 搜索框" summary="用于用户输入搜索信息，并进行页面内容搜索。" />

      <TDemoBlock title="01 组件类型" summary="基础搜索框">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="获取焦点后显示取消按钮">
        <ActionDemo />
      </TDemoBlock>
      <TDemoBlock summary="字数限制">
        <MaxLengthDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="搜索框形状">
        <ShapeDemo />
      </TDemoBlock>
      <TDemoBlock title="03 组件状态" summary="默认状态其他对齐方式">
        <OtherDemo />
      </TDemoBlock>
    </div>
  );
}
