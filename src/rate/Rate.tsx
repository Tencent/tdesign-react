import React, { MouseEvent, useState, forwardRef } from 'react';
import classNames from 'classnames';
import { StarFilledIcon as TdStarFilledIcon } from 'tdesign-icons-react';
import { TooltipLite } from '../tooltip';
import { TdRateProps } from './type';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useControlled from '../hooks/useControlled';
import { rateDefaultProps } from './defaultProps';

export interface RateProps extends TdRateProps, StyledProps {}

const Rate = forwardRef((props: RateProps, ref: React.Ref<HTMLDivElement>) => {
  const { allowHalf, color, count, disabled, gap, showText, size, texts, icon, className, style, onChange } = props;

  const { classPrefix } = useConfig();
  const { StarFilledIcon } = useGlobalIcon({ StarFilledIcon: TdStarFilledIcon });
  const [starValue = 0, setStarValue] = useControlled(props, 'value', onChange);

  const [hoverValue = undefined, setHoverValue] = useState<number | undefined>(undefined);
  const displayValue = hoverValue || starValue;
  const rootRef = React.useRef(null);

  const activeColor = Array.isArray(color) ? color[0] : color;
  const defaultColor = Array.isArray(color) ? color[1] : 'var(--td-bg-color-component)';

  // 评分图标
  const RateIcon = (props: any) => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, props);
    }
    return <StarFilledIcon {...props} />;
  };

  const getStarValue = (event: MouseEvent<HTMLElement>, index: number) => {
    if (allowHalf) {
      const rootNode = rootRef.current;
      const { left } = rootNode.getBoundingClientRect();
      const firstStar = rootNode.firstChild as HTMLElement;
      const { width } = firstStar.getBoundingClientRect();
      const { clientX } = event;
      const starMiddle = width * (index - 0.5) + gap * (index - 1);
      if (clientX - left >= starMiddle) return index;
      if (clientX - left < starMiddle) return index - 0.5;
    }

    return index;
  };

  const mouseEnterHandler = (event: MouseEvent<HTMLElement>, index: number) => {
    if (disabled) return;
    setHoverValue(getStarValue(event, index));
  };

  const mouseLeaveHandler = () => {
    if (disabled) return;
    setHoverValue(undefined);
  };

  const clickHandler = (event: MouseEvent<HTMLElement>, index: number) => {
    if (disabled) return;
    setStarValue(getStarValue(event, index));
  };

  const getStarCls = (index: number) => {
    if (allowHalf && index + 0.5 === displayValue) return `${classPrefix}-rate__item--half`;
    if (index >= displayValue) return '';
    if (index < displayValue) return `${classPrefix}-rate__item--full`;
  };

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(`${classPrefix}-rate`, className)}
      onMouseLeave={mouseLeaveHandler}
    >
      <ul className={`${classPrefix}-rate__list`} style={{ gap }} ref={rootRef}>
        {[...Array(count)].map((_, index) => (
          <li
            key={index}
            className={classNames(`${classPrefix}-rate__item`, getStarCls(index))}
            onClick={(event) => clickHandler(event, index + 1)}
            onMouseMove={(event) => mouseEnterHandler(event, index + 1)}
          >
            {showText ? (
              <TooltipLite key={index} content={texts[displayValue - 1]}>
                <div className={`${classPrefix}-rate__star-top`}>
                  <RateIcon size={size} color={activeColor} />
                </div>
                <div className={`${classPrefix}-rate__star-bottom`}>
                  <RateIcon size={size} color={defaultColor} />
                </div>
              </TooltipLite>
            ) : (
              <>
                <div className={`${classPrefix}-rate__star-top`}>
                  <RateIcon size={size} color={activeColor} />
                </div>
                <div className={`${classPrefix}-rate__star-bottom`}>
                  <RateIcon size={size} color={defaultColor} />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {showText && <div className={`${classPrefix}-rate__text`}>{texts[displayValue - 1]}</div>}
    </div>
  );
});

Rate.displayName = 'Rate';
Rate.defaultProps = rateDefaultProps;

export default Rate;
