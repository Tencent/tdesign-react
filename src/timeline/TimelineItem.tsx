import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TdTimeLineItemProps } from './type';
import { StyledProps } from '../common';
import useConfig from '../_util/useConfig';
import TimelineContext from './TimelineContext';
import renderTNode from '../_util/renderTNode';
import Loading from '../loading';

export interface TimeLineItemProps extends TdTimeLineItemProps, StyledProps {
  children?: React.ReactNode;
  index?: number;
}

const TimelineItem: React.FC<TimeLineItemProps> = (props) => {
  const { className, style = {}, color, dot, children, index, status = 'default', time } = props;
  const { theme, reverse, itemsStatus } = useContext(TimelineContext);
  const { classPrefix } = useConfig();

  const dotElement = useMemo(() => renderTNode(dot), [dot]);

  // 节点类名
  const itemClassName = classNames(
    {
      [`${classPrefix}-timeline-item`]: true,
    },
    className,
  );

  // 连线类名
  const tailClassName = classNames({
    [`${classPrefix}-timeline-item__tail`]: true,
    [`${classPrefix}-timeline-item__tail--theme-${theme}`]: true,
    [`${classPrefix}-timeline-item__tail--status-${reverse ? itemsStatus[index] : status}`]: true,
  });

  // 圆圈类名
  const dotClassName = classNames({
    [`${classPrefix}-timeline-item__dot`]: true,
    [`${classPrefix}-timeline-item__dot--custom`]: !!dotElement,
    [`${classPrefix}-timeline-item__dot--${status}`]: true,
  });

  return (
    <li className={itemClassName} style={style}>
      {time && <div className={`${classPrefix}-timeline-item__time`}>{time}</div>}
      <div className={`${classPrefix}-timeline-item__wrapper`}>
        <div className={dotClassName} style={{ borderColor: color }}>
          {!dotElement && status === 'process' && <Loading size="12px" />}
          {dotElement}
        </div>
        <div className={tailClassName} />
      </div>
      <div className={`${classPrefix}-timeline-item__content`}>{children}</div>
    </li>
  );
};

TimelineItem.displayName = 'TimelineItem';

export default TimelineItem;
