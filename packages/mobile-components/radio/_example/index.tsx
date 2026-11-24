import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import BaseDemo from './base';
import HorizontalDemo from './horizontal';
import StatusDemo from './status';
import IconDemo from './icon';
import PlacementDemo from './placement';
import CardDemo from './card';
import CustomDemo from './custom';
import './style/index.less';

export default function RadioDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Radio 单选框" summary="用于在预设的一组选项中执行单项选择，并呈现选择结果。" />

      <TDemoBlock title="01 组件类型" summary="纵向单选框">
        <div className="radio-demo">
          <BaseDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock summary="横向单选框">
        <div className="radio-demo">
          <HorizontalDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock title="02 组件状态" summary="单选框状态">
        <div className="radio-demo">
          <StatusDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock title="03 组件样式" summary="勾选样式">
        <div className="radio-demo">
          <IconDemo />
        </div>
      </TDemoBlock>
      <TDemoBlock summary="勾选显示位置">
        <div className="radio-demo">
          <PlacementDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock summary="非通栏单选样式">
        <div className="radio-demo">
          <CardDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock title="04 特殊样式">
        <div className="radio-demo">
          <CustomDemo />
        </div>
      </TDemoBlock>
    </div>
  );
}
