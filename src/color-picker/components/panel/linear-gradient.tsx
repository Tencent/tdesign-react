import React, { KeyboardEvent, MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import classNames from 'classnames';
import useClassName from '../../hooks/useClassNames';
import { genGradientPoint, gradientColors2string } from '../../../_common/js/color-picker/color';
import { GradientColorPoint } from '../../../_common/js/color-picker/gradient';
import useCommonClassName from '../../../_util/useCommonClassName';
import { GRADIENT_SLIDER_DEFAULT_WIDTH } from '../../const';
import InputNumber from '../../../input-number';

const DELETE_KEYS: string[] = ['delete', 'backspace'];

type TSliderRect = {
  left: number;
  width: number;
};

const LinearGradient = (props) => {
  const { onChange, color, disabled } = props;
  const baseClassName = useClassName();
  const { STATUS: statusClassNames } = useCommonClassName();
  const refSlider = useRef<HTMLDivElement>(null);
  const sliderRectRef = useRef<TSliderRect>({
    left: 0,
    width: GRADIENT_SLIDER_DEFAULT_WIDTH,
  });
  const isDragging = useRef<Boolean>(false);
  const isMoved = useRef<Boolean>(false);
  const degree = useRef(props.color.gradientDegree);
  const [selectedId, setSelectedId] = useState(props.color.gradientSelectedId);
  const selectedRef = useRef(props.color.gradientSelectedId);
  const colors = useRef<GradientColorPoint[]>(cloneDeep(color.gradientColors));

  useEffect(() => {
    degree.current = color?.gradientDegree;
    setSelectedId(color.gradientSelectedId);
    selectedRef.current = color.gradientSelectedId;
    colors.current = cloneDeep(color.gradientColors);
  }, [color]);

  const updateSliderRect = () => {
    const rect = refSlider.current.getBoundingClientRect();
    sliderRectRef.current = {
      left: rect.left,
      width: rect.width || GRADIENT_SLIDER_DEFAULT_WIDTH,
    };
  };

  const handleChange = useCallback(
    (key: 'degree' | 'selectedId' | 'colors', payload: any, addUsedColor?: boolean) => {
      if (disabled) {
        return;
      }
      onChange({
        key,
        payload,
        addUsedColor,
      });
    },
    [onChange, disabled],
  );

  const handleDegreeChange = (value: number) => {
    if (props.disabled || value === props.color.gradientDegree) {
      return;
    }
    degree.current = value;
    handleChange('degree', value, true);
  };

  const handleSelectedIdChange = (value: string) => {
    if (props.disabled) {
      return;
    }
    setSelectedId(value);
    selectedRef.current = value;
    handleChange('selectedId', value);
  };

  const handleColorsChange = useCallback(
    (value: GradientColorPoint[], isEnded?: boolean) => {
      if (props.disabled) {
        return;
      }
      colors.current = value;
      handleChange('colors', value, isEnded);
    },
    [props.disabled, handleChange],
  );

  /**
   * 设置bar的位置
   * @param left
   * @returns
   */
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

  // 移动开始
  const handleStart = (id: string, e: ReactMouseEvent) => {
    if (isDragging.current || props.disabled) {
      return;
    }
    selectedRef.current = id;
    setSelectedId(id);
    isMoved.current = false;
    isDragging.current = true;
    e.preventDefault();
    e.stopPropagation();
    // handleSelectedIdChange(id);
    // 让 slider 获取焦点，以便键盘事件生效。
    refSlider.current.focus();
  };

  // 移动中
  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || disabled) {
        return;
      }

      const rect = refSlider.current.getBoundingClientRect();
      const left = e.clientX - rect.x;
      isMoved.current = true;
      updateActiveThumbLeft(left);
    },
    [disabled, updateActiveThumbLeft],
  );

  // 移动结束
  const handleEnd = useCallback(() => {
    if (!isDragging.current) {
      return;
    }
    setTimeout(() => {
      isDragging.current = false;
    }, 0);
    if (isMoved.current) {
      handleColorsChange(colors.current, true);
      isMoved.current = false;
    }
  }, [handleColorsChange]);

  const handleKeyup = (e: KeyboardEvent) => {
    if (props.disabled) {
      return;
    }
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
      handleColorsChange(points, true);
      handleSelectedIdChange(current?.id);
    }
  };

  const handleThumbBarClick = (e: ReactMouseEvent) => {
    if (props.disabled) {
      return;
    }
    updateSliderRect();

    let left = e.clientX - sliderRectRef.current.left;
    left = Math.max(0, Math.min(sliderRectRef.current.width, left));
    const percentLeft = (left / sliderRectRef.current.width) * 100;

    const newPoint = genGradientPoint(percentLeft, props.color.rgba);
    const newColors = [...colors.current];
    newColors.push(newPoint);
    handleColorsChange(newColors, true);
    handleSelectedIdChange(newPoint.id);
  };

  useEffect(() => {
    updateSliderRect();

    window.addEventListener('mousemove', handleMove, false);
    window.addEventListener('mouseup', handleEnd, false);
    window.addEventListener('contextmenu', handleEnd, false);

    return () => {
      window.removeEventListener('mousemove', handleMove, false);
      window.removeEventListener('mouseup', handleEnd, false);
      window.removeEventListener('contextmenu', handleEnd, false);
    };
    // eslint-disable-next-line
  }, []);

  const { gradientColors } = props.color;

  const thumbBackground = gradientColors2string({
    points: gradientColors,
    degree: 90,
  });

  const handleClickThumb = (e: ReactMouseEvent, t) => {
    handleSelectedIdChange(t.id);
    e.stopPropagation();
  };

  const allGradientColors = [...colors.current];
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
          className={classNames(`${baseClassName}__slider`, `${baseClassName}--bg-alpha`)}
          onKeyUp={handleKeyup}
          tabIndex={0}
          ref={refSlider}
        >
          <ul
            className="gradient-thumbs"
            onClick={handleThumbBarClick}
            style={{
              background: thumbBackground,
            }}
          >
            {colors.current.map((t) => {
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
                  onMouseDown={(e: ReactMouseEvent) => handleStart(t.id, e)}
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
