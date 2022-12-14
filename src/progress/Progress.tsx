import React, { forwardRef } from 'react';
import classNames from 'classnames';
import {
  CloseIcon as TdCloseIcon,
  CheckIcon as TdCheckIcon,
  ErrorIcon as TdErrorIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import getBackgroundColor from '../_util/linearGradient';
import { StyledProps } from '../common';
import { TdProgressProps } from './type';
import { progressDefaultProps } from './defaultProps';

export interface ProgressProps extends TdProgressProps, StyledProps {}
/**
 * 按钮组件
 */
const Progress = forwardRef((props: ProgressProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const {
    CheckCircleIcon,
    CloseCircleIcon,
    ErrorCircleIcon,
    CheckCircleFilledIcon,
    CloseCircleFilledIcon,
    ErrorCircleFilledIcon,
  } = useGlobalIcon({
    CheckCircleIcon: TdCheckIcon,
    CloseCircleIcon: TdCloseIcon,
    ErrorCircleIcon: TdErrorIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });

  const { theme, percentage, label, color = '', trackColor, strokeWidth, size, className } = props;
  let { status } = props;
  if (!status && percentage >= 100) {
    status = 'success';
  }
  let iconMap = {
    success: CheckCircleFilledIcon,
    error: CloseCircleFilledIcon,
    warning: ErrorCircleFilledIcon,
  };
  // 进度条展示内容
  const getInfoContent = () => {
    if (!label) {
      return '';
    }
    let info: React.ReactNode;
    // 为布尔值，默认百分百展示，否则之间展示 label 内容
    if (typeof label === 'boolean') {
      info = <div className={`${classPrefix}-progress__info`}>{`${percentage}%`}</div>;
      if (['success', 'error', 'warning'].includes(status)) {
        const Icon = iconMap[status];
        info = (
          <div className={`${classPrefix}-progress__info`}>
            <Icon className={`${classPrefix}-progress__icon`} />
          </div>
        );
      }
    } else {
      info = <div className={`${classPrefix}-progress__info`}>{label}</div>;
    }
    return info;
  };
  const statusClassName = `${classPrefix}-progress--status--${status}`;
  let progressDom;
  if (theme === 'circle') {
    iconMap = {
      success: CheckCircleIcon,
      error: CloseCircleIcon,
      warning: ErrorCircleIcon,
    };
    // 获取直径
    const getDiameter = (): number => {
      let diameter = 112;
      if (!size) {
        return diameter;
      }
      switch (size) {
        default:
          diameter = Number(size);
          break;
        case 'small':
          diameter = 72;
          break;
        case 'medium':
          diameter = 112;
          break;
        case 'large':
          diameter = 160;
          break;
      }
      return diameter;
    };
    // 获取环形进度条 环的宽度
    const getCircleStokeWidth = (): number => {
      if (!strokeWidth) {
        if (size === 'small') {
          return 4;
        }
      }
      if (typeof strokeWidth !== 'number' || Number.isNaN(strokeWidth)) {
        return 6;
      }
      return strokeWidth;
    };
    // 环形进度条尺寸(进度条占位空间，长宽占位)
    const circleStokeWidth = getCircleStokeWidth();
    // 直径
    const diameter = getDiameter();
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
      <div
        ref={ref}
        className={classNames(`${classPrefix}-progress--circle`, {
          [`${statusClassName}`]: status,
        })}
        style={circleBoxStyle}
      >
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
              className={`${classPrefix}-progress__circle-inner`}
              style={circlePathStyle}
            ></circle>
          )}
        </svg>
      </div>
    );
    return <div className={className}>{progressDom}</div>;
  }
  // 进度条轨道高度
  const getHeight = (): string => {
    if (strokeWidth) {
      return typeof strokeWidth === 'string' ? strokeWidth : `${strokeWidth}px`;
    }
  };
  const trackStyle = {
    height: getHeight(),
    backgroundColor: trackColor,
    borderRadius: getHeight(),
  } as React.CSSProperties;
  const barStyle = {
    width: `${percentage}%`,
    background: getBackgroundColor(color),
    borderRadius: getHeight(),
  } as React.CSSProperties;
  if (theme === 'plump') {
    const PLUMP_SEPARATE = 10;
    progressDom = (
      <div
        ref={ref}
        className={classNames(`${classPrefix}-progress__bar`, `${classPrefix}-progress--plump`, {
          [`${statusClassName}`]: status,
          [`${classPrefix}-progress--over-ten`]: percentage > PLUMP_SEPARATE,
          [`${classPrefix}-progress--under-ten`]: percentage <= PLUMP_SEPARATE,
        })}
        style={trackStyle}
      >
        {percentage > PLUMP_SEPARATE ? (
          <div className={`${classPrefix}-progress__inner`} style={barStyle}>
            {label && (
              <div className={`${classPrefix}-progress__info`} style={{ color: '#fff' }}>{`${percentage}%`}</div>
            )}
          </div>
        ) : (
          <>
            <div className={`${classPrefix}-progress__inner`} style={barStyle}></div>
            {getInfoContent()}
          </>
        )}
      </div>
    );
  } else {
    progressDom = (
      <div
        ref={ref}
        className={classNames(`${classPrefix}-progress--thin`, {
          [`${statusClassName}`]: status,
        })}
      >
        <div className={`${classPrefix}-progress__bar`} style={trackStyle}>
          <div className={`${classPrefix}-progress__inner`} style={barStyle}></div>
        </div>
        {getInfoContent()}
      </div>
    );
  }
  return (
    <div className={className} style={props.style}>
      {progressDom}
    </div>
  );
});

Progress.displayName = 'Progress';
Progress.defaultProps = progressDefaultProps;

export default Progress;
