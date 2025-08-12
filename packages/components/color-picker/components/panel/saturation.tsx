import React, { useCallback, useEffect, useRef } from 'react';
import {
  SATURATION_PANEL_DEFAULT_HEIGHT,
  SATURATION_PANEL_DEFAULT_WIDTH,
} from '@tdesign/common-js/color-picker/constants';
import useMouseEvent, { type MouseCoordinate } from '../../../hooks/useMouseEvent';
import type { TdColorBaseProps } from '../../interface';

const Saturation = (props: TdColorBaseProps) => {
  const { color, disabled, onChange, baseClassName } = props;
  const panelRef = useRef<HTMLDivElement>(null);
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

  const getSaturationAndValue = (coordinate: MouseCoordinate) => {
    const { width, height } = panelRectRef.current;
    const { x, y } = coordinate;
    const saturation = Math.round((x / width) * 100);
    const value = Math.round((1 - y / height) * 100);
    return {
      saturation,
      value,
    };
  };

  const handleDrag = useCallback(
    ({ x, y }: MouseCoordinate) => {
      if (disabled) return;
      const { saturation, value } = getSaturationAndValue({ x, y });
      onChange({
        saturation: saturation / 100,
        value: value / 100,
      });
    },
    [disabled, onChange],
  );

  useMouseEvent(panelRef, {
    onDown: () => {
      if (disabled) return;
      panelRectRef.current.width = panelRef.current.offsetWidth;
      panelRectRef.current.height = panelRef.current.offsetHeight;
    },
    onMove: (_, ctx) => {
      handleDrag(ctx.coordinate);
    },
    onUp: (_, ctx) => {
      handleDrag(ctx.coordinate);
    },
  });

  useEffect(() => {
    panelRectRef.current.width = panelRef.current?.offsetWidth || SATURATION_PANEL_DEFAULT_WIDTH;
    panelRectRef.current.height = panelRef.current?.offsetHeight || SATURATION_PANEL_DEFAULT_HEIGHT;
  }, [handleDrag]);

  return (
    <div
      ref={panelRef}
      className={`${baseClassName}__saturation`}
      style={{
        background: `hsl(${color.hue}, 100%, 50%)`,
      }}
    >
      <span className={`${baseClassName}__thumb`} role="slider" tabIndex={0} style={styles()}></span>
    </div>
  );
};

export default React.memo(Saturation);
