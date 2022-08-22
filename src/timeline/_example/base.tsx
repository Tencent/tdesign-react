import React, { useState } from 'react';
import { Timeline, Space, Radio } from 'tdesign-react';

export default function BasicTimeLine() {
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');

  return (
    <Space direction="vertical">
      <Space>
        <h4>时间轴方向</h4>
        <Radio.Group variant="default-filled" value={direction} onChange={(v) => setDirection(v as any)}>
          <Radio.Button value="vertical">垂直时间轴</Radio.Button>
          <Radio.Button value="horizontal">水平时间轴</Radio.Button>
        </Radio.Group>
      </Space>
      <Timeline layout={direction} mode="same">
        <Timeline.Item label="2022-01-01">事件一</Timeline.Item>
        <Timeline.Item label="2022-02-01">事件二</Timeline.Item>
        <Timeline.Item label="2022-03-01">事件三</Timeline.Item>
        <Timeline.Item label="2022-04-01">事件四</Timeline.Item>
      </Timeline>
    </Space>
  );
}
