import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TdTimelineItemProps } from './type';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import TimelineContext from './TimelineContext';
import parseTNode from '../_util/parseTNode';
import { useAlign } from './useAlign';
import Loading from '../loading';

export interface TimelineItemProps extends TdTimelineItemProps, StyledProps {
  children?: React.ReactNode;
  index?: number;
}

const DefaultTheme = ['default', 'primary', 'success', 'warning', 'error'];

const TimelineItem: React.FC<TimelineItemProps> = (props) => {
  const {
    className,
    style = {},
    dot,
    dotColor = 'primary',
    labelAlign,
    children,
    index,
    content,
    label,
    loading = false,
  } = props;
  const { theme, reverse, itemsStatus, layout, globalAlign, mode } = useContext(TimelineContext);
  const { classPrefix } = useConfig();
  const renderAlign = useAlign(globalAlign, layout);

  // 计算节点模式 CSS 类名
  const getPositionClassName = (index: number) => {
    // 横向布局 以及 纵向布局对应为不同的样式名
    const left = layout === 'horizontal' ? 'top' : 'left';
    const right = layout === 'horizontal' ? 'bottom' : 'right';
    // 单独设置则单独生效
    if (renderAlign === 'alternate') {
      return labelAlign || index % 2 === 0
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
    const ele = parseTNode(dot);

    if (React.isValidElement(ele)) {
      return React.cloneElement<any>(ele, {
        className: classNames(ele?.props?.className, `${classPrefix}-timeline-item__dot-content`),
      });
    }
    return ele;
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
    [`${classPrefix}-timeline-item__tail--status-${itemsStatus[index]}`]: reverse,
  });

  // 圆圈类名
  const dotClassName = classNames({
    [`${classPrefix}-timeline-item__dot`]: true,
    [`${classPrefix}-timeline-item__dot--custom`]: !!dotElement || (!dotElement && loading),
    [`${classPrefix}-timeline-item__dot--${dotColor}`]: DefaultTheme.includes(dotColor),
  });

  const labelClassName = classNames(`${classPrefix}-timeline-item__label`, {
    [`${classPrefix}-timeline-item__label--${mode}`]: true,
  });

  return (
    <li className={itemClassName} style={style}>
      {mode === 'alternate' && label && <div className={labelClassName}>{label}</div>}
      <div className={`${classPrefix}-timeline-item__wrapper`}>
        <div className={dotClassName} style={{ borderColor: !DefaultTheme.includes(dotColor) && dotColor }}>
          {!dotElement && loading && <Loading size="12px" className={`${classPrefix}-timeline-item__dot-content`} />}
          {dotElement}
        </div>
        <div className={tailClassName} />
      </div>
      <div className={`${classPrefix}-timeline-item__content`}>
        {content || children}
        {mode === 'same' && label && <div className={labelClassName}>{label}</div>}
      </div>
    </li>
  );
};

TimelineItem.displayName = 'TimelineItem';

export default TimelineItem;
