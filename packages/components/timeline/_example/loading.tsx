import React, { useState } from 'react';
import { Timeline, Space, Switch } from 'tdesign-react';

export default function LoadingTimeLine() {
  const [loading, setLoading] = useState(false);

  return (
    <Space direction="vertical">
      <Space>
        <h4>加载中</h4>
        <Switch value={loading} onChange={(v) => setLoading(v as boolean)}></Switch>
      </Space>
      <Timeline mode="same">
        <Timeline.Item label="2022-01-01">事件一</Timeline.Item>
        <Timeline.Item label="2022-02-01">事件二</Timeline.Item>
        <Timeline.Item label="2022-03-01">事件三</Timeline.Item>
        <Timeline.Item label="2022-04-01" loading={loading}>
          事件四
        </Timeline.Item>
      </Timeline>
    </Space>
  );
}
