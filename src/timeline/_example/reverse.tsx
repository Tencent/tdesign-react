import React, { useState } from 'react';
import { Timeline, Space, Switch } from 'tdesign-react';

export default function ReverseTimeLine() {
  const [reverse, setReverse] = useState(false);

  return (
    <Space direction="vertical">
      <Space>
        <h4>是否倒序</h4>
        <Switch value={reverse} onChange={(v) => setReverse(v as boolean)}></Switch>
      </Space>
      <Timeline mode="same" reverse={reverse}>
        <Timeline.Item label="2022-01-01">事件一</Timeline.Item>
        <Timeline.Item label="2022-02-01">事件二</Timeline.Item>
        <Timeline.Item label="2022-03-01">事件三</Timeline.Item>
        <Timeline.Item label="2022-04-01">事件四</Timeline.Item>
      </Timeline>
    </Space>
  );
}
