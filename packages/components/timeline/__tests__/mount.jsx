import React from 'react';
import { render } from '@test/utils';
import { Timeline } from '../../timeline';

export function getTimelineDefaultMount(Timeline, props, events) {
  return render(
    <Timeline {...props} {...events}>
      <Timeline.Item label="2022-01-01">Event1</Timeline.Item>
      <Timeline.Item label="2022-02-01">Event2</Timeline.Item>
      <Timeline.Item label="2022-03-01">Event3</Timeline.Item>
      <Timeline.Item label="2022-04-01" dotColor="yellowgreen">Event4</Timeline.Item>
    </Timeline>
  );
}

// labelAlign 优先级比较
export function getTimelineItemMount(TimelineItem, props) {
  return render(
    <Timeline labelAlign='right'>
      <TimelineItem {...props} label="2022-01-01">Event1</TimelineItem>
      <TimelineItem label="2022-02-01">Event2</TimelineItem>
      <TimelineItem label="2022-03-01">Event3</TimelineItem>
      <TimelineItem label="2022-04-01">Event4</TimelineItem>
    </Timeline>
  );
}

export default getTimelineDefaultMount
