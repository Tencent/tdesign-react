import React, { useRef, useEffect, useCallback } from 'react';
import { SATURATION_PANEL_DEFAULT_HEIGHT, SATURATION_PANEL_DEFAULT_WIDTH } from '../../const';
import Draggable, { Coordinate } from '../../../_common/js/color-picker/draggable';
import { TdColorBaseProps } from '../../interface';

const Saturation = (props: TdColorBaseProps) => {
  const { color, disabled, onChange, baseClassName } = props;
  const panelRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLElement>(null);
  const dragInstance = useRef<Draggable>(null);
  const panelRectRef = useRef({
    width: SATURATION_PANEL_DEFAULT_WIDTH,
    height: SATURATION_PANEL_DEFAULT_HEIGHT,
  });

  const styles = () => {
    const { saturation, value } = color;
    const { width, height } = panelRectRef.current;
    const top = Math.round((1 - value) * height);
    const left = Math.round(saturation * width);
    return {
      color: color.rgb,
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
    (coordinate: Coordinate, isEnded?: boolean) => {
      if (disabled) {
        return;
      }
      if (coordinate.x < 0 || coordinate.y < 0) {
        return;
      }

      const { saturation, value } = getSaturationAndValueByCoordinate(coordinate);
      onChange({
        saturation: saturation / 100,
        value: value / 100,
        addUsedColor: isEnded,
      });
    },
    [disabled, onChange],
  );

  const handleDragEnd = useCallback(
    (coordinate: Coordinate) => {
      if (disabled) {
        return;
      }

      isDragging.current = false;
      handleDrag(coordinate, true);
    },
    [disabled, handleDrag],
  );

  // 移动中
  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || disabled) {
        return;
      }

      const panelRect = panelRef.current.getBoundingClientRect();
      handleDrag({ x: e.clientX - panelRect.x, y: e.clientY - panelRect.y }, false);
    },
    [disabled, handleDrag],
  );

  const handleEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove, false);
    window.addEventListener('mouseup', handleEnd, false);
    return () => {
      window.removeEventListener('mousemove', handleMove, false);
      window.removeEventListener('mouseup', handleEnd, false);
    };
  }, [handleMove, handleEnd]);

  useEffect(() => {
    panelRectRef.current.width = panelRef.current.offsetWidth || SATURATION_PANEL_DEFAULT_WIDTH;
    panelRectRef.current.height = panelRef.current.offsetHeight || SATURATION_PANEL_DEFAULT_HEIGHT;
    dragInstance.current = new Draggable(panelRef.current, {
      start() {
        panelRectRef.current.width = panelRef.current.offsetWidth;
        panelRectRef.current.height = panelRef.current.offsetHeight;
      },
      drag: (coordinate: Coordinate) => {
        isDragging.current = true;
        handleDrag(coordinate);
      },
      end: handleDragEnd,
    });
    return () => dragInstance.current.destroy();
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
