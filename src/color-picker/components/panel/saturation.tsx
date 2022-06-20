import React, { useRef, useEffect, useCallback } from 'react';
import { SATURATION_PANEL_DEFAULT_HEIGHT, SATURATION_PANEL_DEFAULT_WIDTH } from '../../const';
import { TdColorBaseProps } from '../../interface';
import useDrag, { Coordinate } from '../../../_util/useDrag';

const Saturation = (props: TdColorBaseProps) => {
  const { color, disabled, onChange, baseClassName } = props;
  const panelRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLElement>(null);
  const panelRectRef = useRef({
    width: SATURATION_PANEL_DEFAULT_WIDTH,
    height: SATURATION_PANEL_DEFAULT_HEIGHT,
  });

  const styles = () => {
    const { saturation, value, rgb } = color;
    const { width, height } = panelRectRef.current;
    const top = Math.round((1 - value) * height);
    const left = Math.round(saturation * width);
    return {
      color: rgb,
      left: `${left}px`,
      top: `${top}px`,
    };
  };

  const getSaturationAndValueByCoordinate = (coordinate: Coordinate) => {
    const { width, height } = panelRectRef.current;
    const { x, y } = coordinate;
    const saturation = Math.round((x / width) * 100);
    const value = Math.round((1 - y / height) * 100);
    return {
      saturation,
      value,
    };
  };

  const isDragging = useRef<Boolean>(false);

  const handleDrag = useCallback(
    ({ x, y }: Coordinate, isEnd?: boolean) => {
      if (disabled) {
        return;
      }
      isDragging.current = true;
      const { saturation, value } = getSaturationAndValueByCoordinate({ x, y });
      onChange({
        saturation: saturation / 100,
        value: value / 100,
        addUsedColor: isEnd,
      });
    },
    [disabled, onChange],
  );

  const handleDragEnd = useCallback((coordinate: Coordinate) => {
    if (disabled) {
      return;
    }
    isDragging.current = false;
    handleDrag(coordinate, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDrag(panelRef, {
    start: () => {
      panelRectRef.current.width = panelRef.current.offsetWidth;
      panelRectRef.current.height = panelRef.current.offsetHeight;
    },
    end: (coordinate: Coordinate) => {
      handleDragEnd(coordinate);
    },
    drag: (coordinate: Coordinate) => {
      handleDrag(coordinate);
    },
  });

  useEffect(() => {
    panelRectRef.current.width = panelRef.current.offsetWidth || SATURATION_PANEL_DEFAULT_WIDTH;
    panelRectRef.current.height = panelRef.current.offsetHeight || SATURATION_PANEL_DEFAULT_HEIGHT;
  }, [handleDrag, handleDragEnd]);

  return (
    <div
      className={`${baseClassName}__saturation`}
      ref={panelRef}
      style={{
        background: `hsl(${color.hue}, 100%, 50%)`,
      }}
    >
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

export default React.memo(Saturation);
