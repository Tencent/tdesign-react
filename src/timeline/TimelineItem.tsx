import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TdTimeLineItemProps } from './type';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import TimelineContext from './TimelineContext';
import renderTNode from '../_util/renderTNode';
import Loading from '../loading';
import { useAlign } from './useAlign';

export interface TimeLineItemProps extends TdTimeLineItemProps, StyledProps {
  children?: React.ReactNode;
  index?: number;
}

const TimelineItem: React.FC<TimeLineItemProps> = (props) => {
  const { className, style = {}, color, dot, children, index, status = 'default', time, content, align } = props;
  const { theme, reverse, itemsStatus, layout, globalAlign } = useContext(TimelineContext);
  const { classPrefix } = useConfig();
  const renderAlign = useAlign(globalAlign, layout);

  // 计算节点模式 CSS 类名
  const getPositionClassName = (index: number) => {
    // 横向布局 以及 纵向布局对应为不同的样式名
    const left = layout === 'horizontal' ? 'top' : 'left';
    const right = layout === 'horizontal' ? 'bottom' : 'right';
    // 单独设置则单独生效
    if (renderAlign === 'alternate') {
      return align || index % 2 === 0
        ? `${classPrefix}-timeline-item-${left}`
        : `${classPrefix}-timeline-item-${right}`;
    }
    if (renderAlign === 'left' || renderAlign === 'top') {
      return `${classPrefix}-timeline-item-${left}`;
    }
    if (renderAlign === 'right' || renderAlign === 'bottom') {
      return `${classPrefix}-timeline-item-${right}`;
    }
    return '';
  };

  const dotElement = useMemo(() => {
    const ele = renderTNode(dot);
    return (
      ele &&
      React.cloneElement(ele, {
        className: classNames(ele?.props?.className, `${classPrefix}-timeline-item__dot-content`),
      })
    );
  }, [dot, classPrefix]);

  // 节点类名
  const itemClassName = classNames(
    {
      [`${classPrefix}-timeline-item`]: true,
      [`${getPositionClassName(index)}`]: true,
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
    [`${classPrefix}-timeline-item__dot--custom`]: !!dotElement || (!dotElement && status === 'process'),
    [`${classPrefix}-timeline-item__dot--${status}`]: true,
  });

  return (
    <li className={itemClassName} style={style}>
      {time && <div className={`${classPrefix}-timeline-item__time`}>{time}</div>}
      <div className={`${classPrefix}-timeline-item__wrapper`}>
        <div className={dotClassName} style={{ borderColor: color }}>
          {!dotElement && status === 'process' && (
            <Loading size="12px" className={`${classPrefix}-timeline-item__dot-content`} />
          )}
          {dotElement}
        </div>
        <div className={tailClassName} />
      </div>
      <div className={`${classPrefix}-timeline-item__content`}>{content || children}</div>
    </li>
  );
};

TimelineItem.displayName = 'TimelineItem';

export default TimelineItem;
