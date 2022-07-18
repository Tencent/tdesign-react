import React, { useState } from 'react';
import { Timeline, Space, Radio } from 'tdesign-react';

export default function CustomNodeTimeLine() {
  const [theme, setTheme] = useState('default');
  const [align, setAlign] = useState('left');
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
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
      <Timeline theme={theme} align={align}>
        <Timeline.Item time="2022-07-16">开始创建</Timeline.Item>
        <Timeline.Item time="2022-07-18">完成80%</Timeline.Item>
      </Timeline>
    </Space>
  );
}
