import React, { forwardRef } from 'react';
import {
  CheckLineIcon,
  ClearLineIcon,
  ErrorLineIcon,
  CheckCircleFilledIcon,
  ClearCircleFilledIcon,
  ErrorCircleFilledIcon,
} from '../icon';
import useConfig from '../_util/useConfig';
import getBackgroundColor from '../_util/linearGradient';
import { ProgressProps } from './ProgressProps';
/**
 * 按钮组件
 */
const Progress = forwardRef((props: ProgressProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    theme = 'line',
    percentage = 0,
    label = true,
    color = '',
    trackColor = '#f5f5f5',
    strokeWidth,
    size = 'middle',
    className,
  } = props;
  let { status } = props;
  if (!status) {
    status = percentage >= 100 ? 'success' : 'normal';
  }
  let iconMap = {
    success: CheckCircleFilledIcon,
    error: ClearCircleFilledIcon,
    warning: ErrorCircleFilledIcon,
  };
  const { classPrefix } = useConfig();
  // 进度条展示内容
  const getInfoContent = () => {
    if (!label) {
      return '';
    }
    let info;
    // 为布尔值，默认百分百展示，否则之间展示label内容
    if (typeof label === 'boolean') {
      info = <div className={`${classPrefix}-progress--info`}>{`${percentage}%`}</div>;
      if (['success', 'error', 'warning'].includes(status)) {
        const Icon = iconMap[status];
        info = (
          <div className={`${classPrefix}-progress--info`}>
            <Icon className={`${classPrefix}-progress--icon`} />
          </div>
        );
      }
    } else {
      info = <div className={`${classPrefix}-progress--info`}>{label}</div>;
    }
    return info;
  };
  let progressDom;
  if (theme === 'circle') {
    iconMap = {
      success: CheckLineIcon,
      error: ClearLineIcon,
      warning: ErrorLineIcon,
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
        case 'middle':
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
      if (typeof strokeWidth !== 'number' || isNaN(strokeWidth)) {
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

    const perimeter = Math.PI * 2 * (radius - circleStokeWidth);
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
    progressDom = (
      <div
        ref={ref}
        className={`${classPrefix}-progress--circle ${classPrefix}-progress--status--${status}`}
        style={circleBoxStyle}
      >
        {getInfoContent()}
        <svg width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`}>
          <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            strokeWidth={circleStokeWidth}
            stroke={trackColor}
            fill="none"
          ></circle>
          <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            strokeWidth={circleStokeWidth}
            fill="none"
            transform={`matrix(0,-1,1,0,0,${diameter})`}
            strokeDasharray={strokeDasharray}
            className={`${classPrefix}-circle--inner`}
            style={circlePathStyle}
          ></circle>
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
    progressDom = (
      <div
        ref={ref}
        className={`${classPrefix}-progress--bar ${classPrefix}-progress--plump ${classPrefix}-progress--status--${status}`}
        style={trackStyle}
      >
        <div className={`${classPrefix}-progress--inner`} style={barStyle}>
          {label && (
            <div
              className={`${classPrefix}-progress--info`}
              style={percentage > 10 ? { color: '#fff' } : { right: '-2.5em' }}
            >{`${percentage}%`}</div>
          )}
        </div>
      </div>
    );
  } else {
    progressDom = (
      <div ref={ref} className={`${classPrefix}-progress--thin ${classPrefix}-progress--status--${status}`}>
        <div className={`${classPrefix}-progress--bar`} style={trackStyle}>
          <div className={`${classPrefix}-progress--inner`} style={barStyle}></div>
        </div>
        {getInfoContent()}
      </div>
    );
  }
  return <div className={className}>{progressDom}</div>;
});

Progress.displayName = 'Progress';

export default Progress;
