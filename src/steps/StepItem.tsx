import React, { useContext } from 'react';
import classnames from 'classnames';
import { CloseIcon, CheckIcon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import { TdStepItemProps } from './type';
import { StyledProps } from '../common';
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

  const { current, theme } = useContext(StepsContext);
  const { classPrefix } = useConfig();

  // 本步骤组件主动设定了状态，那么以此为准
  if (!status) {
    if (value < current) {
      // 1. 本步骤序号小于当前步骤并且没有设定任何步骤序号，设定状态为 finish
      status = 'finish';
    } else if (value === current) {
      // 2. 本步骤序号等于当前步骤. 默认为process
      status = 'process';
    } else {
      // 3. 本步骤序号大于当前步骤，默认为wait
      status = 'default';
    }
  }

  const className = classnames({
    [`${classPrefix}-steps-item`]: true,
    [`${classPrefix}-steps-item--wait`]: status === 'default',
    [`${classPrefix}-steps-item--error`]: status === 'error',
    [`${classPrefix}-steps-item--finish`]: status === 'finish',
    [`${classPrefix}-steps-item--process`]: status === 'process',
    [props.className]: !!props.className,
  });

  const valueNum = Number(value);

  // 步骤条每一步展示的图标
  let iconEle = null;
  // 1. 主动
  // 用户自定义 icon 时优先级最高
  if (icon) {
    iconEle = icon;
  } else if (theme === 'default') {
    // 否则 根据 theme 决定是否展示默认 icon，dot 情况下不展示 icon
    switch (status) {
      case 'error':
        iconEle = (
          <span className={`${classPrefix}-steps-item__icon--number`}>
            <CloseIcon />
          </span>
        );
        break;
      case 'finish':
        iconEle = (
          <span className={`${classPrefix}-steps-item__icon--number`}>
            <CheckIcon />
          </span>
        );
        break;
      case 'default':
      case 'process':
        iconEle = (
          <span className={`${classPrefix}-steps-item__icon--number`}>
            {Number.isNaN(valueNum) ? value : valueNum + 1}
          </span>
        );
        break;
    }
  } else {
    iconEle = null;
  }

  return (
    <div className={className} style={style}>
      <div className={`${classPrefix}-steps-item__inner`}>
        <div
          className={`${classPrefix}-steps-item__icon ${status === 'finish' ? `${classPrefix}-steps-item-finish` : ''}`}
        >
          {iconEle}
        </div>
        <div className={`${classPrefix}-steps-item__content`}>
          <div className={`${classPrefix}-steps-item__title`}>{title}</div>
          <div className={`${classPrefix}-steps-item__description`}>{content}</div>
          {children ? <div className={`${classPrefix}-steps-item__extra`}>{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

StepItem.displayName = 'StepItem';
