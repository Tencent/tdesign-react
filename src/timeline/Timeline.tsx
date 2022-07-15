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

const TimeLine = forwardRefWithStatics(
  (props: TimelineProps, ref: React.Ref<HTMLUListElement>) => {
    const { theme = 'default', align, children, className, style, reverse, layout = 'vertical' } = props;
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

    // 一些固定的class样式名
    const lastItemClassName = `${classPrefix}-timeline-item--last`;

    return (
      <TimelineContext.Provider value={{ theme }}>
        <ul className={timelineClassName} style={style} ref={ref}>
          {React.Children.map(timelineItems, (ele: React.ReactElement<any>, index) => {
            const readyClass = index === itemsCounts - 1 ? lastItemClassName : '';
            return React.cloneElement(ele, {
              className: classNames([ele.props.className, readyClass, getPositionClassName(index)]),
            });
          })}
        </ul>
      </TimelineContext.Provider>
    );
  },
  {
    Item: TimelineItem,
  },
);

TimeLine.displayName = 'TimeLine';

export default TimeLine;
