import React, { MouseEvent, useState, useCallback } from 'react';
import Tooltip from '../tooltip';
import { TdRateProps } from './type';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import { rateDefaultProps } from './defaultProps';

const getFilledStarSvg = (size) => (
  <svg fill="none" viewBox={`0 0 16 16`} width={`${size}`} height={`${size}`}>
    <path
      fill="currentColor"
      d="M7.73 1.55a.3.3 0 01.54 0l1.94 3.92 4.32.62a.3.3 0 01.17.52l-3.13 3.05.74 4.3a.3.3 0 01-.44.32L8 12.25l-3.87 2.03a.3.3 0 01-.43-.31l.73-4.31L1.3 6.6a.3.3 0 01.17-.52l4.33-.62 1.93-3.92z"
      fillOpacity="0.9"
    ></path>
  </svg>
);

const getFilledHalfStarSvg = (size) => (
  <svg fill="none" viewBox={`0 0 16 16`} width={`${size}`} height={`${size}`}>
    <defs>
      <linearGradient id="half_grad">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="white" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path
      fill="url(#half_grad)"
      d="M7.73 1.55a.3.3 0 01.54 0l1.94 3.92 4.32.62a.3.3 0 01.17.52l-3.13 3.05.74 4.3a.3.3 0 01-.44.32L8 12.25l-3.87 2.03a.3.3 0 01-.43-.31l.73-4.31L1.3 6.6a.3.3 0 01.17-.52l4.33-.62 1.93-3.92z"
      fillOpacity="0.9"
    ></path>
  </svg>
);

export type RateProps = TdRateProps;
const Rate = (props: RateProps) => {
  const {
    allowHalf, // 是否允许半选
    color, // 评分图标的颜色，样式中默认为 #ED7B2F。一个值表示设置选中高亮的五角星颜色，两个值表示分别设置 选中高亮的五角星颜色 和 未选中暗灰的五角星颜色。示例：['#ED7B2F', '#999999']
    count, // 评分的数量
    disabled, // 是否禁用评分
    gap, // 评分图标的间距
    showText, // 是否显示对应的辅助文字
    size, // 评分图标的大小，示例：`20`
    texts, // 自定义评分等级对应的辅助文字。组件内置默认值为：['极差', '失望', '一般', '满意', '惊喜']。自定义值示例：['1分', '2分', '3分', '4分', '5分']
    onChange,
  } = props;
  const [starValue = 0, setStarValue] = useControlled(props, 'value', onChange);

  const [hoverValue = undefined, setHoverValue] = useState<number | undefined>(undefined);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { classPrefix } = useConfig();

  const getStarValue = (event: MouseEvent<HTMLDivElement>, index: number) => {
    if (allowHalf) {
      const rootNode = rootRef.current;
      const { left } = rootNode.getBoundingClientRect();
      const firstStar = rootNode.firstChild as HTMLElement;
      const { width } = firstStar.getBoundingClientRect();
      const { clientX } = event;
      const starMiddle = width * (index - 0.5) + gap * (index - 1);
      if (clientX - left < starMiddle) {
        return index - 0.5;
      }
      if (clientX - left >= starMiddle) {
        return index;
      }
    } else {
      return index;
    }
  };

  const mouseEnterHandler = (event: MouseEvent<HTMLDivElement>, index: number) => {
    setHoverValue(getStarValue(event, index));
  };

  const mouseLeaveHandler = () => {
    setHoverValue(undefined);
  };

  const clickHandler = (event: MouseEvent<HTMLDivElement>, index: number) => {
    setStarValue(getStarValue(event, index));
  };

  const getStarStyle = useCallback(
    (index: number, count: number, displayValue: number): React.CSSProperties => {
      const filledColor = Array.isArray(color) ? color[0] : color || '#ED7B2F';
      const defaultColor = Array.isArray(color) ? color[1] : '#E7E7E7';
      return {
        marginRight: index < count - 1 ? gap : '',
        width: size,
        height: size,
        color: index < displayValue ? filledColor : defaultColor,
      };
    },
    [size, color, gap],
  );

  const getStar = useCallback(
    (allowHalf: boolean, index: number, displayValue: number) => {
      if (allowHalf && index + 0.5 === displayValue) {
        return getFilledHalfStarSvg(size);
      }
      if (index >= displayValue) {
        return getFilledStarSvg(size);
      }
      if (index < displayValue) {
        return getFilledStarSvg(size);
      }
    },
    [size],
  );
  const displayValue = hoverValue || starValue;
  return (
    <div className={`${classPrefix}-rate`} ref={rootRef} onMouseLeave={() => !disabled && mouseLeaveHandler()}>
      {[...Array(count)].map((_, index) =>
        showText ? (
          <Tooltip key={index} content={texts[displayValue - 1]} className={`${classPrefix}-rate__wrapper`}>
            <div
              key={index}
              onMouseMove={(event) => !disabled && mouseEnterHandler(event, index + 1)}
              onClick={(event) => !disabled && clickHandler(event, index + 1)}
              style={getStarStyle(index, count, displayValue)}
              className={`${classPrefix}-rate__wrapper`}
            >
              {getStar(allowHalf, index, displayValue)}
            </div>
          </Tooltip>
        ) : (
          <div
            key={index}
            onMouseMove={(event) => !disabled && mouseEnterHandler(event, index + 1)}
            onClick={(event) => !disabled && clickHandler(event, index + 1)}
            style={getStarStyle(index, count, displayValue)}
            className={`${classPrefix}-rate__wrapper`}
          >
            {getStar(allowHalf, index, displayValue)}
          </div>
        ),
      )}
      {showText && <div className={`${classPrefix}-rate__text`}>{texts[displayValue - 1]}</div>}
    </div>
  );
};

Rate.displayName = 'Rate';
Rate.defaultProps = rateDefaultProps;

export default Rate;
