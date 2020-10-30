import React, { forwardRef } from 'react';
import { PromptFillIcon, SuccessFillIcon, WarningFillIcon, CloseFillIcon } from '../icon';
import useConfig from '../_util/useConfig';

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
 * 除表格中列出的属性外，支持透传原生 `<button>` 标签支持的属性。
 */
export interface ProgressProps {
  /**
   * 主题类型
   * @default 'thin'
   */
  theme?: 'thin' | 'plump' | 'circle' | 'dashboard';

  /**
   * 百分比
   * @default 0
   */
  percentage: number;

  /**
   * 是否显示label，为boolean时，默认true
   * @default true
   */
  label?: React.ReactNode | boolean;

  /**
   * 进度条当前状态，success、error、warning、active(仅type=line可用）
   * @default 'normal'
   */
  status?: 'success' | 'error' | 'warning' | 'active' | 'normal';

  /**
   * 进度条的颜色，object的时候是渐变色
   * @default '#0052D9'
   */
  color?: 'string' | object;

  /**
   * 进度条未完成的颜色——轨道颜色
   * @default '#F5F5F5'
   */
  trackColor?: string;

  /**
   * 进度条线的宽度（轨道宽度），默认number单位px
   * @default 'middle'
   */
  strokeWidth?: number | string;

  /**
   * theme为circle，环形尺寸大小
   * @default 'default'
   */

  size?: number | 'large' | 'middle' | 'small';
  /**
   * 步骤进度条,步数
   */
  steps?: number;
  /**
   * class
   */
  className?: 'string';
}

/**
 * 按钮组件
 */
const Progress = forwardRef((props: ProgressProps) => {
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

  let progress;
  const { classPrefix } = useConfig();
  // 进度条轨道高度
  const getHeight = (): string => {
    if (strokeWidth) {
      return typeof strokeWidth === 'string' ? strokeWidth : `${strokeWidth}px`;
    }
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
  // 进度条颜色
  const getColor = (): string => color || colorMap[status];
  // 进度条展示内容
  const getInfoContent = () => {
    if (!label) {
      return '';
    }
    let info;
    // 为布尔值，默认百分百展示，否则之间展示label内容
    if (typeof label === 'boolean') {
      info = <div className={`${classPrefix}-progress--bar--info`}>{`${percentage}%`}</div>;
      if (['success', 'error', 'warning'].includes(status)) {
        const Icon = iconMap[status];
        info = (
          <div className={`${classPrefix}-progress--bar--info`}>
            <Icon className={`${classPrefix}-progress--icon`} />
          </div>
        );
      }
    } else {
      info = <div className={`${classPrefix}-progress--bar--info`}>{label}</div>;
    }
    return info;
  };
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
  const stroke = getCircleStokeWidth();
  const diameter = Number(getDiameter());
  const radius = diameter / 2;
  const innerRadius = radius - stroke;

  const perimeter = Math.PI * 2 * (radius - stroke);
  const percent = percentage / 100;
  const strokeDasharray = `${perimeter * percent}  ${perimeter * (1 - percent)}`;
  const fontSize = innerRadius * 0.17;
  const circleStyle = {
    width: diameter,
    height: diameter,
    fontSize: 6 + fontSize,
  } as React.CSSProperties;
  const trackStyle = { height: getHeight(), backgroundColor: trackColor } as React.CSSProperties;
  const barStyle = { width: `${percentage}%`, backgroundColor: color } as React.CSSProperties;
  switch (theme) {
    case 'circle':
    case 'dashboard':
      progress = (
        <div
          className={`${classPrefix}-progress--circle ${classPrefix}-progress--status--${status}`}
          style={circleStyle}
        >
          <svg width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`}>
            <circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              strokeWidth={stroke}
              stroke={trackColor}
              fill="none"
            ></circle>
            <circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              strokeWidth={stroke}
              stroke={getColor()}
              fill="none"
              transform={`matrix(0,-1,1,0,0,${diameter})`}
              strokeDasharray={strokeDasharray}
            ></circle>
          </svg>
          {getInfoContent()}
        </div>
      );
      break;
    case 'plump':
      if (percentage > 10) {
      }
      progress = (
        <div
          className={`${classPrefix}-progress--bar ${classPrefix}-progress--plump ${classPrefix}-progress--status--${status}`}
          style={trackStyle}
        >
          <div className={`${classPrefix}-progress--bar--inner`} style={barStyle}>
            {label && (
              <div
                className={`${classPrefix}-progress--bar--info`}
                style={percentage > 10 ? { color: '#fff' } : { right: '-2.5em' }}
              >{`${percentage}%`}</div>
            )}
          </div>
        </div>
      );
      break;
    case 'thin':
    default:
      progress = (
        <div className={`${classPrefix}-progress--thin ${classPrefix}-progress--status--${status}`}>
          <div className={`${classPrefix}-progress--bar`} style={trackStyle}>
            <div className={`${classPrefix}-progress--bar--inner`} style={barStyle}></div>
          </div>
          {getInfoContent()}
        </div>
      );
      break;
  }
  return <div className={className}>{progress}</div>;
});

Progress.displayName = 'Progress';

export default Progress;
