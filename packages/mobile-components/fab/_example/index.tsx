import React, { useState } from 'react';
import { Button, Skeleton } from 'tdesign-mobile-react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import TextDemo from './advance';
import DraggableDemo from './draggable';
import CollapsibleDemo from './collapsible';
import './style/index.less';
import './style/collapsible.less';

export default function FabDemo() {
  const [type, setType] = useState('base');

  const changeType = (type) => setType(type);
  const rowCols = [{ size: '163.5px', borderRadius: '12px' }, 1, { width: '61%' }];

  const getButtonNode = (type: string, name: string) => (
    <Button className="fab-btn" theme="primary" variant="outline" size="large" block onClick={() => changeType(type)}>
      {name}
    </Button>
  );
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Fab 悬浮按钮"
        summary="当功能使用图标即可表意清楚时，可使用纯图标悬浮按钮，例如：添加、发布。"
      />

      <TDemoBlock title="01 组件类型" summary="纯图标悬浮按钮" padding>
        {getButtonNode('base', '纯图标悬浮按钮')}
      </TDemoBlock>
      <TDemoBlock summary="图标加文字悬浮按钮" padding>
        {getButtonNode('advance', '图标加文字悬浮按钮')}
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="可移动悬浮按钮" padding>
        {getButtonNode('draggable', '可移动悬浮按钮')}
      </TDemoBlock>
      <TDemoBlock summary="带自动收缩功能" padding>
        {getButtonNode('collapsible', '带自动收缩功能')}
      </TDemoBlock>
      <TDemoBlock padding>
        {[1, 2].map((item) => (
          <div className="group" key={item}>
            <Skeleton rowCol={rowCols} loading={true} />
            <Skeleton rowCol={rowCols} loading={true} />
          </div>
        ))}
      </TDemoBlock>

      {type === 'base' && <BaseDemo />}
      {type === 'advance' && <TextDemo />}
      {type === 'draggable' && <DraggableDemo />}
      {type === 'collapsible' && <CollapsibleDemo />}
    </div>
  );
}
