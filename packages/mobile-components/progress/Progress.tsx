import React, { forwardRef } from 'react';
import classNames from 'classnames';
import {
  CloseIcon,
  CheckIcon,
  ErrorIcon,
  CheckCircleFilledIcon,
  CloseCircleFilledIcon,
  ErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import { isString } from 'lodash-es';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import { TdProgressProps } from './type';
import useConfig from '../hooks/useConfig';
import getBackgroundColor from '../_util/linearGradient';
import { progressDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { PRO_THEME, STATUS_ICON } from '../_common/js/progress/const';
import { getDiameter, getCircleStokeWidth } from '../_common/js/progress/utils';
import { PLUMP_SEPARATE } from './constants';

export interface ProgressProps extends TdProgressProps, StyledProps {
  children?: React.ReactNode;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const progressClass = `${classPrefix}-progress`;

  const { theme, percentage, label, color, trackColor, strokeWidth, className, style, status, size } =
    useDefaultProps<ProgressProps>(props, progressDefaultProps);

  const computedStatus = percentage >= 100 ? 'success' : status || 'default';
  const statusClassName = `${progressClass}--status-${computedStatus}`;

  const getIconMap = () => {
    const CIRCLE_ICONS = {
      success: CheckIcon,
      warning: ErrorIcon,
      error: CloseIcon,
    };
    const NORMAL_ICONS = {
      success: CheckCircleFilledIcon,
      warning: ErrorCircleFilledIcon,
      error: CloseCircleFilledIcon,
    };
    return props.theme === PRO_THEME.CIRCLE ? CIRCLE_ICONS : NORMAL_ICONS;
  };

  // 进度条展示内容
  const getInfoContent = () => {
    if (!label) {
      return '';
    }
    let info: React.ReactNode;
    // 为布尔值，默认百分百展示，否则之间展示 label 内容
    if (typeof label === 'boolean') {
      info = <div className={`${progressClass}__info`}>{`${percentage}%`}</div>;
      if (STATUS_ICON.includes(status) && theme !== PRO_THEME.PLUMP) {
        const icons = getIconMap();
        const Icon = icons[status];
        info = (
          <div className={`${progressClass}__info`}>
            <Icon className={`${progressClass}__icon`} />
          </div>
        );
      }
    } else {
      info = <div className={`${progressClass}__info`}>{parseTNode(label)}</div>;
    }
    return info;
  };

  // 进度条轨道高度
  const getHeight = (): string => {
    if (strokeWidth) {
      return isString(strokeWidth) ? strokeWidth : `${strokeWidth}px`;
    }
  };

  const trackStyle = () => {
    const style: React.CSSProperties = {};
    if (strokeWidth) {
      const height = getHeight();
      style.height = height;
      style.borderRadius = height;
    }
    if (trackColor) {
      style.backgroundColor = trackColor;
    }
    return style;
  };

  const barStyle = {
    width: `${percentage}%`,
    background: getBackgroundColor(color),
  } as React.CSSProperties;

  let progressDom: React.ReactNode;

  if (theme === PRO_THEME.PLUMP) {
    const separateClasses = percentage > PLUMP_SEPARATE ? `${progressClass}--over-ten` : `${progressClass}--under-ten`;

    progressDom = (
      <div
        ref={ref}
        className={classNames(
          `${progressClass}__bar`,
          `${progressClass}--plump`,
          `${separateClasses}`,
          `${statusClassName}`,
        )}
        style={trackStyle()}
      >
        <div className={`${progressClass}__inner`} style={barStyle}>
          {percentage > PLUMP_SEPARATE && getInfoContent()}
        </div>

        {percentage <= PLUMP_SEPARATE && getInfoContent()}
      </div>
    );
  } else if (theme === PRO_THEME.CIRCLE) {
    // 环形进度条尺寸(进度条占位空间，长宽占位)
    const circleStokeWidth = getCircleStokeWidth(strokeWidth, size);
    // 直径
    const diameter = getDiameter(size);
    // 半径
    const radius = diameter / 2;
    // 内环半径
    const innerRadius = radius - circleStokeWidth;

    const perimeter = Math.PI * 2 * radius;
    const percent = percentage / 100;
    const strokeDasharray = `${perimeter * percent}  ${perimeter * (1 - percent)}`;

    // 自适应文字，根据半路，适度调整
    const fontSizeRatio = innerRadius * 0.27;

    const circleBoxStyle = {
      width: diameter,
      height: diameter,
      fontSize: 4 + fontSizeRatio,
    } as React.CSSProperties;

    const circlePathStyle = {
      stroke: color,
      strokeLinecap: circleStokeWidth < 30 ? 'round' : 'buff',
    } as React.CSSProperties;

    const circleCenterInViewBox = radius + circleStokeWidth / 2;

    progressDom = (
      <div ref={ref} className={classNames(`${progressClass}--circle`, `${statusClassName}`)} style={circleBoxStyle}>
        {getInfoContent()}
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter + circleStokeWidth} ${diameter + circleStokeWidth}`}
        >
          <circle
            cx={circleCenterInViewBox}
            cy={circleCenterInViewBox}
            r={radius}
            strokeWidth={circleStokeWidth}
            stroke={trackColor || 'var(--td-bg-color-component)'}
            fill="none"
            className={`${progressClass}__circle-outer`}
          ></circle>
          {percentage > 0 && (
            <circle
              cx={circleCenterInViewBox}
              cy={circleCenterInViewBox}
              r={radius}
              strokeWidth={circleStokeWidth}
              fill="none"
              transform={`matrix(0,-1,1,0,0,${diameter + circleStokeWidth})`}
              strokeDasharray={strokeDasharray}
              className={`${progressClass}__circle-inner`}
              style={circlePathStyle}
            ></circle>
          )}
        </svg>
      </div>
    );
    return <div className={className}>{progressDom}</div>;
  } else {
    progressDom = (
      <div ref={ref} className={classNames(`${progressClass}--thin`, `${statusClassName}`)}>
        <div className={`${progressClass}__bar`} style={trackStyle()}>
          <div className={`${progressClass}__inner`} style={barStyle}></div>
        </div>
        {getInfoContent()}
      </div>
    );
  }

  return (
    <div className={classNames(`${progressClass}`, className)} style={style}>
      {progressDom}
    </div>
  );
});

Progress.displayName = 'Progress';

export default Progress;
