import React, { useState } from 'react';
import { Timeline, Switch } from 'tdesign-react';

export default function BasicTimeLine() {
  const [reverse, setReverse] = useState(false);
  return (
    <>
      <Switch value={reverse} onChange={setReverse} />
      <Timeline reverse={reverse}>
        <Timeline.Item>123</Timeline.Item>
        <Timeline.Item status="process">123</Timeline.Item>
      </Timeline>
    </>
  );
}
