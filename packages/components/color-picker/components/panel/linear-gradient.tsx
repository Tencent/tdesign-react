import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { cloneDeep } from 'lodash-es';
import {
  genGradientPoint,
  GRADIENT_SLIDER_DEFAULT_WIDTH,
  gradientColors2string,
  type GradientColorPoint,
} from '@tdesign/common-js/color-picker/index';
import useCommonClassName from '../../../hooks/useCommonClassName';
import useMouseEvent from '../../../hooks/useMouseEvent';
import InputNumber from '../../../input-number';
import useClassName from '../../hooks/useClassNames';

const DELETE_KEYS: string[] = ['delete', 'backspace'];

type TSliderRect = {
  left: number;
  width: number;
};

const LinearGradient = (props) => {
  const { onChange, color, disabled } = props;
  const baseClassName = useClassName();
  const { STATUS: statusClassNames } = useCommonClassName();
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderRectRef = useRef<TSliderRect>({
    left: 0,
    width: GRADIENT_SLIDER_DEFAULT_WIDTH,
  });
  const degree = useRef(props.color.gradientDegree);
  const selectedRef = useRef(props.color.gradientSelectedId);
  const colors = useRef<GradientColorPoint[]>(cloneDeep(color.gradientColors));
  const [selectedId, setSelectedId] = useState(props.color.gradientSelectedId);
  const [colorsState, setColorsState] = useState<GradientColorPoint[]>(colors.current);

  useEffect(() => {
    degree.current = color?.gradientDegree;
    setSelectedId(color.gradientSelectedId);
    selectedRef.current = color.gradientSelectedId;
    colors.current = cloneDeep(color.gradientColors);
    setColorsState(colors.current);
  }, [color.gradientColors, color?.gradientDegree, color.gradientSelectedId, color.value, color.saturation]);

  const updateSliderRect = () => {
    const rect = sliderRef.current.getBoundingClientRect();
    sliderRectRef.current = {
      left: rect.left,
      width: rect.width || GRADIENT_SLIDER_DEFAULT_WIDTH,
    };
  };

  const handleChange = useCallback(
    (key: 'degree' | 'selectedId' | 'colors', payload: any) => {
      if (disabled) return;
      onChange({
        key,
        payload,
      });
    },
    [onChange, disabled],
  );

  const handleDegreeChange = (value: number) => {
    if (disabled || value === props.color.gradientDegree) {
      return;
    }
    degree.current = value;
    handleChange('degree', value);
  };

  const handleSelectedIdChange = (value: string) => {
    if (disabled) return;
    setSelectedId(value);
    selectedRef.current = value;
    handleChange('selectedId', value);
  };

  const handleColorsChange = useCallback(
    (value: GradientColorPoint[]) => {
      if (disabled) return;
      colors.current = value;
      setColorsState(value);
      handleChange('colors', value);
    },
    [disabled, handleChange],
  );

  const updateActiveThumbLeft = useCallback(
    (left: number) => {
      const index = colors.current.findIndex((c) => c.id === selectedRef.current);
      if (index === -1) {
        return;
      }
      const point = colors.current[index];
      const formatLeft = Math.max(0, Math.min(sliderRectRef.current.width, left));
      const percentLeft = (formatLeft / sliderRectRef.current.width) * 100;
      const newColors = colors.current.map((item, i) =>
        index !== i
          ? item
          : {
              color: point.color,
              left: percentLeft,
              id: point.id,
            },
      );
      handleColorsChange(newColors);
    },
    [handleColorsChange],
  );

  const handleStart = (id: string, e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    handleSelectedIdChange(id);
    // 让 slider 获取焦点，以便键盘事件生效。
    sliderRef.current.focus();
  };

  useMouseEvent(sliderRef, {
    onMove: (_, ctx) => {
      if (disabled) return;
      updateActiveThumbLeft(ctx.coordinate.x);
    },
  });

  const handleKeyup = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const points = [...colors.current];
    let pos = points.findIndex((c) => c.id === selectedRef.current);
    const { length } = points;
    // 必须保证有两个点
    if (DELETE_KEYS.includes(e.key.toLocaleLowerCase()) && length > 2 && pos >= 0 && pos <= length - 1) {
      points.splice(pos, 1);
      if (!points[pos]) {
        // eslint-disable-next-line no-nested-ternary
        pos = points[pos + 1] ? pos + 1 : points[pos - 1] ? pos - 1 : 0;
      }
      const current = points[pos];
      handleColorsChange(points);
      handleSelectedIdChange(current?.id);
    }
  };

  const handleThumbBarClick = (e: React.MouseEvent) => {
    if (disabled || !props.enableMultipleGradient) return;
    updateSliderRect();

    let left = e.clientX - sliderRectRef.current.left;
    left = Math.max(0, Math.min(sliderRectRef.current.width, left));
    const percentLeft = (left / sliderRectRef.current.width) * 100;

    const newPoint = genGradientPoint(percentLeft, props.color.rgba);
    const newColors = [...colors.current];
    newColors.push(newPoint);
    handleColorsChange(newColors);
    handleSelectedIdChange(newPoint.id);
  };

  useEffect(() => {
    updateSliderRect();
  }, []);

  const { gradientColors } = props.color;

  const thumbBackground = gradientColors2string({
    points: gradientColors,
    degree: 90,
  });

  const handleClickThumb = (e: React.MouseEvent, t: GradientColorPoint) => {
    handleSelectedIdChange(t.id);
    e.stopPropagation();
  };

  const allGradientColors = [...colorsState];
  const { color: leftColor } = genGradientPoint(0, allGradientColors[0]?.color);
  const { color: rightColor } = genGradientPoint(100, allGradientColors[allGradientColors.length - 1]?.color);

  return (
    <div className={`${baseClassName}__gradient`}>
      <div
        className={`${baseClassName}__gradient-slider`}
        style={{
          background: `linear-gradient(90deg, ${leftColor} 0%, ${leftColor} 50%, ${rightColor} 50%, ${rightColor} 100%)`,
        }}
      >
        <div
          ref={sliderRef}
          className={classNames(`${baseClassName}__slider`, `${baseClassName}--bg-alpha`)}
          onKeyUp={handleKeyup}
          tabIndex={0}
        >
          <ul
            className="gradient-thumbs"
            onClick={handleThumbBarClick}
            style={{
              background: thumbBackground,
            }}
          >
            {colorsState.map((t) => {
              const left = `${Math.round(t.left * 100) / 100}%`;
              return (
                <li
                  className={classNames([
                    `${baseClassName}__thumb`,
                    'gradient-thumbs__item',
                    selectedId === t.id ? statusClassNames.active : '',
                  ])}
                  key={t.id}
                  title={`${t.color} ${left}`}
                  style={{
                    color: t.color,
                    left,
                  }}
                  onClick={(e) => handleClickThumb(e, t)}
                  onMouseDown={(e) => handleStart(t.id, e)}
                >
                  <span className={classNames(['gradient-thumbs__item-inner', `${baseClassName}--bg-alpha`])}></span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={`${baseClassName}__gradient-degree`} title={`${degree}deg`}>
        <InputNumber
          theme="normal"
          min={0}
          max={360}
          step={1}
          size="small"
          format={(value: number) => `${value}°`}
          value={degree.current}
          onBlur={handleDegreeChange}
          onEnter={handleDegreeChange}
          onChange={handleDegreeChange}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};

export default React.memo(LinearGradient);
