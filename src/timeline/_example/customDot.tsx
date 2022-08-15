import React, { useState } from 'react';
import { Timeline, Space, Radio } from 'tdesign-react';
import { TipsIcon, UserIcon, HeartIcon, HomeIcon } from 'tdesign-icons-react';

export default function BasicTimeLine() {
  const [dot, setDot] = useState<'default' | 'dot'>('default');

  return (
    <Space direction="vertical">
      <Space>
        <h4>时间轴样式</h4>
        <Radio.Group value={dot} onChange={(v) => setDot(v as any)}>
          <Radio.Button value="default">默认样式</Radio.Button>
          <Radio.Button value="dot">Dot样式</Radio.Button>
        </Radio.Group>
      </Space>
      <Timeline mode="same" theme={dot}>
        <Timeline.Item label="2022-01-01" dot={<TipsIcon size="medium" color="#0052D9" />}>
          事件一
        </Timeline.Item>
        <Timeline.Item label="2022-02-01" dot={<UserIcon size="medium" color="#0052D9" />}>
          事件二
        </Timeline.Item>
        <Timeline.Item label="2022-03-01" dot={<HeartIcon size="medium" color="#0052D9" />}>
          事件三
        </Timeline.Item>
        <Timeline.Item label="2022-04-01" dot={<HomeIcon size="medium" color="#0052D9" />}>
          事件四
        </Timeline.Item>
      </Timeline>
    </Space>
  );
}
