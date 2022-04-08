import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import { SLIDER_DEFAULT_WIDTH } from '../../const';
import Draggable, { Coordinate } from '../../../_common/js/color-picker/draggable';
import { TdColorBaseProps } from '../../interface';

export interface TdColorSliderProps extends TdColorBaseProps {
  className?: string;
  value?: Number;
  maxValue?: Number;
  railStyle?: Object;
}

const ColorSlider = (props: TdColorSliderProps) => {
  const { color, className = '', value = 0, railStyle = {}, maxValue = 360, baseClassName, disabled, onChange } = props;
  const panelRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLElement>(null);
  const dragInstance = useRef<Draggable>(null);
  const isMovedRef = useRef<boolean>(false);
  const panelRectRef = useRef({
    width: SLIDER_DEFAULT_WIDTH,
  });

  const styles = () => {
    const { width } = panelRectRef.current;
    if (!width) {
      return;
    }
    const left = Math.round((Number(value) / Number(maxValue)) * width);
    return {
      left: `${left}px`,
      color: color.rgb,
    };
  };

  const handleDrag = (coordinate: Coordinate, isEnded?: boolean) => {
    if (disabled) {
      return;
    }
    const { width } = panelRectRef.current;
    const { x } = coordinate;
    const value = Math.round((x / width) * Number(maxValue) * 100) / 100;
    isMovedRef.current = true;
    onChange(value, isEnded);
  };

  const handleDragEnd = (coordinate: Coordinate) => {
    if (disabled || !isMovedRef.current) {
      return;
    }

    handleDrag(coordinate, true);
    isMovedRef.current = false;
  };

  useEffect(() => {
    panelRectRef.current.width = panelRef.current.offsetWidth || SLIDER_DEFAULT_WIDTH;
    dragInstance.current = new Draggable(panelRef.current, {
      start(coordinate: Coordinate) {
        // pop模式下由于是隐藏显示，这个宽度让其每次点击的时候重新计算
        panelRectRef.current.width = panelRef.current.offsetWidth;
        isMovedRef.current = false;
        handleDrag(coordinate, false);
      },
      drag: (coordinate: Coordinate) => {
        handleDrag(coordinate);
      },
      end: handleDragEnd,
    });
    return () => dragInstance.current.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classnames(`${baseClassName}__slider`, className)} ref={panelRef}>
      <div className={`${baseClassName}__rail`} style={railStyle}></div>
      <span
        className={`${baseClassName}__thumb`}
        role="slider"
        tabIndex={0}
        ref={thumbRef}
        style={{ ...styles() }}
      ></span>
    </div>
  );
};

export default React.memo(ColorSlider);
