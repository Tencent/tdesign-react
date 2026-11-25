import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import AllDemo from './all';
import BaseDemo from './base';
import CardDemo from './card';
import HorizontalDemo from './horizontal';
import RightDemo from './right';
import SpecialDemo from './special';
import StatusDemo from './status';
import TypeDemo from './type';

import './style/index.less';

export default function CheckboxDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Checkbox 多选框" summary="用于预设的一组选项中执行多项选择，并呈现选择结果。" />
      <TDemoBlock title="01 组件类型" summary="纵向多选框">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="横向多选框">
        <HorizontalDemo />
      </TDemoBlock>
      <TDemoBlock summary="带全选多选框">
        <AllDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="多选框状态">
        <StatusDemo />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="勾选样式">
        <TypeDemo />
      </TDemoBlock>
      <TDemoBlock summary="勾选显示位置">
        <RightDemo />
      </TDemoBlock>
      <TDemoBlock summary="非通栏多选样式">
        <CardDemo />
      </TDemoBlock>
      <TDemoBlock title="04 组件规格" summary="多选框尺寸规格">
        <SpecialDemo />
      </TDemoBlock>
    </div>
  );
}
