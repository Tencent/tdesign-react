import React from 'react';
import { Timeline } from 'tdesign-react';
import { CheckCircleFilledIcon } from 'tdesign-icons-react';

export default function BasicTimeLine() {
  return (
    <Timeline>
      <Timeline.Item dot={<CheckCircleFilledIcon size={'medium'} />}>123</Timeline.Item>
      <Timeline.Item status="process">123</Timeline.Item>
    </Timeline>
  );
}
