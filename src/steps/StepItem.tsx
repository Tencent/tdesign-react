import React, { useContext } from 'react';
import classnames from 'classnames';
import useConfig from '../_util/useConfig';
import ClearCircleIcon from '../icon/icons/ClearCircleIcon';
import CheckCircleFilledIcon from '../icon/icons/CheckCircleFilledIcon';
import { TdStepItemProps } from '../_type/components/steps';
import { StyledProps } from '../_type';
import StepsContext from './StepsContext';

export interface StepItemProps extends TdStepItemProps, StyledProps {
  /**
   * Step的额外的内容以子元素的形式传入
   */
  children?: React.ReactNode;
}

export default function StepItem(props: StepItemProps) {
  const { icon, title, content, value, children, style } = props;
  let { status } = props;

  const { current, currentStatus, theme } = useContext(StepsContext);
  const { classPrefix } = useConfig();

  // 本步骤组件主动设定了状态，那么以此为准
  if (!status) {
    if (value < current) {
      // 1. 本步骤序号小于当前步骤并且没有设定任何步骤序号，设定状态为 finish
      status = 'finish';
    } else if (value === current) {
      // 2. 本步骤序号等于当前步骤. 默认为process
      if (currentStatus) {
        status = currentStatus;
      } else {
        status = 'process';
      }
    } else {
      // 3. 本步骤序号大于当前步骤，默认为wait
      status = 'wait';
    }
  }

  const className = classnames({
    [`${classPrefix}-steps-item`]: true,
    [`${classPrefix}-steps-item--wait`]: status === 'wait',
    [`${classPrefix}-steps-item--error`]: status === 'error',
    [`${classPrefix}-steps-item--finish`]: status === 'finish',
    [`${classPrefix}-steps-item--process`]: status === 'process',
    [props.className]: !!props.className,
  });

  // 步骤条每一步展示的图标
  let iconEle = null;
  if (theme === 'default') {
    // 1. 主动
    if (icon) {
      iconEle = icon;
    } else {
      switch (status) {
        case 'error':
          iconEle = <ClearCircleIcon />;
          break;
        case 'finish':
          iconEle = <CheckCircleFilledIcon />;
          break;
        case 'wait':
        case 'process':
          iconEle = <span className={`${classPrefix}-steps-item-icon__number`}>{value}</span>;
          break;
      }
    }
  }

  return (
    <div className={className} style={style}>
      <div className={`${classPrefix}-steps-item__inner`}>
        <div className={`${classPrefix}-steps-item-icon`}>{iconEle}</div>
        <div className={`${classPrefix}-steps-item-content`}>
          <div className={`${classPrefix}-steps-item-title`}>{title}</div>
          <div className={`${classPrefix}-steps-item-description`}>{content}</div>
          {children ? <div className={`${classPrefix}-steps-item-extra`}>{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

StepItem.displayName = 'StepItem';
