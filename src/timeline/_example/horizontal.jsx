import React, { useState } from 'react';
import { Timeline, Space, Switch } from 'tdesign-react';

export default function HorizontalTimeLine() {
  const [reverse, setReverse] = useState(false);

  return (
    <Space direction="vertical">
      Reverse <Switch value={reverse} onChange={setReverse} />
      <Timeline layout="horizontal" reverse={reverse}>
        <Timeline.Item>2022-07-16开始</Timeline.Item>
        <Timeline.Item status="process">2022-07-18完成</Timeline.Item>
      </Timeline>
    </Space>
  );
}
