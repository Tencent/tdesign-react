import React, { forwardRef } from 'react';
import { PromptFillIcon, SuccessFillIcon, WarningFillIcon, CloseFillIcon } from '../icon';
import useConfig from '../_util/useConfig';
import getBackgroundColor from '../_util/linearGradient';
import { ProgressProps } from './ProgressProps';

const iconMap = {
  success: SuccessFillIcon,
  normal: PromptFillIcon,
  error: CloseFillIcon,
  warning: WarningFillIcon,
};
const colorMap = {
  success: '#35CD35',
  normal: '#0052D9',
  error: '#FF3E00',
  warning: '#FFAA00',
};

/**
 * 按钮组件
 */
const Progress = forwardRef((props: ProgressProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    theme = 'line',
    percentage = 30,
    label = true,
    status = 'normal',
    color = '',
    trackColor = '#f5f5f5',
    strokeWidth,
    size = 'middle',
    className,
  } = props;

  const { classPrefix } = useConfig();
  // 进度条轨道高度
  const getHeight = (): string => {
    if (strokeWidth) {
      return typeof strokeWidth === 'string' ? strokeWidth : `${strokeWidth}px`;
    }
  };
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
  const trackStyle = { height: getHeight(), backgroundColor: trackColor } as React.CSSProperties;
  const barStyle = { width: `${percentage}%`, background: getBackgroundColor(color) } as React.CSSProperties;
  // 进度条颜色
  const circleBarColor = color || colorMap[status];
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
  // 获取环形进度条 环形宽度
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
  // 环形进度条 环形宽度
  const circleStokeWidth = getCircleStokeWidth();
  const diameter = getDiameter();
  const radius = diameter / 2;
  const innerRadius = radius - circleStokeWidth;

  const perimeter = Math.PI * 2 * (radius - circleStokeWidth);
  const percent = percentage / 100;
  const strokeDasharray = `${perimeter * percent}  ${perimeter * (1 - percent)}`;
  const fontSizeRatio = innerRadius * 0.27;
  const circleStyle = {
    width: diameter,
    height: diameter,
    fontSize: 4 + fontSizeRatio,
  } as React.CSSProperties;
  let progressDom;
  switch (theme) {
    case 'circle':
      // case 'dashboard':
      progressDom = (
        <div
          ref={ref}
          className={`${classPrefix}-progress--circle ${classPrefix}-progress--status--${status}`}
          style={circleStyle}
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
              stroke={circleBarColor}
              fill="none"
              transform={`matrix(0,-1,1,0,0,${diameter})`}
              strokeDasharray={strokeDasharray}
            ></circle>
          </svg>
        </div>
      );
      break;
    case 'plump':
      if (percentage > 10) {
      }
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
      break;
    case 'thin':
    default:
      progressDom = (
        <div ref={ref} className={`${classPrefix}-progress--thin ${classPrefix}-progress--status--${status}`}>
          <div className={`${classPrefix}-progress--bar`} style={trackStyle}>
            <div className={`${classPrefix}-progress--inner`} style={barStyle}></div>
          </div>
          {getInfoContent()}
        </div>
      );
      break;
  }
  return <div className={className}>{progressDom}</div>;
});

Progress.displayName = 'Progress';

export default Progress;
