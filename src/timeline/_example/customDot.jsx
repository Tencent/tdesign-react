import React from 'react';
import { Timeline } from 'tdesign-react';
import { CheckCircleFilledIcon } from 'tdesign-icons-react';

export default function CustomNodeTimeLine() {
  return (
    <Timeline>
      <Timeline.Item dot={<CheckCircleFilledIcon size={'medium'} />}>自定义节点</Timeline.Item>
      <Timeline.Item>2022-07-16开始</Timeline.Item>
      <Timeline.Item>2022-07-17 进度30%</Timeline.Item>
      <Timeline.Item>2022-07-18 进度40%</Timeline.Item>
      <Timeline.Item status="process">2022-07-18完成</Timeline.Item>
    </Timeline>
  );
}
