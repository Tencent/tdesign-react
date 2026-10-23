import React from 'react';
import { render } from '@test/utils';

import { Timeline, TimelineItem } from '..';

function getTimelineDefaultMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  return render(
    <Timeline {...props} {...events}>
      <Timeline.Item label="2022-01-01">Event1</Timeline.Item>
      <Timeline.Item label="2022-02-01">Event2</Timeline.Item>
      <Timeline.Item label="2022-03-01">Event3</Timeline.Item>
      <Timeline.Item label="2022-04-01" dotColor="yellowgreen">
        Event4
      </Timeline.Item>
    </Timeline>,
  );
}

function getTimelineItemMount(props: Record<string, any> = {}) {
  return render(
    <Timeline labelAlign="right">
      <TimelineItem {...props} label="2022-01-01">
        Event1
      </TimelineItem>
      <TimelineItem label="2022-02-01">Event2</TimelineItem>
      <TimelineItem label="2022-03-01">Event3</TimelineItem>
      <TimelineItem label="2022-04-01">Event4</TimelineItem>
    </Timeline>,
  );
}

describe('Timeline', () => {
  describe('props', () => {
    const labelAlignClassNameMap = {
      left: 't-timeline-left',
      alternate: 't-timeline-alternate',
      right: 't-timeline-right',
    };
    Object.entries(labelAlignClassNameMap).forEach(([enumValue, expectedClassName]) => {
      test(`labelAlign[${enumValue}]`, () => {
        let propValue: any = { true: true, false: false }[enumValue];
        propValue = propValue === undefined ? enumValue : propValue;
        const { container } = getTimelineDefaultMount({
          labelAlign: propValue,
        });
        expect(container.firstChild).toHaveClass(expectedClassName);
      });
    });

    (['top', 'bottom'] as const).forEach((item) => {
      test(`labelAlign[${item}]`, () => {
        const { container } = getTimelineDefaultMount({
          layout: 'horizontal',
          labelAlign: item,
        });
        expect(container.querySelector('.t-timeline')).toHaveClass(`t-timeline-${item}`);
      });
    });

    (['horizontal', 'vertical'] as const).forEach((item) => {
      test(`layout[${item}]`, () => {
        const { container } = getTimelineDefaultMount({ layout: item });
        expect(container.firstChild).toHaveClass(`t-timeline-${item}`);
      });
    });

    (['alternate', 'same'] as const).forEach((item) => {
      test(`mode[${item}]`, () => {
        const { container } = render(<Timeline mode={item}></Timeline>);
        expect(container.firstChild).toHaveClass(`t-timeline-label--${item}`);
      });
    });

    test('reverse', () => {
      const { container } = getTimelineDefaultMount({ reverse: true });
      expect(container.querySelector('.t-timeline-item__content').textContent).toBe('Event4');
    });

    test('theme[dot]', () => {
      const { container } = getTimelineDefaultMount({ theme: 'dot' });
      expect(container.querySelectorAll('.t-timeline-item__tail--theme-dot').length).toBe(4);
    });
  });
});

describe('TimelineItem', () => {
  describe('props', () => {
    const dotColorClassNameMap = {
      primary: 't-timeline-item__dot--primary',
      warning: 't-timeline-item__dot--warning',
      error: 't-timeline-item__dot--error',
      default: 't-timeline-item__dot--default',
    };
    Object.entries(dotColorClassNameMap).forEach(([enumValue, expectedClassName]) => {
      test(`dotColor[${enumValue}]`, () => {
        let propValue: any = { true: true, false: false }[enumValue];
        propValue = propValue === undefined ? enumValue : propValue;
        const wrapper = render(<TimelineItem dotColor={propValue}></TimelineItem>);
        const container = wrapper.container.querySelector('.t-timeline-item__dot');
        expect(container).toHaveClass(expectedClassName);
      });
    });

    test('dotColor[yellowgreen]', () => {
      const { container } = render(<TimelineItem dotColor="yellowgreen"></TimelineItem>);
      const domWrapper = container.querySelector('.t-timeline-item__dot') as HTMLElement;
      expect(domWrapper.style.borderColor).toBe('yellowgreen');
    });

    test.skip('labelAlign[left]', () => {
      const { container } = getTimelineItemMount({ labelAlign: 'left' });
      expect(container.querySelectorAll('.t-timeline-item:first-child .t-timeline-item-left').length).toBe(1);
    });

    test('loading', () => {
      // loading default value is
      const { container } = render(<TimelineItem></TimelineItem>);
      expect(container.querySelector('.t-timeline-item__dot .t-loading')).toBeFalsy();
      // loading = false
      const { container: container1 } = render(<TimelineItem loading={false}></TimelineItem>);
      expect(container1.querySelector('.t-timeline-item__dot .t-loading')).toBeFalsy();
      // loading = true
      const { container: container2 } = render(<TimelineItem loading={true}></TimelineItem>);
      expect(container2.querySelector('.t-timeline-item__dot .t-loading')).toBeTruthy();
    });

    test('content and children', () => {
      const node = <span className="custom-node">TNode</span>;
      const contentWrapper = render(<TimelineItem content={node} />);
      const childrenWrapper = render(<TimelineItem>{node}</TimelineItem>);

      [contentWrapper, childrenWrapper].forEach(({ container }) => {
        expect(container.querySelector('.custom-node')).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });

    test('dot', () => {
      const { container } = render(<TimelineItem dot={<span className="custom-node">TNode</span>}></TimelineItem>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('label', () => {
      const { container } = render(<TimelineItem label={<span className="custom-node">TNode</span>}></TimelineItem>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
});
