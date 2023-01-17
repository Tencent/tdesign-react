import React from 'react';
import { render } from '@test/utils';

export function getTimelineDefaultMount(Timeline, props, events) {
  return render(
    <Timeline {...props} {...events}>
      <Timeline.Item label="2022-01-01">Event1</Timeline.Item>
      <Timeline.Item label="2022-02-01">Event2</Timeline.Item>
      <Timeline.Item label="2022-03-01">Event3</Timeline.Item>
      <Timeline.Item label="2022-04-01">Event4</Timeline.Item>
    </Timeline>
  );
}

export default {}
