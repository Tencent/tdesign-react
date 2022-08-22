import React, { useState } from 'react';
import { Timeline, Space, Radio } from 'tdesign-react';

export default function LayoutTimeLine() {
  const [direction, setDirection] = useState<'left' | 'right' | 'alternate'>('left');
  const [mode, setMode] = useState<'same' | 'alternate'>('same');
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');

  return (
    <Space direction="vertical">
      <Space>
        <h4>时间轴方向</h4>
        <Radio.Group value={layout} onChange={(v) => setLayout(v as any)}>
          <Radio value="vertical">垂直时间轴</Radio>
          <Radio value="horizontal">水平时间轴</Radio>
        </Radio.Group>
      </Space>
      <Space>
        <h4>对齐方式</h4>
        <Radio.Group value={direction} onChange={(v) => setDirection(v as any)}>
          <Radio value="left">左对齐</Radio>
          <Radio value="alternate">交错对齐</Radio>
          <Radio value="right">右对齐</Radio>
        </Radio.Group>
      </Space>
      <Space>
        <h4>label对齐方式</h4>
        <Radio.Group value={mode} onChange={(v) => setMode(v as any)}>
          <Radio value="same">同侧</Radio>
          <Radio value="alternate">交错</Radio>
        </Radio.Group>
      </Space>
      <Timeline layout={layout} labelAlign={direction} mode={mode}>
        <Timeline.Item label="2022-01-01">事件一</Timeline.Item>
        <Timeline.Item label="2022-02-01">事件二</Timeline.Item>
        <Timeline.Item label="2022-03-01">事件三</Timeline.Item>
        <Timeline.Item label="2022-04-01">事件四</Timeline.Item>
      </Timeline>
    </Space>
  );
}
