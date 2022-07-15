import classNames from 'classnames';
import React from 'react';
import { StyledProps } from '../common';
import useConfig from '../_util/useConfig';
import TimelineItem from './TimelineItem';
import { TdTimeLineProps } from './type';
import TimelineContext from './TimelineContext';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';

export interface TimelineProps extends TdTimeLineProps, StyledProps {
  children?: React.ReactNode;
}

const Timeline = forwardRefWithStatics(
  (props: TimelineProps, ref: React.Ref<HTMLUListElement>) => {
    const { theme = 'default', align, children, className, style, reverse = false, layout = 'vertical' } = props;
    const { classPrefix } = useConfig();

    const timelineClassName = classNames(
      `${classPrefix}-timeline`,
      {
        [`${classPrefix}-timeline-reverse`]: reverse,
        [`${classPrefix}-timeline-${layout}`]: true,
      },
      className,
    );

    const timelineItems = React.Children.toArray(children).filter(
      (child: JSX.Element) => child.type.displayName === TimelineItem.displayName,
    );
    // 获取所有子节点类型
    const itemsStatus = React.Children.map(timelineItems, (child: JSX.Element) => child.props.status || 'default');

    if (reverse) {
      timelineItems.reverse();
    }

    const itemsCounts = React.Children.count(timelineItems);

    // 计算节点模式 CSS 类名
    const getPositionClassName = (index: number) => {
      if (align === 'alternate') {
        return index % 2 === 0 ? `${classPrefix}-timeline-item-left` : `${classPrefix}-timeline-item-right`;
      }
      if (align === 'left') {
        return `${classPrefix}-timeline-item-left`;
      }
      if (align === 'right') {
        return `${classPrefix}-timeline-item-right`;
      }
      return '';
    };

    return (
      <TimelineContext.Provider value={{ theme, reverse, itemsStatus }}>
        <ul className={timelineClassName} style={style} ref={ref}>
          {React.Children.map(timelineItems, (ele: JSX.Element, index) =>
            React.cloneElement(ele, {
              index,
              className: classNames([ele.props.className, getPositionClassName(index)], {
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
