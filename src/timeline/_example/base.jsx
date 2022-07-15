import React from 'react';
import { Timeline } from 'tdesign-react';

export default function BasicTimeLine() {
  return (
    <Timeline>
      <Timeline.Item>123</Timeline.Item>
      <Timeline.Item status="process">123</Timeline.Item>
    </Timeline>
  );
}
