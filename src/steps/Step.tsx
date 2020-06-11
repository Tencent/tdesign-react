import React, { useContext } from 'react';
import classnames from 'classnames';
import { StepProps } from './StepsProps';
import { StepsContext } from './StepsContext';
import { useConfig } from '../_util/use-config';
import { Icon } from '../icon/IconFont';

export default function Step(props: StepProps & { stepNumber?: number }) {
  const { icon, title, content, stepNumber, children, style } = props;
  let { status } = props;

  const { current, currentStatus, type } = useContext(StepsContext);
  const { classPrefix } = useConfig();

  // 本步骤组件主动设定了状态，那么以此为准
  if (!status) {
    if (stepNumber < current) {
      // 1. 本步骤序号小于当前步骤并且没有设定任何步骤序号，设定状态为 finish

      status = 'finish';
    } else if (stepNumber === current) {
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
  let iconEle: React.ReactNode = null;
  if (type === 'default') {
    // 1. 主动
    if (icon) {
      if (typeof icon === 'string') {
        iconEle = <Icon name={icon} />;
      } else {
        iconEle = icon;
      }
    } else {
      switch (status) {
        case 'error':
          iconEle = <Icon name="close-fill" />;
          break;
        case 'finish':
          iconEle = <Icon name="success-fill" />;
          break;
        case 'wait':
        case 'process':
          iconEle = (
            <span className={`${classPrefix}-steps-item-icon__number`}>
              {stepNumber}
            </span>
          );
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
          <div className={`${classPrefix}-steps-item-description`}>
            {content}
          </div>
          {children ? (
            <div className={`${classPrefix}-steps-item-extra`}>{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
