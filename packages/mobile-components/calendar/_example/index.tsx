import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import MultipleDemo from './multiple';
import RangeDemo from './range';
import CustomTextSingleDemo from './custom-text-single';
import CustomTextDemo from './custom-text';
import DisabledDemo from './disabled';
import WithoutPopupDemo from './without-popup';
import SwitchModeDemo from './switch-mode';
import LocalTextDemo from './local-text';
import './style/index.less';

export default function CheckboxDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Calendar 日历" summary="按照日历形式展示数据或日期的容器。" />
      <TDemoBlock title="01 组件类型" summary="基础日历">
        <BaseDemo />
      </TDemoBlock>

      <TDemoBlock>
        <MultipleDemo />
      </TDemoBlock>

      <TDemoBlock summary="带单行描述的日历">
        <CustomTextSingleDemo />
      </TDemoBlock>

      <TDemoBlock summary="带双行描述的日历">
        <CustomTextDemo />
      </TDemoBlock>

      <TDemoBlock summary="带翻页功能的日历">
        <SwitchModeDemo />
      </TDemoBlock>

      <TDemoBlock summary="可选择区间日期的日历">
        <RangeDemo />
      </TDemoBlock>

      <TDemoBlock title="02 组件样式" summary="国际化">
        <LocalTextDemo />
      </TDemoBlock>

      <TDemoBlock summary="含不可选的日历">
        <DisabledDemo />
      </TDemoBlock>

      <TDemoBlock summary="不使用 Popup">
        <WithoutPopupDemo />
      </TDemoBlock>
    </div>
  );
}
