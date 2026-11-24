import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';

import CustomizedDemo from './customized';
import DirectionDemo from './direction';
import DisabledDemo from './disabled';
import MultipleDemo from './multiple';
import SingleDemo from './single';
import './style/index.less';

export default function DropdownMenuDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="DropdownMenu 下拉菜单"
        summary="菜单呈现数个并列的选项类目，用于整个页面的内容筛选，由菜单面板和菜单选项组成。"
      />

      <TDemoBlock title="01 组件类型" summary="单选下拉菜单">
        <SingleDemo />
      </TDemoBlock>
      <TDemoBlock summary="分栏下拉菜单" padding={false}>
        <MultipleDemo />
      </TDemoBlock>
      <TDemoBlock summary="向上展开" padding={false}>
        <DirectionDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="禁用状态">
        <DisabledDemo />
      </TDemoBlock>
      <TDemoBlock summary="插槽样式" padding={false}>
        <CustomizedDemo />
      </TDemoBlock>

      <div style={{ height: '400px' }}></div>
    </div>
  );
}
