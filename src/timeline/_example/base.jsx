import React, { useState } from 'react';
import { Timeline, Space, Switch, Radio } from 'tdesign-react';

export default function BasicTimeLine() {
  const [reverse, setReverse] = useState(false);
  const [theme, setTheme] = useState('default');
  const [align, setAlign] = useState('left');
  return (
    <Space direction="vertical">
      Reverse <Switch value={reverse} onChange={setReverse} />
      <Space>
        <h4>自定义轴线样式</h4>
        <Radio.Group value={theme} onChange={setTheme}>
          <Radio.Button value="default">默认</Radio.Button>
          <Radio.Button value="dot">dot</Radio.Button>
        </Radio.Group>
      </Space>
      <Space>
        <h4>对齐方式</h4>
        <Radio.Group value={align} onChange={setAlign}>
          <Radio.Button value="left">left</Radio.Button>
          <Radio.Button value="alternate">alternate</Radio.Button>
          <Radio.Button value="right">right</Radio.Button>
        </Radio.Group>
      </Space>
      <Timeline reverse={reverse} theme={theme} align={align}>
        <Timeline.Item time="2022-07-16">2022-07-16开始</Timeline.Item>
        <Timeline.Item time="2022-07-17" align="left">
          2022-07-17 进度30%
        </Timeline.Item>
        <Timeline.Item time="2022-07-18">2022-07-18 进度40%</Timeline.Item>
        <Timeline.Item status="process">2022-07-18完成</Timeline.Item>
      </Timeline>
    </Space>
  );
}
