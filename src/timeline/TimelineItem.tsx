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
}

const TimelineItem: React.FC<TimeLineItemProps> = (props) => {
  const { className, style = {}, color, dot, children, status = 'default', label } = props;
  const { theme } = useContext(TimelineContext);
  const { classPrefix } = useConfig();

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
    [`${classPrefix}-timeline-item__tail--status-${status}`]: true,
  });

  // 圆圈类名
  const dotClassName = classNames({
    [`${classPrefix}-timeline-item__dot`]: true,
    [`${classPrefix}-timeline-item__dot--custom`]: !!dot,
    [`${classPrefix}-timeline-item__dot--${status}`]: true,
  });

  const dotElement = useMemo(() => renderTNode(dot), [dot]);

  return (
    <li className={itemClassName} style={style}>
      {label && <div className={`${classPrefix}-timeline-item__label`}>{label}</div>}
      <div className={tailClassName} />
      <div className={dotClassName} style={{ borderColor: color }}>
        {!dotElement && status === 'process' && <Loading size="13px" />}
        {dotElement}
      </div>
      <div className={`${classPrefix}-timeline-item__content`}>{children}</div>
    </li>
  );
};

TimelineItem.displayName = 'TimelineItem';

export default TimelineItem;
