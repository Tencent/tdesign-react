import classNames from 'classnames';
import React from 'react';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import TimelineItem from './TimelineItem';
import { TdTimelineProps } from './type';
import TimelineContext from './TimelineContext';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { useAlign } from './useAlign';

export interface TimelineProps extends TdTimelineProps, StyledProps {
  children?: React.ReactNode;
}

const Timeline = forwardRefWithStatics(
  (props: TimelineProps, ref: React.Ref<HTMLUListElement>) => {
    const {
      theme = 'default',
      labelAlign,
      children,
      className,
      style,
      reverse = false,
      layout = 'vertical',
      mode = 'alternate',
    } = props;
    const { classPrefix } = useConfig();
    const renderAlign = useAlign(labelAlign, layout);

    const timelineItems = React.Children.toArray(children).filter(
      (child: JSX.Element) => child.type.displayName === TimelineItem.displayName,
    );
    // 获取所有子节点类型
    const itemsStatus = React.Children.map(timelineItems, (child: JSX.Element) => child.props?.dotColor || 'primary');
    const hasLabelItem = timelineItems.some((item: React.ReactElement<any>) => !!item?.props?.label);

    if (reverse) {
      timelineItems.reverse();
    }

    const itemsCounts = React.Children.count(timelineItems);

    const timelineClassName = classNames(
      `${classPrefix}-timeline`,
      {
        [`${classPrefix}-timeline-${renderAlign}`]: true,
        [`${classPrefix}-timeline-reverse`]: reverse,
        [`${classPrefix}-timeline-${layout}`]: true,
        [`${classPrefix}-timeline-label`]: hasLabelItem,
        [`${classPrefix}-timeline-label--${mode}`]: true,
      },
      className,
    );

    return (
      <TimelineContext.Provider value={{ theme, reverse, itemsStatus, layout, globalAlign: labelAlign, mode }}>
        <ul className={timelineClassName} style={style} ref={ref}>
          {React.Children.map(timelineItems, (ele: JSX.Element, index) =>
            React.cloneElement(ele, {
              index,
              className: classNames([ele?.props?.className], {
                [`${classPrefix}-timeline-item--last`]: index === itemsCounts - 1,
              }),
            }),
          )}
        </ul>
      </TimelineContext.Provider>
    );
  },
  {
    Item: TimelineItem,
  },
);

Timeline.displayName = 'Timeline';

export default Timeline;
