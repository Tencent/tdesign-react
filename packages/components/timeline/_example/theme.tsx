import React from 'react';
import { Timeline } from 'tdesign-react';

export default function ThemeTimeLine() {
  return (
    <Timeline mode="same">
      <Timeline.Item label="2022-01-01" dotColor="primary">
        已完成的时间
      </Timeline.Item>
      <Timeline.Item label="2022-02-01" dotColor="success">
        成功的时间
      </Timeline.Item>
      <Timeline.Item label="2022-03-01" dotColor="error">
        危险时间
      </Timeline.Item>
      <Timeline.Item label="2022-04-01" dotColor="warning">
        告警事件
      </Timeline.Item>
      <Timeline.Item label="2022-05-01">默认的时间</Timeline.Item>
      <Timeline.Item label="2022-06-01" dotColor="yellowgreen">
        自定义主题色
      </Timeline.Item>
    </Timeline>
  );
}
