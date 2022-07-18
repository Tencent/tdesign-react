import React from 'react';
import { Timeline } from 'tdesign-react';
import { CheckCircleFilledIcon } from 'tdesign-icons-react';

export default function CustomNodeTimeLine() {
  return (
    <Timeline>
      <Timeline.Item dot={<CheckCircleFilledIcon size={'medium'} />}>自定义节点</Timeline.Item>
      <Timeline.Item status="process">进行中</Timeline.Item>
    </Timeline>
  );
}
