import React, { type CSSProperties, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { SLIDER_DEFAULT_WIDTH } from '@tdesign/common-js/color-picker/constants';
import useMouseEvent, { type MouseCoordinate } from '../../../hooks/useMouseEvent';
import useStyles from '../../hooks/useStyles';
import type { TdColorBaseProps } from '../../interface';

export interface TdColorSliderProps extends TdColorBaseProps {
  className?: string;
  value?: Number;
  maxValue?: Number;
  railStyle?: CSSProperties;
  type: 'hue' | 'alpha';
}

const ColorSlider = (props: TdColorSliderProps) => {
  const {
    color,
    className = '',
    value = 0,
    railStyle = {},
    maxValue = 360,
    baseClassName,
    disabled,
    onChange,
    type,
  } = props;
  const panelRef = useRef<HTMLDivElement>(null);
  const panelRectRef = useRef({
    width: SLIDER_DEFAULT_WIDTH,
  });
  const { styles } = useStyles({ color, value, maxValue, type }, panelRectRef);

  const handleDrag = (coordinate: MouseCoordinate) => {
    if (disabled) return;
    const { width } = panelRectRef.current;
    const { x } = coordinate;
    const value = Math.round((x / width) * Number(maxValue) * 100) / 100;
    onChange(value);
  };

  useMouseEvent(panelRef, {
    onStart: (_, ctx) => {
      // pop 模式下由于是隐藏显示，这个宽度让其每次点击的时候重新计算
      panelRectRef.current.width = panelRef.current.offsetWidth;
      handleDrag(ctx.coordinate);
    },
    onMove: (_, ctx) => {
      handleDrag(ctx.coordinate);
    },
    onEnd: (_, ctx) => {
      if (disabled) return;
      handleDrag(ctx.coordinate);
    },
  });

  useEffect(() => {
    panelRectRef.current.width = panelRef.current.offsetWidth || SLIDER_DEFAULT_WIDTH;
  }, []);

  const paddingStyle = {
    background: `linear-gradient(90deg, rgba(0,0,0,.0) 0%, rgba(0,0,0,.0) 93%, ${props.color.rgb} 93%, ${props.color.rgb} 100%)`,
  };

  return (
    <div className={classnames(`${baseClassName}__slider-wrapper`, `${baseClassName}__slider-wrapper--${type}-type`)}>
      {type === 'alpha' && <div className={`${baseClassName}__slider-padding`} style={paddingStyle} />}
      <div className={classnames(`${baseClassName}__slider`, className)} ref={panelRef}>
        <div className={`${baseClassName}__rail`} style={railStyle}></div>
        <span className={`${baseClassName}__thumb`} role="slider" tabIndex={0} style={styles}></span>
      </div>
    </div>
  );
};

export default React.memo(ColorSlider);
