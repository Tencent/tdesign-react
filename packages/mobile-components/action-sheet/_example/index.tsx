import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import ListExample from './list';
import GridExample from './grid';
import GridMultipleExample from './grid-multiple';
import StatusExample from './status';
import AlignExample from './align';

import './style/index.less';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="ActionSheet 动作面板"
        summary="从底部弹出的模态框，提供和当前场景相关的操作动作，也支持提供信息输入和描述。"
      />
      <TDemoBlock title="01 组件类型" summary="列表型动作面板" padding>
        <ListExample />
      </TDemoBlock>
      <TDemoBlock summary="宫格型动作面板" padding>
        <GridExample />
        <GridMultipleExample />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="列表型选项状态" padding>
        <StatusExample />
      </TDemoBlock>
      <TDemoBlock title="03 组件样式" summary="列表型对齐方式" padding>
        <AlignExample />
      </TDemoBlock>
    </div>
  );
}
